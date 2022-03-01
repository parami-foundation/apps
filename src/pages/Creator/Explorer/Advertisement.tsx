/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Button, Card, Image, message, Space, Tag } from 'antd';
import React, { useState } from 'react';
import Marquee from 'react-fast-marquee';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { useIntl, history } from 'umi';
import { DollarCircleFilled, EyeFilled, InfoCircleOutlined, NotificationOutlined, RightOutlined, ShareAltOutlined } from '@ant-design/icons';
import SmallModal from '@/components/ParamiModal/SmallModal';
import BigModal from '@/components/ParamiModal/BigModal';
import Chart from './components/Chart';
import { hexToDid } from '@/utils/common';
import config from '@/config/config';
import Token from '@/components/Token/Token';
import copy from 'copy-to-clipboard';
import { base64url } from '@/utils/format';
import Keyring from '@polkadot/keyring';
import { DecodeKeystoreWithPwd } from '@/services/parami/wallet';
import { useEffect } from 'react';
import SecurityModal from '@/components/ParamiModal/SecurityModal';

const Advertisement: React.FC<{
    ad: Type.AdInfo;
    viewer: any;
    referer: any;
    asset: any;
    avatar: string;
    did: string;
    adData: any;
    remain: bigint;
    loading: boolean;
}> = ({ ad, viewer, referer, asset, avatar, did, adData, remain, loading }) => {
    const [infoModal, setInfoModal] = useState(false);
    const [chartModal, setChartModal] = useState(false);
    const [password, setPassword] = useState('');
    const [secModal, setSecModal] = useState(false);
    const [guide, setGuide] = useState<boolean>(true);

    const intl = useIntl();

    const selfDid = localStorage.getItem('did') as string;

    const link = !!selfDid ? `https://app.parami.io/${did}?referrer=${selfDid}` : `https://app.parami.io/${did}`;

    const { query } = history.location;
    const { audience, scope } = query as { audience: string, scope: string | null | undefined };
    const scopes = scope ?? '';
    const sign = scopes.indexOf('sign') > -1;

    const controllerAddress = localStorage.getItem('controllerUserAddress');
    const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

    let stamp: string = '';
    const handleStamp = async () => {
        const timestamp = Date.now() / 1000 | 0;

        const header = JSON.stringify({
            alg: sign ? 'SrDSA' : 'none',
            typ: 'JWT'
        });

        const payload = JSON.stringify({
            iss: window.location.origin,
            sub: controllerAddress,
            aud: audience,
            iat: timestamp,
            exp: timestamp + 30
        });

        const plain = `${base64url(header)}.${base64url(payload)}`;

        if (!sign) {
            stamp = `${plain}.`;
            return;
        }

        const instanceKeyring = new Keyring({ type: 'sr25519' });
        const decodedMnemonic = DecodeKeystoreWithPwd(password, controllerKeystore);
        if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
            message.error(
                intl.formatMessage({
                    id: 'error.password.error',
                })
            );
            return;
        }
        const keypair = instanceKeyring.createFromUri(decodedMnemonic);

        const signature = keypair.sign(plain);
        const ticket = `${plain}.${base64url(signature)}`;

        stamp = ticket;
    };

    const gotoAdPage = async () => {
        window.open(`${ad?.link}&stamp=${stamp}&t=${Date.now()}`);
    };

    const sponsoredBy = hexToDid(adData?.creator).substring(8);

    useEffect(() => {
        handleStamp();
    }, [handleStamp]);

    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                setGuide(false);
            }, 8000);
        }
    }, [loading]);

    return (
        <>
            <div className={style.container}>
                <div className={style.topBar}>
                    <div className={style.sponsored}>
                        <Image
                            src={avatar || '/images/logo-round-core.svg'}
                            className={style.avatar}
                            preview={false}
                            id='avatar'
                            fallback='/images/logo-round-core.svg'
                        />
                        <span>
                            {intl.formatMessage({
                                id: 'creator.explorer.advertisement.sponsoredBy',
                            }, { did: `${sponsoredBy}` })}
                        </span>
                    </div>
                </div>
            </div>
            <Card
                className={`${styles.card} ${style.adCard}`}
                bodyStyle={{
                    padding: 0,
                    width: '100%',
                }}
            >
                <div className={style.advertisement}>
                    <div className={style.cover}>
                        <div className={style.viewer}>
                            <Tag
                                icon={<ShareAltOutlined />}
                                color="rgba(0,0,0,.5)"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 15,
                                    padding: 5,
                                }}
                                onClick={() => { setChartModal(true) }}
                            >
                                {referer}
                            </Tag>
                            <Tag
                                icon={<EyeFilled />}
                                color="rgba(0,0,0,.5)"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 15,
                                    padding: 5,
                                }}
                                onClick={() => { setChartModal(true) }}
                            >
                                {viewer}
                                <RightOutlined
                                    style={{
                                        fontSize: 12,
                                        padding: 5,
                                    }}
                                />
                            </Tag>
                        </div>
                        <div className={style.adMedia}>
                            <div
                                className={style.guideClickContainer}
                                style={{
                                    opacity: guide ? 1 : 0,
                                    zIndex: guide ? 3 : -1,
                                }}
                                onClick={() => {
                                    if (sign) {
                                        setSecModal(true);
                                    } else {
                                        gotoAdPage();
                                    }
                                }}
                            >
                                <div className={style.guideClickFinger} />
                                <div className={style.guideClickText}>
                                    {intl.formatMessage({
                                        id: 'creator.explorer.advertisement.earnUpTo',
                                    }, {
                                        value: (
                                            <>
                                                <span
                                                    style={{
                                                        color: '#ff5b00',
                                                        fontSize: '1.3rem',
                                                        marginLeft: 10,
                                                    }}
                                                >
                                                    <Token value={config.const.adEarnUpTo} symbol={asset?.symbol} />
                                                </span>
                                            </>
                                        )
                                    })}
                                </div>
                            </div>
                            <Image
                                src={ad?.media}
                                placeholder={true}
                                preview={false}
                                style={{
                                    cursor: 'pointer',
                                    width: '100%',
                                }}
                                onClick={() => {
                                    if (sign) {
                                        setSecModal(true);
                                    } else {
                                        gotoAdPage();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <Alert
                        banner
                        icon={<NotificationOutlined />}
                        className={style.meta}
                        message={
                            <Marquee
                                pauseOnHover
                                gradient={false}
                            >
                                <strong>{ad?.title}</strong>:
                                {ad?.desc}
                            </Marquee>
                        }
                    />
                </div>
            </Card>
            <span className={style.countDown}>
                <span
                    style={{
                        fontSize: '1.3rem'
                    }}
                >
                    {intl.formatMessage({
                        id: 'creator.explorer.advertisement.earnUpTo',
                    }, {
                        value: (
                            <>
                                <span
                                    style={{
                                        color: '#ff5b00',
                                        fontSize: '1.3rem',
                                        marginLeft: 10,
                                    }}
                                >
                                    <Token value={config.const.adEarnUpTo} symbol={asset?.symbol} />
                                </span>
                            </>
                        )
                    })}
                </span>
                <Space>
                    <DollarCircleFilled />
                    <span>
                        {intl.formatMessage({
                            id: 'creator.explorer.advertisement.remain',
                        })}
                    </span>
                    <span>
                        <Token value={remain?.toString()} symbol={asset?.symbol} />
                    </span>
                </Space>
            </span>
            <div className={style.share}>
                <Button
                    block
                    type='primary'
                    shape='round'
                    size='large'
                    icon={<ShareAltOutlined />}
                    className={style.shareButton}
                    onClick={async () => {
                        const shareData = {
                            title: 'Para Metaverse Identity',
                            text: intl.formatMessage({
                                id: 'creator.explorer.shareMessage',
                            }),
                            url: link,
                        };
                        if (navigator.canShare && navigator.canShare(shareData)) {
                            try {
                                await navigator.share(shareData);
                            } catch (e) {
                                console.log(e);
                            }
                        } else {
                            copy(link + ` ${intl.formatMessage({
                                id: 'creator.explorer.shareMessage',
                            })}`);
                            message.success(
                                intl.formatMessage({
                                    id: 'common.copied',
                                }),
                            );
                        }
                    }}
                >
                    {intl.formatMessage({
                        id: 'creator.explorer.advertisement.share',
                    }, { token: `$${asset?.symbol}` })}
                </Button>
                <Button
                    type='primary'
                    shape='circle'
                    size='large'
                    icon={<InfoCircleOutlined />}
                    onClick={() => {
                        setInfoModal(true);
                    }}
                />
            </div>
            <SmallModal
                visable={infoModal}
                content={intl.formatMessage({
                    id: 'creator.explorer.advertisement.share.desc',
                })}
                footer={
                    <>
                        <Button
                            block
                            shape='round'
                            size='large'
                            onClick={() => {
                                setInfoModal(false);
                            }}
                        >
                            {intl.formatMessage({
                                id: 'common.close',
                            })}
                        </Button>
                    </>
                }
            />
            <BigModal
                visable={chartModal}
                title={intl.formatMessage({
                    id: 'creator.explorer.chart',
                })}
                content={
                    <Chart
                        adData={adData}
                    />
                }
                footer={false}
                close={() => { setChartModal(false) }}
            />
            <SecurityModal
                visable={secModal}
                setVisable={setSecModal}
                password={password}
                setPassword={setPassword}
                func={gotoAdPage}
            />
        </>
    )
};

export default Advertisement;
