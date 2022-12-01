import { getAssetsList, OwnerDidOfNft } from '@/services/subquery/subquery';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import style from './AdFeed.less';
import InfiniteScroll from 'react-infinite-scroll-component';
import { List, Spin } from 'antd';
import Advertisement from '../Advertisement/Advertisement';
import { QueryAdData } from '@/services/parami/Advertisement';

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
        
        return await QueryAdData(assetId, wallet.did);
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
                                <Advertisement ad={item} userDid={wallet.did}></Advertisement>
                            </List.Item>
                        }}
                    ></List>
                </>}
            </InfiniteScroll>
        </div>
    </>;
};

export default AdFeed;
