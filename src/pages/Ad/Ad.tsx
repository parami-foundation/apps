import React, { useEffect, useState } from 'react';
import styles from '@/pages/wallet.less';
import style from './Ad.less';
import { history, useAccess, useIntl, useModel } from 'umi';
import { hexToDid } from '@/utils/common';
import { GetNFTMetaData } from '@/services/parami/NFT';
import { Image, notification, Button, Divider } from 'antd';
import config from '@/config/config';
import { GetSlotAdOf } from '@/services/parami/Advertisement';
import BigModal from '@/components/ParamiModal/BigModal';
import { GetAssetInfo, GetBalanceOfBudgetPot } from '@/services/parami/Assets';
import Footer from '@/components/Footer';
import { GetAvatar, QueryAssetById } from "@/services/parami/HTTP";
import { deleteComma } from '@/utils/format';
import Advertisement from '../Creator/Explorer/Advertisement';
import { parseUrlParams } from '@/utils/url.util';

export interface AdProps { }

function Ad({ }: AdProps) {
    const apiWs = useModel('apiWs');
    const { bodyHeight } = useModel('bodyChange');
    const [loading, setLoading] = useState<boolean>(true);
    const [avatar, setAvatar] = useState<string>('');
    const [KOL, setKOL] = useState<boolean>(true);
    const [nftId, setNftId] = useState<string>();
    const [nft, setNft] = useState<any>();
    const [asset, setAsset] = useState<any>();
    const [notAccess, setNotAccess] = useState<boolean>(false);
    const [adSlot, setAdSlot] = useState<any>();
    const [adData, setAdData] = useState<any>();
    const [ad, setAd] = useState<Type.AdInfo>(null);
    const [balance, setBalance] = useState<string>('');
    const [ownerDid, setOwnerDid] = useState<string>();


    const intl = useIntl();
    const access = useAccess();

    const avatarTop = document.getElementById('avatar')?.offsetTop;
    const avatarLeft = document.getElementById('avatar')?.offsetLeft;
    const windowWidth = document.body.clientWidth;

    useEffect(() => {
        const params = parseUrlParams() as { nftId: string };
        if (params.nftId) {
            setNftId(params.nftId);
        } else {
            history.push('/wallet');
        }
    }, []);

    // Get Referrer
    const { query } = history.location;
    const { referrer } = query as { referrer: string };

    const errorHandler = (e) => {
        notification.error({
            message: e.message,
            duration: null,
        });
    }

    const queryAdSlot = async (nftId: string) => {
        const slot = await GetSlotAdOf(nftId);
        if (!slot) {
            history.replace(`/dao/?nftId=${nftId}`);
            return;
        }
        setAdSlot(slot);
    }

    const queryAdJson = async (data) => {
        if (data?.metadata?.indexOf('ipfs://') < 0) return;

        const hash = data?.metadata?.substring(7);

        const res = await fetch(config.ipfs.endpoint + hash);
        const adJson: Type.AdInfo = await res.json();

        if (!adJson) return;

        setAd(adJson);

        if (!adJson.media) {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (adSlot) {
            try {
                const adData = adSlot.ad;
                if (!adData?.metadata) return;
                setAdData(adData);
                queryAdJson(adData);
                GetBalanceOfBudgetPot(adSlot.budgetPot, adSlot.fractionId).then(res => {
                    setBalance(deleteComma(res?.balance ?? ''));
                }).catch(e => {
                    console.error('GetBalanceOfBudgetPot error:', e);
                });
            } catch (e) {
                errorHandler(e);
            }
        }
    }, [adSlot])

    useEffect(() => {
        document.title = `${asset?.name} - Para Metaverse Identity`;
    }, [asset]);

    const queryNftMetaData = async (nftId) => {
        const nftInfoData = await GetNFTMetaData(nftId);

        // If don't have any nft
        if (!nftInfoData) {
            notification.error({
                message: intl.formatMessage({
                    id: 'error.nft.notFound',
                }),
                duration: null,
            })
            history.goBack();
            return;
        }

        setOwnerDid(hexToDid(nftInfoData.owner));
        setNft(nftInfoData);
    }

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

    const queryAvatar = async (nftId: string) => {
        const { data: assetData } = await QueryAssetById(nftId);
        if (assetData?.token) {
            const { data, response } = await GetAvatar(assetData.token.icon) as any;
            if (response?.status === 200) {
                setAvatar(window.URL.createObjectURL(data));
            }
        }
    }

    useEffect(() => {
        if (!access.canWalletUser) {
            localStorage.setItem('parami:wallet:redirect', window.location.href);
            setNotAccess(true);
        };

        if (apiWs && nftId) {
            try {
                queryAdSlot(nftId);
                queryNftMetaData(nftId);
                queryAvatar(nftId);
            } catch (e) {
                errorHandler(e);
            }
        };
    }, [apiWs, nftId]);

    return (
        <>
            <div
                className={style.explorerContainer}
            >
                {KOL && (
                    <>
                        <Image
                            src={avatar || '/images/default-avatar.svg'}
                            fallback='/images/default-avatar.svg'
                            className={style.avatar}
                            style={{
                                top: loading ? (bodyHeight - 400) / 2 : avatarTop,
                                left: loading ? (windowWidth - 200) / 2 : avatarLeft,
                                width: loading ? 200 : 30,
                                height: loading ? 200 : 30,
                                animation: loading ? 1 : 0,
                                position: loading ? 'fixed' : 'absolute',
                                display: loading || (adData && Object.keys(adData).length) ? 'flex' : 'none',
                            }}
                            preview={false}
                        />
                        <div
                            className={style.loading}
                            style={{
                                opacity: loading ? 1 : 0,
                                zIndex: loading ? 15 : -1,
                                height: bodyHeight,
                                minHeight: '100vh',
                            }}
                        >
                            <span className={style.loadingTip}>
                                {intl.formatMessage({
                                    id: 'creator.explorer.loading.tip',
                                    defaultMessage: 'Let\'s find out more about the NFT.{br} Surprise awaits...',
                                }, {
                                    br: <br />
                                })}
                            </span>
                        </div>
                    </>
                )}
                {(KOL && adData && Object.keys(adData).length > 0) && (
                    <div
                        className={styles.pageContainer}
                        style={{
                            paddingTop: 50,
                            maxWidth: '100%'
                        }}
                    >
                        <Advertisement
                            ad={ad}
                            nftId={nftId!}
                            referrer={referrer}
                            asset={asset}
                            avatar={avatar}
                            did={ownerDid!}
                            adData={adData}
                            balance={balance}
                            notAccess={notAccess}
                            adImageOnLoad={() => {
                                setLoading(false)
                            }}
                        />
                    </div>
                )}

                <Footer />
            </div>

            <BigModal
                visable={notAccess}
                title={intl.formatMessage({
                    id: 'error.identity.notUser',
                })}
                content={
                    <div className={style.notUser}>
                        <div className={style.buttons}>
                            <Button
                                block
                                size='large'
                                type='primary'
                                shape='round'
                                className={style.button}
                                onClick={() => {
                                    history.push(config.page.createPage);
                                }}
                            >
                                <div className={style.title}>
                                    {intl.formatMessage({
                                        id: 'index.createAccount',
                                    })}
                                </div>
                                <span className={style.desc}>
                                    {intl.formatMessage({
                                        id: 'index.createAccount.desc',
                                    })}
                                </span>
                            </Button>
                            <Divider>
                                {intl.formatMessage({
                                    id: 'index.or',
                                })}
                            </Divider>
                            <Button
                                block
                                ghost
                                size='large'
                                type='link'
                                shape='round'
                                className={`${style.button} ${style.buttonImport}`}
                                onClick={() => {
                                    history.push(config.page.recoverPage);
                                }}
                            >
                                <div className={style.title}>
                                    {intl.formatMessage({
                                        id: 'index.importAccount',
                                    })}
                                </div>
                                <span className={style.desc}>
                                    {intl.formatMessage({
                                        id: 'index.importAccount.desc',
                                    })}
                                </span>
                            </Button>
                        </div>
                    </div>
                }
                close={undefined}
                footer={false}
            />
        </>
    )
};

export default Ad;
