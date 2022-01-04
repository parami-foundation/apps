/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import Advertisement from './Explorer/Advertisement';
import Stat from './Explorer/Stat';
import User from './Explorer/User';
import styles from '@/pages/wallet.less';
import style from './style.less';
import Trade from './Explorer/Trade';
import { history, useAccess, useIntl, useParams } from 'umi';
import { hexToDid, didToHex, parseAmount, checkInIAP } from '@/utils/common';
import { GetAssetDetail, GetAssetInfo, GetAssetsHolders, GetUserInfo, GetValueOf } from '@/services/parami/nft';
import { Alert, message, Image } from 'antd';
import config from '@/config/config';
import Support from './Explorer/Supoort';
import { GetSlotAdOf } from '@/services/parami/ads';
import { getAdViewerCounts } from '@/services/subquery/subquery';
import BigModal from '@/components/ParamiModal/BigModal';
import CreateAccount from '../Identity/CreateAccount';
import { GetAdRemain } from '../../services/parami/nft';
import { GetAvatar } from '@/services/parami/api';
import { useModel } from 'umi';

const Message: React.FC<{
    content: string;
}> = ({ content }) => (
    <Alert
        style={{
            marginBottom: 24,
        }}
        message={content}
        type="error"
        showIcon
    />
);

const userAgent = window.navigator.userAgent.toLowerCase();
const ios = /iphone|ipod|ipad/.test(userAgent);
const android = /android|adr/.test(userAgent);

const Explorer: React.FC = () => {
    const apiWs = useModel('apiWs');
    const { bodyHeight } = useModel('bodyChange');
    const [errorState, setErrorState] = useState<API.Error>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [avatar, setAvatar] = useState<string>('');
    const [KOL, setKOL] = useState<boolean>(true);
    const [user, setUser] = useState<any>();
    const [asset, setAsset] = useState<any>();
    const [assetPrice, setAssetPrice] = useState<string>('');
    const [detail, setDetail] = useState<any>();
    const [totalSupply, setTotalSupply] = useState<bigint>(BigInt(0));
    const [notAccess, setNotAccess] = useState<boolean>(false);
    const [notSysBroswer, setNotSysBroswer] = useState<boolean>(false);

    const [adData, setAdData] = useState<any>({});
    const [ad, setAd] = useState<Type.AdInfo>(null);
    const [viewer, setViewer] = useState<any>();
    const [member, setMember] = useState<any>();
    const [remain, setRemain] = useState<any>();

    const intl = useIntl();
    const access = useAccess();

    const avatarTop = document.getElementById('avatar')?.offsetTop;
    const avatarLeft = document.getElementById('avatar')?.offsetLeft;
    const windowWidth = document.body.clientWidth;

    const params: {
        kol: string;
    } = useParams();

    const selfDid = localStorage.getItem('did') as string;

    const did = !!params.kol ? 'did' + params.kol : hexToDid(selfDid);

    const stashUserAddress = localStorage.getItem('stashUserAddress') as string;
    const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

    const { query } = history.location;
    const { referrer } = query as { referrer: string };

    const getAd = async () => {
        try {
            const slot = await GetSlotAdOf(didToHex(did));
            if (!slot) {
                return;
            }
            const data = slot.ad;
            setAdData(data);
            if (!data?.metadata) return;

            if (data?.metadata?.indexOf('ipfs://') < 0) {
                return;
            }

            const hash = data?.metadata?.substring(7);

            const viewers = await getAdViewerCounts(data?.id);
            setViewer(viewers);

            const res = await fetch(config.ipfs.endpoint + hash);
            const adJson: Type.AdInfo = await res.json();

            if (!adJson) {
                return;
            }

            adJson.link = adJson.link + '?kol=' + didToHex(did);
            if (!!referrer) {
                adJson.link += '&referrer=' + referrer;
            };

            setAd(adJson);

            const remainData = await GetAdRemain(slot);
            setRemain(remainData);

        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
            return;
        }
    };

    const init = async () => {
        try {
            const didHexString = didToHex(did);
            const userData = await GetUserInfo(didHexString);
            if (userData.isEmpty) {
                message.error(
                    intl.formatMessage({
                        id: 'error.account.notFound',
                    }),
                );
                history.goBack();
                return;
            };
            const userInfo = userData.toHuman() as any;
            setUser(userInfo);

            if (userInfo['avatar'].indexOf('ipfs://') > -1) {
                const hash = userInfo['avatar'].substring(7);
                const { response, data } = await GetAvatar(config.ipfs.endpoint + hash);
                if (response?.status === 200) {
                    setAvatar(window.URL.createObjectURL(data));
                }
            };
            document.title = `${userInfo?.nickname || did} - Para Metaverse Identity`;
            if (userInfo.nft !== null) {
                const assetData = await GetAssetInfo(userInfo.nft);
                if (assetData.isEmpty) {
                    setKOL(false);
                    return;
                }
                const assetInfo = assetData.toHuman() as any;
                setAsset(assetInfo);
                const value = await GetValueOf(userInfo.nft, parseAmount('1'));
                setAssetPrice(value.toString());

                const assetDetail = await GetAssetDetail(userInfo.nft);
                setDetail(assetDetail);

                const supply: string = assetDetail.unwrap().supply.toString();
                setTotalSupply(BigInt(supply));

                const members = await GetAssetsHolders(userInfo?.nft);
                setMember(members);
            } else {
                setKOL(false);
            };
            await getAd();
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
            return;
        }
    };

    useEffect(() => {
        sessionStorage.setItem('redirect', window.location.href);
        if (!checkInIAP()) {
            setNotSysBroswer(true);
        };
        if (!access.canUser && checkInIAP()) {
            setNotAccess(true);
        };
        if (apiWs) {
            init();
        }
    }, [apiWs]);

    return (
        <>
            <div
                className={styles.mainContainer}
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
                                display: loading || Object.keys(adData).length ? 'flex' : 'none',
                            }}
                            preview={false}
                        />
                        <div
                            className={style.loading}
                            style={{
                                opacity: loading ? 1 : 0,
                                zIndex: loading ? 10 : -1,
                                height: bodyHeight,
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
                {errorState.Message && <Message content={errorState.Message} />}
                {!KOL && access.canUser && (
                    <div
                        className={styles.pageContainer}
                        style={{
                            paddingTop: 50,
                            maxWidth: 1920,
                        }}
                    >
                        <Support
                            did={did}
                            stashUserAddress={stashUserAddress}
                            controllerKeystore={controllerKeystore}
                        />
                    </div>
                )}
                {(KOL && Object.keys(adData).length > 0) && (
                    <div
                        className={styles.pageContainer}
                        style={{
                            paddingTop: 50,
                            maxWidth: '100%',
                            backgroundColor: 'rgba(244,245,246,1)',
                        }}
                    >
                        <Advertisement
                            ad={ad}
                            viewer={viewer}
                            asset={asset}
                            avatar={avatar}
                            did={did}
                            adData={adData}
                            remain={remain}
                        />
                    </div>
                )}
                <div
                    className={styles.pageContainer}
                    style={{
                        paddingTop: 50,
                        maxWidth: 1920,
                    }}
                >
                    <User
                        avatar={avatar}
                        did={did}
                        user={user}
                        asset={asset}
                    />
                </div>
                <div
                    className={styles.pageContainer}
                    style={{
                        paddingTop: 50,
                        maxWidth: 1920,
                    }}
                >
                    {KOL && access.canUser && (
                        <>
                            <Stat
                                asset={asset}
                                assetPrice={assetPrice}
                                totalSupply={totalSupply}
                                viewer={viewer}
                                member={member}
                            />
                            <Trade
                                avatar={avatar}
                                asset={asset}
                                user={user}
                                controllerKeystore={controllerKeystore}
                                assetPrice={assetPrice}
                            />
                        </>
                    )}
                </div>
            </div>
            <BigModal
                visable={notAccess}
                title={intl.formatMessage({
                    id: 'error.account.notUser',
                })}
                content={
                    <>
                        <CreateAccount minimal={true} />
                    </>
                }
                close={undefined}
                footer={false}
            />
            <BigModal
                visable={notSysBroswer}
                title={intl.formatMessage({
                    id: 'error.broswer.notSupport.title',
                })}
                content={
                    <>
                        <div className={style.notSupport}>
                            {ios && (
                                <Image
                                    src="/images/icon/safari_logo.svg"
                                    preview={false}
                                    className={style.icon}
                                />
                            )}
                            {android && (
                                <Image
                                    src="/images/icon/chrome_logo.svg"
                                    preview={false}
                                    className={style.icon}
                                />
                            )}
                            <Alert
                                message={intl.formatMessage({
                                    id: 'error.broswer.notSupport'
                                })}
                                type="error"
                                className={style.text}
                            />
                        </div>
                    </>
                }
                footer={false}
                close={undefined}
            />
        </>
    )
};

export default Explorer;
