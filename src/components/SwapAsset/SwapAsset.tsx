import React, { useCallback, useEffect, useState } from 'react';
import styles from '@/pages/wallet.less';
import style from './SwapAsset.less';
import { Typography, Image, InputNumber, Button, Space, notification } from 'antd';
import { useIntl, useModel } from 'umi';
import { GetAssetInfo } from '@/services/parami/Assets';
import { QueryAssetById } from '@/services/parami/HTTP';
import { DrylyBuyCurrency, DrylyBuyToken, DrylySellCurrency, DrylySellToken } from '@/services/parami/RPC';
import { parseAmount } from '@/utils/common';
import { BuyToken, SellToken } from '@/services/parami/Swap';
import AD3 from '../Token/AD3';
import { DownOutlined } from '@ant-design/icons';
import Token from '../Token/Token';
import SecurityModal from '../ParamiModal/SecurityModal';
import SelectAsset from '../SelectAsset/SelectAsset';
import { Asset } from '@/services/parami/typings';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';

const { Title } = Typography;

export interface SwapAssetProps {
    assetId?: string;
    onSelectAsset?: (asset: Asset) => void;
    onSwapped?: () => void;
    canSelectAsset?: boolean;
    initTokenNumber?: string;
}

function SwapAsset({ assetId, onSelectAsset, onSwapped, canSelectAsset = true, initTokenNumber }: SwapAssetProps) {
    const intl = useIntl();
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const { balance } = useModel('balance');
    const { assets, getAssets } = useModel('assets');

    const [tokenIcon, setTokenIcon] = useState<string>('');
    const [asset, setAsset] = useState<Asset>();
    const [assetPrice, setAssetPrice] = useState<string>();
    const [mode, setMode] = useState<string>('ad3ToToken');
    const [ad3Number, setAd3Number] = useState<string>('');
    const [tokenNumber, setTokenNumber] = useState<string>('');
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const [selectAssetModal, setSelectAssetModal] = useState<boolean>(false);
    const [balanceWarning, setBalanceWarning] = useState<boolean>(false);

    useEffect(() => {
        if (wallet) {
            getAssets(wallet.account)
        }
    }, [getAssets, wallet])

    const queryIcon = async (assetId: string) => {
        setTokenIcon('');
        try {
            const { data } = await QueryAssetById(assetId);
            if (data?.token) {
                setTokenIcon(data.token.icon);
            }
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
    }

    useEffect(() => {
        if (apiWs && assetId) {
            queryAsset(assetId);
            queryIcon(assetId);
            setAd3Number('');
            if (initTokenNumber) {
                setTokenNumber(initTokenNumber);
                handleTokenInputChange(initTokenNumber);
            } else {
                setTokenNumber('');
            }
        }
    }, [assetId, apiWs]);

    const handleSubmit = async (preTx?: boolean, account?: string) => {
        if (!!wallet && !!wallet?.keystore && !!assetId) {
            switch (mode) {
                case 'ad3ToToken':
                    try {
                        const info: any = await BuyToken(assetId, FloatStringToBigInt(tokenNumber, 18).toString(), FloatStringToBigInt(ad3Number, 18).toString(), passphrase, wallet?.keystore, preTx, account);

                        if (preTx && account) {
                            return info
                        }
                    } catch (e: any) {
                        notification.error({
                            message: e.message || e,
                            duration: null,
                        });
                        return;
                    }
                    break;
                case 'tokenToAd3':
                    try {
                        const info: any = await SellToken(assetId, FloatStringToBigInt(tokenNumber, 18).toString(), FloatStringToBigInt(ad3Number, 18).toString(), passphrase, wallet?.keystore, preTx, account);

                        if (preTx && account) {
                            return info
                        }
                    } catch (e: any) {
                        notification.error({
                            message: e.message || e,
                            duration: null,
                        });
                        return;
                    }
                    break;
            }
            onSwapped && onSwapped();
        } else {
            notification.error({
                key: 'accessDenied',
                message: intl.formatMessage({
                    id: 'error.accessDenied',
                }),
                duration: null,
            });
        }
    };

    const handleAD3InputChange = useCallback((e) => {
        if (assetId) {
            if (mode === 'ad3ToToken') {
                DrylySellCurrency(assetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setTokenNumber(BigIntToFloatString(res, 18));
                });
            }
            if (mode === 'tokenToAd3') {
                DrylyBuyCurrency(assetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setTokenNumber(BigIntToFloatString(res, 18));
                });
            }
        }
    }, [assetId, mode]);

    const handleTokenInputChange = useCallback((e) => {
        if (assetId) {
            if (mode === 'tokenToAd3') {
                DrylySellToken(assetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setAd3Number(BigIntToFloatString(res, 18));
                });
            }
            if (mode === 'ad3ToToken') {
                DrylyBuyToken(assetId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                    setAd3Number(BigIntToFloatString(res, 18));
                });
            }
        }
    }, [assetId, mode]);

    const setAD3Max = useCallback(() => {
        const ad3BalanceStr = BigIntToFloatString(balance?.free, 18);
        setAd3Number(ad3BalanceStr);
        handleAD3InputChange(ad3BalanceStr);
    }, [balance, mode, handleAD3InputChange]);

    const setTokenMax = useCallback(() => {
        if (assetId && assets) {
            const tokenBalanceStr = BigIntToFloatString(assets.get(assetId)?.balance, 18);
            setTokenNumber(tokenBalanceStr);
            handleTokenInputChange(tokenBalanceStr);
        }
    }, [mode, assetId, assets, handleTokenInputChange]);

    useEffect(() => {
        if (mode === 'ad3ToToken') {
            if (balance?.free && ad3Number) {
                setBalanceWarning(FloatStringToBigInt(ad3Number, 18) > BigInt(balance.free));
                return;
            }
        } else {
            if (assetId && assets && tokenNumber) {
                setBalanceWarning(FloatStringToBigInt(tokenNumber, 18) > BigInt(assets.get(assetId)?.balance));
                return;
            }
        }
        setBalanceWarning(false);
    }, [mode, balance, ad3Number, tokenNumber, assetId, assets]);

    return <>
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
                        <span className={`${style.balance} ${mode === 'ad3ToToken' && balanceWarning ? style.warning : ''}`}>
                            {intl.formatMessage({
                                id: 'creator.explorer.trade.balance',
                                defaultMessage: 'Balance'
                            })}: <AD3 value={balance?.free} />
                            {mode === 'ad3ToToken' && balanceWarning && <span className={style.warningText}>(insufficient balance)</span>}
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
                        <div className={style.pairCoin} onClick={() => canSelectAsset && setSelectAssetModal(true)}>
                            {asset && <>
                                <Image
                                    src={tokenIcon || '/images/default-avatar.svg'}
                                    preview={false}
                                    className={style.pairCoinsItemIcon}
                                />
                                <span className={style.pairCoinsItemLabel}>{asset?.symbol}</span>
                            </>}
                            {!asset && <>
                                <span className={style.pairCoinsItemText}>Select Asset</span>
                            </>}
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
                        <span className={`${style.balance} ${mode === 'tokenToAd3' && balanceWarning ? style.warning : ''}`}>
                            {intl.formatMessage({
                                id: 'creator.explorer.trade.balance',
                                defaultMessage: 'Balance'
                            })}: <Token value={assets.get(assetId ?? '')?.balance ?? ''} symbol={asset?.symbol} />
                            {mode === 'tokenToAd3' && balanceWarning && <span className={style.warningText}>(insufficient balance)</span>}
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
                disabled={!ad3Number || !tokenNumber || balanceWarning || !assetId}
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

        <SecurityModal
            visable={secModal}
            setVisable={setSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={handleSubmit}
        />

        {selectAssetModal && <SelectAsset
            onClose={() => setSelectAssetModal(false)}
            onSelectAsset={asset => {
                setSelectAssetModal(false);
                onSelectAsset && onSelectAsset(asset)
            }}
        ></SelectAsset>}
    </>;
};

export default SwapAsset;
