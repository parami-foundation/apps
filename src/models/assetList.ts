import { QueryAssetById } from "@/services/parami/HTTP";
import { DrylySellToken } from "@/services/parami/RPC";
import { OwnerDidOfNft, getAssetsList } from "@/services/subquery/subquery";
import { isLPAsset } from "@/utils/assets.util";
import { useCallback, useState } from "react";
import { useModel } from "umi";
import { tokenIconMap } from "./chainbridge";

const fetchAssetPromisesMap = new Map();

export default () => {
  const apiWs = useModel('apiWs');
  const [assetsArr, setAssetsArr] = useState<any[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAsset = useCallback(async (assetId: string, account: string) => {
    if (!apiWs || !assetId || !account) {
      return null;
    }

    const metadata: any = (await apiWs.query.assets.metadata(assetId)).toHuman();

    if (!metadata || isLPAsset(metadata)) {
      return null;
    }

    const { balance = '' } = ((await apiWs!.query.assets.account(assetId, account)).toHuman() ?? {}) as { balance: string };
    const balanceBigInt = BigInt(balance.replaceAll(',', ''));
    if (!balanceBigInt) {
      return null;
    }

    let ad3, icon;
    const { data } = await QueryAssetById(assetId);
    if (data?.token) {
      icon = data.token.icon;
    }

    if (!icon) {
      icon = tokenIconMap[metadata.symbol];
    }

    const did = await OwnerDidOfNft(assetId);
    if (did) {
      ad3 = await DrylySellToken(assetId, balanceBigInt.toString());
    }

    const decimals = parseInt(metadata.decimals, 10) ?? 18;

    return {
      id: assetId,
      token: metadata?.name,
      symbol: metadata?.symbol,
      balance: balanceBigInt.toString(),
      decimals,
      isNftToken: !!did,
      ad3: ad3 ? `${ad3}` : '',
      icon,
    }
  }, [apiWs])

  const getAssets = useCallback(async (account: string, assetsCount: number = 10) => {
    setLoading(true);
    const entries = await getAssetsList(account);
    setTotalCount(entries?.length ?? 0);
    const assetIds = (entries ?? []).map(entry => entry?.assetId).filter(Boolean).slice(0, assetsCount);
    const assets = await Promise.all(assetIds.map(assetId => {
      if (!fetchAssetPromisesMap.has(assetId)) {
        fetchAssetPromisesMap.set(assetId, fetchAsset(assetId, account))
      }
      return fetchAssetPromisesMap.get(assetId);
    }));
    setAssetsArr(assets.filter(Boolean));
    setLoading(false);
  }, [fetchAsset])

  return { assetsArr, totalCount, loading, getAssets: apiWs ? getAssets : null };
}