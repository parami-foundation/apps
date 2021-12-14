import config from "@/config/config";
import { GetAvatar } from "@/services/parami/api";
import { getOrInit } from "@/services/parami/init";
import { GetUserInfo, GetValueOf } from "@/services/parami/nft";
import { OwnerDidOfNft } from "@/services/subquery/subquery";
import { formatBalance } from "@polkadot/util";
import { notification } from "antd";
import { useEffect, useState } from "react";

export default () => {
    const [first, setFirst] = useState((new Date()).getTime());
    const [assets, setAssets] = useState<Map<string, any>>(new Map());

    const currentAccount = localStorage.getItem('dashboardStashUserAddress');

    const getAssets = async () => {
        const api = await getOrInit();

        const allEntries = await api.query.assets.metadata.entries();
        const tmpAssets = {};
        for (let i = 0; i < allEntries.length; i++) {
            const [key, value] = allEntries[i];
            const shortKey = key.toHuman();
            const meta: any = value.toHuman();
            if (shortKey && !meta?.name?.endsWith('LP*')) {
                tmpAssets[shortKey[0]] = value.toHuman();
            }
        }
        for (const assetId in tmpAssets) {
            api.query.assets.account(Number(assetId), currentAccount, async (result: any) => {
                const { balance } = result;

                const ad3 = await GetValueOf(assetId, balance);
                const did = await OwnerDidOfNft(assetId);
                const kol = await GetUserInfo(did);
                let icon: any;
                const info = kol.toHuman();
                if (!info) {
                    return;
                }
                if (info['avatar'].indexOf('ipfs://') > -1) {
                    const hash = info['avatar'].substring(7);
                    const { response, data } = await GetAvatar(config.ipfs.endpoint + hash);
                    if (response.status === 200) {
                        icon = window.URL.createObjectURL(data);
                    }
                }

                let changes = BigInt(0);
                if (!assets.has(assetId)) {
                    changes = BigInt(balance);
                } else {
                    changes = BigInt(balance) - BigInt(assets.get(assetId).balance);
                }

                // TODO: time events(first)
                if (((new Date()).getTime() - first >= 30000) && changes) {
                    notification.success({
                        message: `Dashboard: Changes in ${tmpAssets[assetId].name}`,
                        description: formatBalance(changes, { withUnit: tmpAssets[assetId].symbol }, 18),
                    });
                }

                assets.set(assetId, {
                    id: assetId,
                    token: tmpAssets[assetId].name,
                    symbol: tmpAssets[assetId].symbol,
                    balance: `${balance}`,
                    ad3: `${ad3}`,
                    icon,
                });

                setAssets(assets)
            });
        }

        setAssets(assets)
    }

    useEffect(() => {
        getAssets();
    }, []);

    return assets;
}