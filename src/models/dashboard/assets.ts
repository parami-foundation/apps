import { QueryAssetById } from "@/services/parami/HTTP";
import { DrylySellToken } from "@/services/parami/RPC";
import { getAssetsList, OwnerDidOfNft } from "@/services/subquery/subquery";
import { isLPAsset } from "@/utils/assets.util";
import { formatBalance } from "@polkadot/util";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { useModel } from "umi";
import { tokenIconMap } from "../chainbridge";

export default () => {
  const apiWs = useModel('apiWs');
  const { dashboard } = useModel('currentUser');
  const [first] = useState((new Date()).getTime());
  const [assets, setAssets] = useState<Map<string, any>>(new Map());
  const [assetsArr, setAssetsArr] = useState<any[]>([]);

  const getAssets = async () => {
    if (!apiWs) {
      return;
    }
    const entries = await getAssetsList(dashboard.account!);
    if (!!entries) {
      if (entries.length === 0) {
        setAssetsArr([]);
      }
      for (const entry of entries) {
        const metadataRaw = await apiWs.query.assets.metadata(entry?.assetId);
        const metadata: any = metadataRaw.toHuman();

        if (!!metadata && !isLPAsset(metadata)) {
          const assetId = entry?.assetId;
          apiWs.query.assets.account(Number(assetId), dashboard?.account, async (result: any) => {
            const { balance = '' } = result.toHuman() ?? {};
            const balanceBigInt = BigInt(balance.replaceAll(',', ''));

            if (!!balanceBigInt && balanceBigInt > 0) {
              let ad3, icon;

              const {data} = await QueryAssetById(assetId);
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
              if (!assets.has(assetId)) {
                changes = balanceBigInt;
              } else {
                changes = balanceBigInt - BigInt(assets.get(assetId).balance);
              }

              // TODO: time events(first)
              if (((new Date()).getTime() - first >= 30000) && changes) {
                notification.success({
                  key: 'assetsChange',
                  message: `Changes in ${metadata?.name}`,
                  description: formatBalance(changes, { withUnit: metadata?.symbol }, 18),
                });
              }

              if (!!balanceBigInt && balanceBigInt > 0 && !isLPAsset(metadata)) {
                assets.set(assetId, {
                  id: assetId,
                  token: metadata?.name,
                  symbol: metadata?.symbol,
                  balance: balanceBigInt.toString(),
                  decimals: parseInt(metadata.decimals, 10),
                  isNftToken: !!did,
                  ad3: ad3 ? `${ad3}` : '',
                  icon,
                });
              }
            }

            setAssets(assets);
            setAssetsArr([...assets?.values()]);
          });
        }
      }
    }
    setAssets(assets);
    setAssetsArr([...assets?.values()]);
  }

  useEffect(() => {
    if (apiWs) {
      getAssets();
    }
  }, [apiWs]);

  return { assets, assetsArr };

}