import { config } from "@/config/config";
import { GetAvatar } from "@/services/parami/api";
import { CalculateLPReward } from "@/services/parami/swap";
import { OwnerDidOfNft } from "@/services/subquery/subquery";
import { useEffect, useState } from "react";
import { useModel } from "umi";
import { notification } from 'antd';
import { GetUserInfo } from "@/services/parami/Info";

export default () => {
    const apiWs = useModel('apiWs');
    const [LPs, setLPs] = useState<Map<string, any>>(new Map());
    const [LPsArr, setLPsArr] = useState<any[]>([]);

    const currentAccount = localStorage.getItem('stashUserAddress');

    const getTokenList = async () => {
        if (!apiWs || !currentAccount) {
            return;
        }
        const allLPs: Map<string, any> = new Map();
        const LPTokens: any = await apiWs.query.swap.account.entries(currentAccount);
        for (const tokenId in LPTokens) {
            const tokenInfo: any = LPTokens[tokenId][0].toHuman();
            const LPTokenId = tokenInfo[1];
            await apiWs.query.swap.liquidity(LPTokenId, async (LPInfoData: any) => {
                const LPInfo = LPInfoData.toHuman();
                if (!!LPInfo) {
                    LPInfo['lpId'] = LPTokenId;
                    const reward = await CalculateLPReward(LPTokenId);
                    LPInfo['reward'] = reward;

                    const did = await OwnerDidOfNft(LPInfo.tokenId);
                    const kol = await GetUserInfo(did);
                    let icon: any;
                    if (!!kol?.avatar && kol?.avatar.indexOf('ipfs://') > -1) {
                        const hash = kol?.avatar.substring(7);
                        const { response, data } = await GetAvatar(config.ipfs.endpoint + hash);

                        // Network exception
                        if (!response) {
                            notification.error({
                                message: 'Network exception',
                                description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
                                duration: null,
                            });
                            return;
                        }

                        if (response.status === 200) {
                            icon = window.URL.createObjectURL(data);
                        }
                    }

                    await apiWs.query.assets.metadata(Number(LPInfo.tokenId), async (tokenMetadata: any) => {
                        const tokenMeta = tokenMetadata.toHuman();
                        if (!allLPs[LPInfo.tokenId]) {
                            allLPs.set(LPInfo.tokenId, {
                                id: LPInfo.tokenId,
                                name: tokenMeta.name,
                                symbol: tokenMeta.symbol,
                                icon,
                                nfts: [],
                            });
                        }
                        allLPs.get(LPInfo.tokenId).nfts.push(LPInfo);
                        setLPs(allLPs);
                        setLPsArr([...allLPs?.values()]);
                    });
                }
            });
        }
        setLPs(allLPs);
        setLPsArr([...allLPs?.values()]);
    }

    useEffect(() => {
        if (apiWs && currentAccount) {
            getTokenList();
        }
    }, [apiWs, currentAccount]);

    return {
        LPs,
        LPsArr,
        getTokenList,
    }
}