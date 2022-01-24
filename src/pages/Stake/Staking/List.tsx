import React, { useState } from 'react';
import style from './style.less';
import PairItem from './components/PairItem';
import { useModel } from 'umi';
import { useEffect } from 'react';
import { OwnerDidOfNft } from '@/services/subquery/subquery';
import { GetUserInfo } from '@/services/parami/nft';
import config from '@/config/config';
import { CalculateLPReward, GetAccountLPs, GetLPLiquidity } from '@/services/parami/swap';

const List: React.FC = () => {
    const apiWs = useModel('apiWs');
    const [LPs, setLPs] = useState<any[]>([]);

    const currentAccount = localStorage.getItem('stashUserAddress') as string;

    const getTokenList = async () => {
        if (!apiWs) {
            return;
        }
        const LPTokens = await GetAccountLPs(currentAccount);

        const LPList: Map<string, any> = new Map();
        LPTokens.map(async (tokenId) => {
            const tokenInfo: any = tokenId[0].toHuman();
            const LPTokenId = tokenInfo[1];
            const LPInfo: any = await GetLPLiquidity(LPTokenId);
            LPInfo['lpId'] = LPTokenId;
            const reward = await CalculateLPReward(LPTokenId);
            LPInfo['reward'] = reward;

            let icon: any;
            const did = await OwnerDidOfNft(LPInfo.tokenId);
            const info = await GetUserInfo(did);
            if (!!info?.avatar && info?.avatar.indexOf('ipfs://') > -1) {
                const hash = info?.avatar.substring(7);
                icon = config.ipfs.endpoint + hash;
            };
            const tokenMatadata = await (await apiWs.query.assets.metadata(Number(LPInfo.tokenId))).toHuman();
            if (!LPList[LPInfo.tokenId]) {
                LPList.set(LPInfo.tokenId, {
                    id: LPInfo.tokenId,
                    name: tokenMatadata.name,
                    symbol: tokenMatadata.symbol,
                    icon,
                    nfts: [],
                });
            }
            LPList.get(LPInfo.tokenId).nfts.push(LPInfo);
            console.log(LPList.get(LPInfo.tokenId))
            setLPs([...LPList?.values()]);
        });
    }

    useEffect(() => {
        if (apiWs) {
            getTokenList();
        }
    }, [apiWs]);

    return (
        <>
            <div className={style.stakeListContainer}>
                {LPs.map((lp: any) => (
                    <PairItem
                        logo={lp.icon}
                        lp={lp}
                    />
                ))}
            </div>
        </>
    )
}

export default List;
