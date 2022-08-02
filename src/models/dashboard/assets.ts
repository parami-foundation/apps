import config from "@/config/config";
import { GetAvatar } from "@/services/parami/HTTP";
import { GetUserInfo, DrylySellToken } from "@/services/parami/RPC";
import { getAssetsList, OwnerDidOfNft } from "@/services/subquery/subquery";
import { formatBalance } from "@polkadot/util";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { useModel } from "umi";

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
    const entries = await getAssetsList(dashboard.did!, dashboard.account!);
    if (!!entries) {
      if (entries.length === 0) {
        setAssetsArr([]);
      }
      for (const entry of entries) {
        const metadataRaw = await apiWs.query.assets.metadata(entry?.assetId);
        const metadata: any = metadataRaw.toHuman();
        //todo: filter LP*
        if (!!metadata && !metadata?.name.endsWith('LP*')) {
          const assetId = entry?.assetId;
          apiWs.query.assets.account(Number(assetId), dashboard?.account, async (result: any) => {
            const { balance = '' } = result.toHuman() ?? {};
            const balanceBigInt = BigInt(balance.replaceAll(',', ''));

            if (!!balanceBigInt && balanceBigInt > 0) {
              const ad3 = await DrylySellToken(assetId, balanceBigInt.toString());
              const did = await OwnerDidOfNft(assetId);
              const kol = await GetUserInfo(did);
              let icon: any;
              if (!!kol?.avatar && kol?.avatar.indexOf('ipfs://') > -1) {
                const hash = kol?.avatar.substring(7);
                const { response, data } = await GetAvatar(config.ipfs.endpoint + hash);

                // Network exception
                if (!response) {
                  notification.error({
                    key: 'networkException',
                    message: 'Network exception',
                    description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
                    duration: null,
                  });
                }

                if (response?.status === 200) {
                  icon = window.URL.createObjectURL(data);
                }
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

              if (!!balanceBigInt && balanceBigInt > 0 && !metadata?.name.endsWith('LP*')) {
                assets.set(assetId, {
                  id: assetId,
                  token: metadata?.name,
                  symbol: metadata?.symbol,
                  balance: balanceBigInt.toString(),
                  ad3: `${ad3}`,
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