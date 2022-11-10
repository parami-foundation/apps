import { QueryAssetById } from "@/services/parami/HTTP";
import { OwnerDidOfNft } from "@/services/subquery/subquery";
import { useEffect, useState } from "react";
import { useModel } from "umi";
import { CalculateLPReward } from "@/services/parami/RPC";
import { deleteComma } from "@/utils/format";
import { GetAccountLPTokenIds } from "@/services/parami/Swap";

export default () => {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const [LPs, setLPs] = useState<Map<string, any>>(new Map());
    const [LPsArr, setLPsArr] = useState<any[]>([]);

    const getTokenList = async () => {
        if (!apiWs || !wallet?.account) {
            return;
        }
        const allLPs: Map<string, any> = new Map();
        const lpTokenIds = await GetAccountLPTokenIds(wallet?.account);
        lpTokenIds.forEach(async tokenId => {
            await apiWs.query.swap.liquidity(tokenId, async (LPInfoData: any) => {
                const LPInfo = LPInfoData.toHuman();
                if (!!LPInfo) {
                    LPInfo.tokenId = deleteComma(LPInfo.tokenId);
                    LPInfo['lpId'] = tokenId;
                    try {
                        const reward = await CalculateLPReward(tokenId);
                    LPInfo['reward'] = reward;
                    } catch (e) {
                        console.log('Cal reward error', e);
                    }
                    

                    const did = await OwnerDidOfNft(LPInfo.tokenId);
                    if (!did) return;

                    let icon: string;
                    const {data} = await QueryAssetById(LPInfo.tokenId);
                    if (data?.token) {
                        icon = data.token.icon;
                    }

                    await apiWs.query.assets.metadata(Number(LPInfo.tokenId), async (tokenMetadata: any) => {
                        const tokenMeta = tokenMetadata.toHuman();
                        if (!allLPs.get(LPInfo.tokenId)) {
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
        });
        setLPs(allLPs);
        setLPsArr([...allLPs?.values()]);
    }

    useEffect(() => {
        if (!!apiWs && !!wallet?.account) {
            getTokenList();
        }
    }, [apiWs, wallet]);


    return {
        LPs,
        LPsArr,
        getTokenList,
    }
}