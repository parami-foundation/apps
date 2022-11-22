import config from '@/config/config';
import { getAssetsList, getNumberOfHolders, OwnerDidOfNft } from '@/services/subquery/subquery';
import { parseAmount } from '@/utils/common';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import style from './AdFeed.less';
import InfiniteScroll from 'react-infinite-scroll-component';
import { List, Spin } from 'antd';
import { QueryAssetById } from '@/services/parami/HTTP';
import Advertisement from '../Advertisement/Advertisement';

export interface AdFeedProps { }

function AdFeed({ }: AdFeedProps) {
    const apiWs = useModel('apiWs');
    const [adList, setAdList] = useState<any[]>();
    const [adCount, setAdCount] = useState<number>(10);
    const [assetIds, setAssetIds] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { wallet } = useModel('currentUser');

    const fetchAd = async (assetId: string) => {
        const did = await OwnerDidOfNft(assetId);
        if (!did) {
            return null;
        }

        const ad = { nftId: assetId } as any;

        const assetInfo = await apiWs!.query.assets.metadata(assetId);
        const asset = assetInfo.isEmpty ? {} : assetInfo.toHuman();

        const { data } = await QueryAssetById(assetId);
        ad.kolIcon = data?.token?.icon ?? '/images/logo-square-core.svg';

        ad.assetName = asset.name;
        ad.numHolders = await getNumberOfHolders(assetId);

        const header = await apiWs!.rpc.chain.getHeader() as any;
        const blockHash = await apiWs!.rpc.chain.getBlockHash(header.number - (24 * 60 * 60) / 12);

        const value = await (apiWs!.rpc as any).swap.drylySellTokens(assetId, parseAmount('1'));
        const tokenPrice = value.toHuman();

        let preTokenPrice;
        try {
            const preValue = await (apiWs!.rpc as any).swap.drylySellTokens(assetId, parseAmount('1'), blockHash);
            preTokenPrice = preValue.toHuman();
        } catch (_) { }

        ad.tokenPrice = tokenPrice;
        ad.preTokenPrice = preTokenPrice;

        const slotResp = await apiWs!.query.ad.slotOf(assetId);

        if (slotResp.isEmpty) {
            return ad;
        }

        const { adId } = slotResp.toHuman() as { adId: string };
        const adResp = await apiWs!.query.ad.metadata(adId);

        if (adResp.isEmpty) {
            return ad;
        };

        const adMetadata = adResp.toHuman() as { metadata: string };

        let adJson = {};
        if (adMetadata?.metadata?.startsWith('ipfs://')) {
            const hash = adMetadata?.metadata?.substring(7);
            const adJsonResp = await fetch(config.ipfs.endpoint + hash);
            adJson = await adJsonResp.json();
        }

        const adClaimed = !(await apiWs!.query.ad.payout(adId, wallet.did)).isEmpty;

        return {
            ...ad,
            ...adJson,
            adId,
            adClaimed
        }
    }

    const loadAds = async (assetIds: string[]) => {
        setLoading(true);
        const ads = await Promise.all(assetIds.map(assetId => fetchAd(assetId)));
        setLoading(false);
        setAdList([...(adList ?? []), ...ads]);
    }

    useEffect(() => {
        if (wallet) {
            getAssetsList(wallet.account).then(entries => {
                setAssetIds((entries ?? []).map(entry => entry?.assetId).filter(Boolean));
            })
        }
    }, [wallet]);

    useEffect(() => {
        if (apiWs && adCount > (adList ?? []).length && (adList ?? []).length < assetIds.length) {
            loadAds(assetIds.slice((adList ?? []).length, adCount));
        }
    }, [apiWs, assetIds, adCount, adList]);

    return <>
        <div className={style.container} id="scrollableDiv">
            <InfiniteScroll
                dataLength={(adList ?? []).length}
                next={() => {
                    if (loading) {
                        return;
                    }
                    setAdCount(adCount + 10)
                }}
                hasMore={!adList || adList.length < assetIds.length}
                loader={<Spin style={{ height: '60px' }}></Spin>}
                scrollableTarget="scrollableDiv"
            >
                {adList && <>
                    <List
                        dataSource={(adList ?? []).filter(Boolean)}
                        renderItem={(item) => {
                            return <List.Item key={item.nftId}>
                                <Advertisement ad={item} userDid={wallet.did} claimed={item.adClaimed}></Advertisement>
                            </List.Item>
                        }}
                    ></List>
                </>}
            </InfiniteScroll>
        </div>
    </>;
};

export default AdFeed;
