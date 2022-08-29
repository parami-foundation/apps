import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useModel, useIntl, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from './Swap.less';
import { Spin, Card, Typography, Image, InputNumber, Button, Space, notification } from 'antd';
import { DrylyBuyCurrency, DrylyBuyToken, DrylySellCurrency, DrylySellToken } from '@/services/parami/RPC';
import AD3 from '@/components/Token/AD3';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { DownOutlined } from '@ant-design/icons';
import Token from '@/components/Token/Token';
import { BuyCurrency, BuyToken } from '@/services/parami/Swap';
import config from '@/config/config';
import { GetAssetInfo } from '@/services/parami/Assets';
import { parseAmount } from '@/utils/common';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';
import { OwnerDidOfNft } from '@/services/subquery/subquery';
import { GetUserInfo } from '@/services/parami/RPC';
import SelectAsset from './components/SelectAsset/SelectAsset';

const { Title } = Typography;

type Asset = {
    deposit: number;
    name: string;
    symbol: string;
    decimals: number;
    isFrozen: boolean;
}

const Swap: React.FC = () => {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const { balance } = useModel('balance');
    const { assets } = useModel('assets');

    const [tokenIcon, setTokenIcon] = useState<string>('');
    const [asset, setAsset] = useState<Asset>();
    const [assetPrice, setAssetPrice] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);
    const [mode, setMode] = useState<string>('ad3ToToken');
    const [ad3Number, setAd3Number] = useState<string>('');
    const [tokenNumber, setTokenNumber] = useState<string>('');
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const [selectAssetModal, setSelectAssetModal] = useState<boolean>(false);

    const intl = useIntl();

    const params: { assetId: string } = useParams();

    const queryIcon = async (assetId: string) => {
        try {
            const did = await OwnerDidOfNft(assetId);
            const info = await GetUserInfo(did);
            if (!!info?.avatar && info?.avatar.indexOf('ipfs://') > -1) {
                const hash = info?.avatar.substring(7);
                setTokenIcon(config.ipfs.endpoint + hash);
            };
        } catch (e) {
            console.error(e);
        }
    }

    const queryAsset = async (assetId: string) => {
        const assetData = await GetAssetInfo(assetId);
        if (assetData.isEmpty) {
            notification.error({
                message: 'Loading Asset Error',
                description: `tokenAssetId: ${assetId}`
            });
            return;
        }

        const assetInfo = assetData.toHuman() as Asset;
        setAsset(assetInfo);

        const value = await DrylySellToken(assetId, parseAmount('1'));
        setAssetPrice(value.toString());
        setLoading(false);
    }

    useEffect(() => {
        if (!params?.assetId) {
            setSelectAssetModal(true);
            return;
        }
        if (apiWs) {
            queryAsset(params?.assetId);
            queryIcon(params?.assetId);
        }
    }, [params, apiWs]);

    const handleSubmit = async (preTx?: boolean, account?: string) => {
        if (!!wallet && !!wallet?.keystore && !!params?.assetId) {
            setLoading(true);
            switch (mode) {
                case 'ad3ToToken':
                    try {
                        const info: any = await BuyToken(params?.assetId, FloatStringToBigInt(tokenNumber, 18).toString(), FloatStringToBigInt(ad3Number, 18).toString(), passphrase, wallet?.keystore, preTx, account);
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
                        const info: any = await BuyCurrency(params?.assetId, FloatStringToBigInt(ad3Number, 18).toString(), FloatStringToBigInt(tokenNumber, 18).toString(), passphrase, wallet?.keystore, preTx, account);
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
        if (params?.assetId) {
            if (mode === 'ad3ToToken') {
                DrylySellCurrency(params?.assetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setTokenNumber(BigIntToFloatString(res, 18));
                });
            }
            if (mode === 'tokenToAd3') {
                DrylyBuyCurrency(params?.assetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setTokenNumber(BigIntToFloatString(res, 18));
                });
            }
        }
    }, [params, mode]);

    const handleTokenInputChange = useCallback((e) => {
        if (params?.assetId) {
            if (mode === 'tokenToAd3') {
                DrylySellToken(params?.assetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setAd3Number(BigIntToFloatString(res, 18));
                });
            }
            if (mode === 'ad3ToToken') {
                DrylyBuyToken(params?.assetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setAd3Number(BigIntToFloatString(res, 18));
                });
            }
        }
    }, [params, mode]);

    const setAD3Max = useCallback(() => {
        const ad3BalanceStr = BigIntToFloatString(balance?.free, 18);
        setAd3Number(ad3BalanceStr);
        handleAD3InputChange(ad3BalanceStr);
    }, [balance, mode, handleAD3InputChange]);

    const setTokenMax = useCallback(() => {
        if (params?.assetId && assets) {
            const tokenBalanceStr = BigIntToFloatString(assets.get(params?.assetId)?.balance, 18);
            setTokenNumber(tokenBalanceStr);
            handleTokenInputChange(tokenBalanceStr);
        }
    }, [mode, params, assets, handleTokenInputChange]);

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
                            <div className={`${style.pairCoinsItem} ${style.tokenCoin}`}>
                                <div className={style.pairCoinsSelect}>
                                    <div className={style.pairCoin} onClick={() => setSelectAssetModal(true)}>
                                        <Image
                                            src={tokenIcon || '/images/logo-round-core.svg'}
                                            preview={false}
                                            className={style.pairCoinsItemIcon}
                                        />
                                        <span className={style.pairCoinsItemLabel}>{asset?.symbol}</span>
                                        <DownOutlined className={style.downIcon} />
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
                                        })}: <Token value={assets.get(params?.assetId ?? '')?.balance ?? ''} symbol={asset?.symbol} />
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

            {selectAssetModal && <SelectAsset
                onClose={() => setSelectAssetModal(false)}
                onSelectAsset={assetId => {
                    history.push(`/swap/${assetId}`);
                    setSelectAssetModal(false);
                }}
            ></SelectAsset>}
        </>
    )
};

export default Swap;
