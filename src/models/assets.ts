import { QueryAssetById } from "@/services/parami/HTTP";
import { DrylySellToken } from "@/services/parami/RPC";
import { OwnerDidOfNft, getAssetsList } from "@/services/subquery/subquery";
import { isLPAsset } from "@/utils/assets.util";
import { useCallback, useState } from "react";
import { useModel } from "umi";
import { tokenIconMap } from "./chainbridge";

let flag = false;

export default () => {
  const apiWs = useModel('apiWs');
  const [assetsArr, setAssetsArr] = useState<any[] | null>(null);

  const [unsub, setUnsub] = useState<() => void>();

  const getAssets = useCallback(async (account) => {
    if (flag || !apiWs || !account) {
      return;
    }
    flag = true;
    const assets = new Map();

    const entries = await getAssetsList(account);
    if (!!entries) {
      if (entries.length === 0) {
        setAssetsArr([]);
      }
      for (const entry of entries) {
        const metadataRaw = await apiWs!.query.assets.metadata(entry?.assetId);
        const metadata: any = metadataRaw.toHuman();

        if (!!metadata && !isLPAsset(metadata)) {
          const unsub = apiWs!.query.assets.account(Number(entry?.assetId), account, async (result: any) => {
            const { balance = '' } = result.toHuman() ?? {};
            const balanceBigInt = BigInt(balance.replaceAll(',', ''));
            if (!!balanceBigInt && balanceBigInt > 0) {
              let ad3, icon;
              const { data } = await QueryAssetById(entry?.assetId);
              if (data?.token) {
                icon = data.token.icon;
              }

              if (!icon) {
                icon = tokenIconMap[metadata.symbol];
              }

              const did = await OwnerDidOfNft(entry?.assetId);
              if (did) {
                ad3 = await DrylySellToken(entry?.assetId, balanceBigInt.toString());
              }

              const decimals = parseInt(metadata.decimals, 10) ?? 18;

              if (!!balanceBigInt && balanceBigInt > 0 && !isLPAsset(metadata)) {
                assets.set(entry?.assetId, {
                  id: entry?.assetId,
                  token: metadata?.name,
                  symbol: metadata?.symbol,
                  balance: balanceBigInt.toString(),
                  decimals,
                  isNftToken: !!did,
                  ad3: ad3 ? `${ad3}` : '',
                  icon,
                });
              }
            }

            setAssetsArr([...assets?.values()]);
          });

          setUnsub(() => unsub);
        }
      }
    }
  }, [unsub, apiWs])

  return { assetsArr, getAssets };
}