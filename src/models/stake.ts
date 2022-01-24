import { config } from "@/config/config";
import { GetUserInfo } from "@/services/parami/nft";
import { CalculateLPReward } from "@/services/parami/swap";
import { OwnerDidOfNft } from "@/services/subquery/subquery";
import { useEffect, useState } from "react";
import { useModel } from "umi";

export default () => {
    const apiWs = useModel('apiWs');
    const [LPList] = useState<Map<string, any>>(new Map());
    const [LPs, setLPs] = useState<Map<string, any>>(new Map());
    const [LPsArr, setLPsArr] = useState<any[]>([]);

    const currentAccount = localStorage.getItem('stashUserAddress') as string;

    const getTokenList = async () => {
        if (!apiWs) {
            return;
        }
        await apiWs.query.swap.account.entries(currentAccount, async (LPTokens) => {
            for (const tokenId in LPTokens) {
                const tokenInfo: any = LPTokens[tokenId][0].toHuman();
                const LPTokenId = tokenInfo[1];
                await apiWs.query.swap.liquidity(LPTokenId, async (LPInfoData) => {
                    const LPInfo = LPInfoData.toHuman();
                    if (!!LPInfo) {
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
                        setLPs(LPList);
                        setLPsArr([...LPList?.values()]);
                    }
                });
            }
        });
    }

    useEffect(() => {
        if (apiWs) {
            getTokenList();
        }
    }, [apiWs]);

    return { LPs, LPsArr };
}