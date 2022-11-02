import { QueryAssetById } from "@/services/parami/HTTP";
import { DrylySellToken } from "@/services/parami/RPC";
import { OwnerDidOfNft, getAssetsList } from "@/services/subquery/subquery";
import { isLPAsset } from "@/utils/assets.util";
import { formatBalance } from "@polkadot/util";
import { notification } from "antd";
import { useCallback, useState } from "react";
import { useModel, history } from "umi";
import { tokenIconMap } from "./chainbridge";

let flag = false;

export default () => {
  const apiWs = useModel('apiWs');
  const [first] = useState((new Date()).getTime());
  const [assets, setAssets] = useState<Map<string, any>>(new Map());
  const [assetsArr, setAssetsArr] = useState<any[] | null>(null);

  const [unsub, setUnsub] = useState<() => void>();

  const getAssets = useCallback(async (account) => {
    if (flag || !apiWs || !account) {
      return;
    }
    flag = true;

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

              let changes = BigInt(0);
              if (!assets.has(entry?.assetId)) {
                changes = balanceBigInt;
              } else {
                changes = balanceBigInt - BigInt(assets.get(entry?.assetId).balance);
              }

              const decimals = parseInt(metadata.decimals, 10) ?? 18;

              // TODO: time events(first)
              if (((new Date()).getTime() - first >= 30000) && changes) {
                notification.success({
                  key: 'assetsChange',
                  message: `Changes in ${metadata?.name}, click for details`,
                  description: formatBalance(changes, { withUnit: metadata?.symbol }, decimals),
                  onClick: () => {
                    history.push("/wallet");
                  }
                });
              }

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


            setAssets(assets);
            setAssetsArr([...assets?.values()]);
          });

          setUnsub(() => unsub);
        }
      }
    }
  }, [unsub, apiWs])

  return { assets, assetsArr, getAssets };
}