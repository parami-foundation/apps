import React, { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import { hexToDid, parseAmount } from '@/utils/common';
import User from '../User';
import Stat from '../Stat';
import { notification } from 'antd';
import { GetAssetDetail, GetAssetInfo } from '@/services/parami/Assets';
import { GetNFTMetaData } from '@/services/parami/NFT';
import { DrylySellToken, GetSimpleUserInfo } from '@/services/parami/RPC';
import { GetAvatar, QueryAssetById } from "@/services/parami/HTTP";
import Support from '../Supoort';
import { parseUrlParams } from '@/utils/url.util';
import ClockIn from '../components/ClockIn/ClockIn';
import { getNumberOfHolders } from '@/services/subquery/subquery';

const DAO: React.FC = () => {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const [avatar, setAvatar] = useState<string>('');
    const [KOL, setKOL] = useState<boolean>(true);
    const [user, setUser] = useState<any>();
    const [asset, setAsset] = useState<any>();
    const [nftId, setNftId] = useState<string>();
    const [nft, setNft] = useState<any>();
    const [showClockIn, setShowClockIn] = useState<boolean>(false);
    const [assetPrice, setAssetPrice] = useState<string>('');
    const [totalSupply, setTotalSupply] = useState<bigint>(BigInt(0));
    const [member, setMember] = useState<any>();

    const intl = useIntl();

    const errorHandler = (e) => {
        notification.error({
            message: e.message,
            duration: null,
        });
    }

    useEffect(() => {
        const params = parseUrlParams() as { nftId: string };
        if (params.nftId) {
            setNftId(params.nftId);
        } else {
            history.push('/wallet');
        }
    }, []);

    useEffect(() => {
        if (nft?.owner === wallet?.did) {
            setShowClockIn(true);
        }
        // debug
        setShowClockIn(true);
    }, [nft, wallet])

    useEffect(() => {
        if (asset || nft) {
            document.title = `DAO - ${asset?.name ?? hexToDid(nft?.owner)} - Para Metaverse Identity`;
        }
    }, [asset, nft]);

    useEffect(() => {
        const queryAssetInfo = async () => {
            const assetData = await GetAssetInfo(nft?.tokenAssetId as string);
            // If don't mint any nft
            if (assetData.isEmpty) {
                setKOL(false);
                return;
            }

            const assetInfo = assetData.toHuman() as any;
            setAsset(assetInfo);
        }

        if (nft) {
            try {
                queryAssetInfo();
            } catch (e) {
                errorHandler(e);
            }
        }
    }, [nft]);

    const queryNftMetaData = async (nftId: string) => {
        const nftInfoData = await GetNFTMetaData(nftId);

        // If don't have any nft
        if (!nftInfoData) {
            notification.error({
                message: 'This KOL does not own any NFT',
                duration: null,
            })
            history.goBack();
            return;
        }

        setNft(nftInfoData);
    }

    const queryUser = async (did: string) => {
        const userData = await GetSimpleUserInfo(did);
        if (!userData) {
            notification.error({
                message: intl.formatMessage({
                    id: 'error.identity.notFound',
                }),
                duration: null,
            });
            history.goBack();
            return;
        };
        setUser(userData);
    }

    const queryTokenIcon = async (nftId: string) => {
        const { data: assetData } = await QueryAssetById(nftId);
        if (assetData?.token) {
            const { data, response } = await GetAvatar(assetData.token.icon) as any;
            if (response?.status === 200) {
                setAvatar(window.URL.createObjectURL(data));
            }
        }
    }

    useEffect(() => {
        if (nft) {
            queryUser(nft.owner);
        }
    }, [nft])

    useEffect(() => {
        if (apiWs && nftId) {
            try {
                queryNftMetaData(nftId);
                queryTokenIcon(nftId);
            } catch (e) {
                errorHandler(e);
            }
        };
    }, [apiWs, nftId]);

    const queryAssetPrice = async () => {
        const value = await DrylySellToken(nft?.tokenAssetId, parseAmount('1'));
        setAssetPrice(value.toString());
    }

    const queryTotalSupply = async () => {
        const assetDetail = await GetAssetDetail(nft?.tokenAssetId);
        const supply: string = assetDetail.unwrap().supply.toString();
        setTotalSupply(BigInt(supply));
    }

    const queryMember = async () => {
        const members = await getNumberOfHolders(nft?.tokenAssetId);
        setMember(members);
    }

    useEffect(() => {
        if (nft && asset) {
            try {
                queryAssetPrice();
                queryTotalSupply();
                queryMember();
            } catch (e) {
                errorHandler(e);
            }
        }
    }, [nft, asset]);

    return <>
        <div className={styles.mainTopContainer}>
            <div className={styles.pageContainer}>
                {nft && <>
                    <User
                        avatar={avatar}
                        did={hexToDid(nft.owner)}
                        user={user}
                        asset={asset}
                        assetId={nft.tokenAssetId}
                    />
                </>}

                {KOL && (
                    <>
                        <Stat
                            asset={asset}
                            assetPrice={assetPrice}
                            totalSupply={totalSupply}
                            member={member}
                        />
                    </>
                )}

                {showClockIn && <>
                    <ClockIn nftId={nftId!}></ClockIn>
                </>}

                {!KOL && nft && <>
                    <Support nft={nft}></Support>
                </>}
            </div>
        </div>
    </>;
};

export default DAO;
