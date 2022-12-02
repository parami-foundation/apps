import React, { useEffect, useState } from 'react';
import styles from '@/pages/wallet.less';
import style from './Ad.less';
import { history, useAccess, useIntl, useModel } from 'umi';
import { Image, Button, Divider } from 'antd';
import config from '@/config/config';
import { QueryAdData } from '@/services/parami/Advertisement';
import BigModal from '@/components/ParamiModal/BigModal';
import Footer from '@/components/Footer';
import { GetAvatar, QueryAssetById } from "@/services/parami/HTTP";
import { parseUrlParams } from '@/utils/url.util';
import AdBubble from '@/components/Advertisement/AdBubble/AdBubble';

export interface AdProps { }

function Ad({ }: AdProps) {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const { bodyHeight } = useModel('bodyChange');
    const [loading, setLoading] = useState<boolean>(true);
    const [avatar, setAvatar] = useState<string>('');
    const [nftId, setNftId] = useState<string>();
    const [referrer, setReferrer] = useState<string>();
    const [adBubbleData, setAdBubbleData] = useState<any>(); // todo: type this
    const [notAccess, setNotAccess] = useState<boolean>(false);

    const intl = useIntl();
    const access = useAccess();

    const avatarTop = document.getElementById('avatar')?.offsetTop;
    const avatarLeft = document.getElementById('avatar')?.offsetLeft;
    const windowWidth = document.body.clientWidth;

    useEffect(() => {
        if (apiWs) {
            const params = parseUrlParams() as { nftId: string; referrer?: string };

            if (params.nftId) {
                setNftId(params.nftId);
            } else {
                history.push('/wallet');
            }

            setReferrer(params.referrer);
        }
    }, [apiWs]);

    const queryAsset = async (nftId: string) => {
        const { data: assetData } = await QueryAssetById(nftId);
        if (assetData?.token) {
            document.title = `${assetData.token.name} - Para Metaverse Identity`;
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
            QueryAdData(nftId, wallet.did).then(ad => {
                setAdBubbleData(ad);
                setLoading(false);
            });

            queryAsset(nftId);
        }
    }, [apiWs, nftId, wallet])

    useEffect(() => {
        if (adBubbleData && !adBubbleData.type) {
            history.push(`/dao/?nftId=${adBubbleData.nftId}`);
        }
    }, [adBubbleData])

    return (
        <>
            <div
                className={style.explorerContainer}
            >
                {(
                    <>
                        <Image
                            src={avatar || '/images/default-avatar.svg'}
                            fallback='/images/default-avatar.svg'
                            className={style.avatar}
                            style={{
                                top: loading ? (bodyHeight - 400) / 2 : avatarTop,
                                left: loading ? (windowWidth - 200) / 2 : avatarLeft,
                                width: loading ? 200 : 40,
                                height: loading ? 200 : 40,
                                animation: loading ? 1 : 0,
                                position: loading ? 'fixed' : 'absolute',
                                display: loading || (adBubbleData) ? 'flex' : 'none',
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
                {adBubbleData && <>
                    <div
                        className={styles.pageContainer}
                        style={{
                            paddingTop: 100,
                            maxWidth: '100%'
                        }}
                    >
                        <div>
                            <div className={style.daoInfo}>
                                <img referrerPolicy='no-referrer' id="avatar" className={style.kolIcon} src={adBubbleData.kolIcon}></img>
                                <div className={style.daoInfoText}>
                                    <div className={style.daoToken} onClick={() => {
                                        history.push(`/dao/?nftId=${adBubbleData.nftId}`)
                                    }}>
                                        {adBubbleData?.assetName} NFT Power
                                    </div>
                                    <div className={style.daoTokenSubtitle}>
                                        Sponsored by {adBubbleData.sponsorName}
                                    </div>
                                </div>
                            </div>
                            <AdBubble
                                ad={adBubbleData}
                                userDid={wallet.did}
                                referrer={referrer}
                            ></AdBubble>
                        </div>

                    </div>
                </>}

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
