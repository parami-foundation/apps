import React, { useState } from 'react';
import style from './style.less';
import PairItem from './components/PairItem';
import { useModel } from 'umi';
import { useEffect } from 'react';
import { OwnerDidOfNft } from '@/services/subquery/subquery';
import { GetUserInfo } from '@/services/parami/nft';
import config from '@/config/config';

const List: React.FC = () => {
    const apiWs = useModel('apiWs');
    const [assets, setAssets] = useState<any[]>([]);

    const currentAccount = localStorage.getItem('stashUserAddress');

    const getTokenList = async () => {
        if (!apiWs) {
            return;
        }
        const allEntries = await apiWs.query.assets.metadata.entries();
        const tmpAssets = {};
        for (let i = 0; i < allEntries.length; i++) {
            const [key, value] = allEntries[i];
            const shortKey = key.toHuman();
            if (!!shortKey) {
                const id = shortKey[0].replaceAll(',', '');
                tmpAssets[id] = value.toHuman();
            }

            const data: any[] = [];
            if (!!tmpAssets) {
                for (const assetsID in tmpAssets) {
                    const { balance }: any = await apiWs.query.assets.account(Number(assetsID), currentAccount);
                    if (!!balance && balance > 0) {
                        let icon: any;
                        const did = await OwnerDidOfNft(assetsID);
                        const info = await GetUserInfo(did);
                        if (info['avatar'].indexOf('ipfs://') > -1) {
                            const hash = info['avatar'].substring(7);
                            icon = config.ipfs.endpoint + hash;
                        };
                        data.push({
                            id: assetsID,
                            token: tmpAssets[assetsID].name,
                            symbol: tmpAssets[assetsID].symbol,
                            balance: balance.toString(),
                            icon,
                        });
                    }
                }
                setAssets(data);
            }
        }
    }

    useEffect(() => {
        if (apiWs) {
            getTokenList();
        }
    }, [apiWs]);

    return (
        <>
            <div className={style.stakeListContainer}>
                {assets.map((item: any) => (
                    <PairItem
                        logo={item.icon}
                        asset={item}
                    />
                ))}
            </div>
        </>
    )
}

export default List;
