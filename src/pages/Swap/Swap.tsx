import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useModel, useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './Swap.less';
import { Spin, Card, Typography, Image, InputNumber, Button, Space, notification } from 'antd';
import { DrylyBuyCurrency, DrylyBuyToken, DrylySellCurrency, DrylySellToken, GetSimpleUserInfo } from '@/services/parami/RPC';
import AD3 from '@/components/Token/AD3';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { DownOutlined } from '@ant-design/icons';
import Token from '@/components/Token/Token';
import { GetNFTMetaData } from '@/services/parami/NFT';
import { BuyCurrency, BuyToken } from '@/services/parami/Swap';
import { GetAvatar } from '@/services/parami/HTTP';
import config from '@/config/config';
import { GetAssetInfo } from '@/services/parami/Assets';
import { parseAmount } from '@/utils/common';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';

const { Title } = Typography;

type NftInfo = {
    owner: string;
    pot: string;
    classId: string;
    minted: boolean;
    tokenAssetId: string;
}

type Asset = {
    deposit: number;
    name: string;
    symbol: string;
    decimals: number;
    isFrozen: boolean;
}

const Swap: React.FC = () => {
    const [nftInfo, setNftInfo] = useState<NftInfo>();
    const [avatar, setAvatar] = useState<string>('')
    const [asset, setAsset] = useState<Asset>();
    const [assetPrice, setAssetPrice] = useState<string>();
    const apiWs = useModel('apiWs');

    const { wallet } = useModel('currentUser');
    const { balance } = useModel('balance');
    const { assets } = useModel('assets');
    const [loading, setLoading] = useState<boolean>(true);
    const [mode, setMode] = useState<string>('ad3ToToken');
    const [ad3Number, setAd3Number] = useState<string>('');
    const [tokenNumber, setTokenNumber] = useState<string>('');
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');

    const intl = useIntl();

    const params: { nftId: string } = useParams();

    const queryAsset = async (nftId: string) => {
        const nftMetaData = await GetNFTMetaData(nftId);
        if (nftMetaData.isEmpty) {
            notification.error({
                message: 'Loading NFT Error',
                description: `nftId: ${nftId}`
            });
            return;
        }

        const nftInfo = nftMetaData.toHuman() as NftInfo;
        setNftInfo(nftInfo);

        const userData = await GetSimpleUserInfo(nftInfo.owner);
        if (userData?.avatar.indexOf('ipfs://') > -1) {
            const hash = userData?.avatar?.substring(7);
            const { response, data } = await GetAvatar(config.ipfs.endpoint + hash);
            if (!response) {
                console.error('Fetching Avatar Error: No Response');
            }

            if (response?.status === 200) {
                setAvatar(window.URL.createObjectURL(data));
            }
        }

        const assetData = await GetAssetInfo(nftInfo.tokenAssetId);
        if (assetData.isEmpty) {
            notification.error({
                message: 'Loading Asset Error',
                description: `tokenAssetId: ${nftInfo.tokenAssetId}`
            });
            return;
        }

        const assetInfo = assetData.toHuman() as Asset;
        setAsset(assetInfo);

        const value = await DrylySellToken(nftInfo.tokenAssetId, parseAmount('1'));
        setAssetPrice(value.toString());
        setLoading(false);
    }

    useEffect(() => {
        if (!params?.nftId) {
            notification.info({
                message: 'No nftId'
            })
            return;
        }
        if (apiWs) {
            queryAsset(params.nftId);
        }
    }, [params, apiWs]);

    const handleSubmit = async (preTx?: boolean, account?: string) => {
        if (!!wallet && !!wallet?.keystore && !!nftInfo?.tokenAssetId) {
            setLoading(true);
            switch (mode) {
                case 'ad3ToToken':
                    try {
                        const info: any = await BuyToken(nftInfo?.tokenAssetId, FloatStringToBigInt(tokenNumber, 18).toString(), FloatStringToBigInt(ad3Number, 18).toString(), passphrase, wallet?.keystore, preTx, account);
                        setLoading(false);

                        if (preTx && account) {
                            return info
                        }
                    } catch (e: any) {
                        notification.error({
                            message: e.message || e,
                            duration: null,
                        });
                        setLoading(false);
                        return;
                    }
                    break;
                case 'tokenToAd3':
                    try {
                        const info: any = await BuyCurrency(nftInfo?.tokenAssetId, FloatStringToBigInt(ad3Number, 18).toString(), FloatStringToBigInt(tokenNumber, 18).toString(), passphrase, wallet?.keystore, preTx, account);
                        setLoading(false);

                        if (preTx && account) {
                            return info
                        }
                    } catch (e: any) {
                        notification.error({
                            message: e.message || e,
                            duration: null,
                        });
                        setLoading(false);
                        return;
                    }
                    break;
            }
        } else {
            notification.error({
                key: 'accessDenied',
                message: intl.formatMessage({
                    id: 'error.accessDenied',
                }),
                duration: null,
            });
            setLoading(false);
        }
    };

    const handleAD3InputChange = useCallback((e) => {
        if (nftInfo?.tokenAssetId) {
            if (mode === 'ad3ToToken') {
                // setAd3Number(e);
                DrylySellCurrency(nftInfo?.tokenAssetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setTokenNumber(BigIntToFloatString(res, 18));
                });
            }
            if (mode === 'tokenToAd3') {
                // setFlat(e);
                DrylyBuyCurrency(nftInfo?.tokenAssetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setTokenNumber(BigIntToFloatString(res, 18));
                });
            }
        }
    }, [nftInfo, mode]);

    const handleTokenInputChange = useCallback((e) => {
        if (nftInfo?.tokenAssetId) {
            if (mode === 'tokenToAd3') {
                DrylySellToken(nftInfo?.tokenAssetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setAd3Number(BigIntToFloatString(res, 18));
                });
            }
            if (mode === 'ad3ToToken') {
                DrylyBuyToken(nftInfo?.tokenAssetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setAd3Number(BigIntToFloatString(res, 18));
                });
            }
        }
    }, [nftInfo]);

    const setAD3Max = useCallback(() => {
        const ad3BalanceStr = BigIntToFloatString(balance?.free, 18);
        setAd3Number(ad3BalanceStr);
        handleAD3InputChange(ad3BalanceStr);
    }, [balance, mode, handleAD3InputChange]);

    const setTokenMax = useCallback(() => {
        if (nftInfo?.tokenAssetId && assets) {
            const tokenBalanceStr = BigIntToFloatString(assets.get(nftInfo?.tokenAssetId)?.balance, 18);
            setTokenNumber(tokenBalanceStr);
            handleTokenInputChange(tokenBalanceStr);
        }
    }, [mode, nftInfo, assets, handleTokenInputChange]);

    return (
        <>
            <Spin
                tip={intl.formatMessage({
                    id: 'common.loading',
                })}
                spinning={loading}
                wrapperClassName={styles.spinContainer}
            >
                <Card
                    className={styles.card}
                    bodyStyle={{
                        width: '100%',
                        padding: '24px 8px',
                    }}
                    style={{
                        marginTop: 50,
                        maxWidth: '600px'
                    }}
                >
                    <div className={style.trade}>
                        <Title
                            level={5}
                            style={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}
                            className={styles.title}
                        >
                            {intl.formatMessage({
                                id: 'creator.explorer.trade',
                            })}
                        </Title>
                        <div
                            className={style.pairCoins}
                            style={{
                                flexFlow: mode === 'ad3ToToken' ? 'column' : 'column-reverse',
                            }}
                        >
                            <div className={style.pairCoinsItem}>
                                <div className={style.pairCoinsSelect}>
                                    <div className={style.pairCoin}>
                                        <Image
                                            src={'/images/logo-round-core.svg'}
                                            preview={false}
                                            className={style.pairCoinsItemIcon}
                                        />
                                        <span className={style.pairCoinsItemLabel}>AD3</span>
                                    </div>
                                    <InputNumber
                                        autoFocus={false}
                                        size="large"
                                        placeholder={'0'}
                                        bordered={false}
                                        value={ad3Number}
                                        className={style.pairCoinsItemInput}
                                        stringMode
                                        onChange={(e) => {
                                            setAd3Number(e);
                                            handleAD3InputChange(e);
                                        }}
                                    />
                                </div>
                                <div className={style.pairCoinsBalance}>
                                    <span className={style.balance}>
                                        {intl.formatMessage({
                                            id: 'creator.explorer.trade.balance',
                                            defaultMessage: 'Balance'
                                        })}: <AD3 value={balance?.free} />
                                    </span>
                                    <Button
                                        type='link'
                                        size='middle'
                                        className={style.maxButton}
                                        onClick={setAD3Max}
                                    >
                                        {intl.formatMessage({
                                            id: 'creator.explorer.trade.balance.max',
                                            defaultMessage: 'MAX'
                                        })}
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type='primary'
                                shape='circle'
                                size='middle'
                                icon={<DownOutlined />}
                                className={style.pairCoinsSwitchButton}
                                onClick={() => {
                                    setMode(mode === 'ad3ToToken' ? 'tokenToAd3' : 'ad3ToToken');
                                    setAd3Number('');
                                    setTokenNumber('');
                                }}
                            />
                            <div className={style.pairCoinsItem}>
                                <div className={style.pairCoinsSelect}>
                                    <div className={style.pairCoin}>
                                        <Image
                                            src={avatar || '/images/logo-round-core.svg'}
                                            preview={false}
                                            className={style.pairCoinsItemIcon}
                                        />
                                        <span className={style.pairCoinsItemLabel}>{asset?.symbol}</span>
                                    </div>
                                    <InputNumber
                                        autoFocus={false}
                                        size="large"
                                        placeholder={'0'}
                                        bordered={false}
                                        value={tokenNumber}
                                        className={style.pairCoinsItemInput}
                                        stringMode
                                        onChange={(e) => {
                                            setTokenNumber(e);
                                            handleTokenInputChange(e);
                                        }}
                                    />
                                </div>
                                <div className={style.pairCoinsBalance}>
                                    <span className={style.balance}>
                                        {intl.formatMessage({
                                            id: 'creator.explorer.trade.balance',
                                            defaultMessage: 'Balance'
                                        })}: <Token value={assets.get(nftInfo?.tokenAssetId ?? '')?.balance ?? ''} symbol={asset?.symbol} />
                                    </span>
                                    <Button
                                        type='link'
                                        size='middle'
                                        className={style.maxButton}
                                        onClick={setTokenMax}
                                    >
                                        {intl.formatMessage({
                                            id: 'creator.explorer.trade.balance.max',
                                            defaultMessage: 'MAX'
                                        })}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className={style.pairCoinsFlat}>
                            <Space>
                                <Token value={FloatStringToBigInt('1', 18).toString()} symbol={asset?.symbol} />
                                <span>≈</span>
                                <AD3 value={assetPrice ?? ''} />
                            </Space>
                        </div>
                        <Button
                            block
                            type='primary'
                            size='large'
                            shape='round'
                            className={style.submitButton}
                            disabled={!ad3Number || !tokenNumber}
                            onClick={() => {
                                setSecModal(true);
                            }}
                        >
                            {intl.formatMessage({
                                id: 'creator.explorer.trade.swap',
                                defaultMessage: 'Swap'
                            })}
                        </Button>
                    </div>
                </Card>
            </Spin>

            <SecurityModal
                visable={secModal}
                setVisable={setSecModal}
                passphrase={passphrase}
                setPassphrase={setPassphrase}
                func={handleSubmit}
            />
        </>
    )
};

export default Swap;
