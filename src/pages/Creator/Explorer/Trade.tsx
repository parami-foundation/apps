import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { Card, Typography, Image, Button, InputNumber, Space, Alert, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import AD3 from '@/components/Token/AD3';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';
import Token from '@/components/Token/Token';
import { BuyToken, DrylyBuyCurrency, DrylySellCurrency, GetCostOf, GetValueOf, SellToken } from '@/services/parami/nft';
import SecurityModal from '@/components/ParamiModal/SecurityModal';

const { Title } = Typography;

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

const Trade: React.FC<{
    avatar: string;
    asset: any;
    user: any;
    controllerKeystore: string;
    assetPrice: string;
}> = ({ avatar, asset, user, controllerKeystore, assetPrice }) => {
    const [submitting, setSubmitting] = useState(false);
    const [errorState, setErrorState] = useState<API.Error>({});
    const [mode, setMode] = useState<string>('ad3ToToken');
    const [ad3Number, setAd3Number] = useState<string>('');
    const [tokenNumber, setTokenNumber] = useState<string>('');

    const [secModal, setSecModal] = useState(false);
    const [password, setPassword] = useState('');

    const [flat, setFlat] = useState<any>();

    const { assetsArr } = useModel('assets');
    const { stash } = useModel('balance');

    const intl = useIntl();

    const handleSubmit = async () => {
        setSubmitting(true);
        switch (mode) {
            case 'ad3ToToken':
                try {
                    await BuyToken(user?.nft, FloatStringToBigInt(ad3Number, 18).toString(), FloatStringToBigInt(flat, 18).toString(), password, controllerKeystore as string).then(() => {
                        setSubmitting(false);
                    });
                    return;
                } catch (e: any) {
                    setErrorState({
                        Type: 'chain error',
                        Message: e.message,
                    });
                    return;
                }
            case 'tokenToAd3':
                try {
                    await SellToken(user?.nft, FloatStringToBigInt(tokenNumber, 18).toString(), FloatStringToBigInt(flat, 18).toString(), password, controllerKeystore as string).then(() => {
                        setSubmitting(false);
                    });
                    return;
                } catch (e: any) {
                    setErrorState({
                        Type: 'chain error',
                        Message: e.message,
                    });
                    return;
                }
        }
    };

    return (
        <>
            <Spin
                tip={intl.formatMessage({
                    id: 'common.submitting',
                })}
                spinning={submitting}
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
                        {errorState.Message && <Message content={errorState.Message} />}
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
                                        value={mode === 'ad3ToToken' ? ad3Number : flat}
                                        className={style.pairCoinsItemInput}
                                        stringMode
                                        onChange={(e) => {
                                            if (mode === 'ad3ToToken') {
                                                setAd3Number(e);
                                                DrylySellCurrency(user?.nft, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                                                    setFlat(BigIntToFloatString(res, 18));
                                                });
                                            }
                                            if (mode === 'tokenToAd3') {
                                                setFlat(e);
                                                DrylyBuyCurrency(user?.nft, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                                                    setTokenNumber(BigIntToFloatString(res, 18));
                                                });
                                            }
                                        }}
                                    />
                                </div>
                                <div className={style.pairCoinsBalance}>
                                    <span className={style.balance}>
                                        {intl.formatMessage({
                                            id: 'creator.explorer.trade.balance',
                                            defaultMessage: 'Balance'
                                        })}: <AD3 value={stash.free} />
                                    </span>
                                    <Button
                                        type='link'
                                        size='middle'
                                        className={style.maxButton}
                                        onClick={() => {
                                            setAd3Number(BigIntToFloatString(stash.free, 18));
                                            DrylySellCurrency(user?.nft, FloatStringToBigInt(stash.free, 18).toString()).then((res: any) => {
                                                setFlat(BigIntToFloatString(res, 18));
                                            });
                                        }}
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
                                    setFlat(null);
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
                                        value={mode === 'tokenToAd3' ? tokenNumber : flat}
                                        className={style.pairCoinsItemInput}
                                        stringMode
                                        onChange={(e) => {
                                            if (mode === 'tokenToAd3') {
                                                setTokenNumber(e);
                                                GetValueOf(user?.nft, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                                                    setFlat(BigIntToFloatString(res, 18));
                                                });
                                            }
                                            if (mode === 'ad3ToToken') {
                                                setFlat(e);
                                                GetCostOf(user?.nft, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
                                                    setAd3Number(BigIntToFloatString(res, 18));
                                                });
                                            }
                                        }}
                                    />
                                </div>
                                <div className={style.pairCoinsBalance}>
                                    <span className={style.balance}>
                                        {intl.formatMessage({
                                            id: 'creator.explorer.trade.balance',
                                            defaultMessage: 'Balance'
                                        })}: <Token value={assetsArr[user?.nft]?.balance} symbol={asset?.symbol} />
                                    </span>
                                    <Button
                                        type='link'
                                        size='middle'
                                        className={style.maxButton}
                                        onClick={() => {
                                            setTokenNumber(BigIntToFloatString(assetsArr[user?.nft]?.balance, 18));
                                            GetValueOf(user?.nft, FloatStringToBigInt(BigIntToFloatString(assetsArr[user?.nft]?.balance, 18), 18).toString()).then((res: any) => {
                                                setFlat(BigIntToFloatString(res, 18));
                                            });
                                        }}
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
                                <span>=</span>
                                <AD3 value={assetPrice} />
                            </Space>
                        </div>
                        <Button
                            block
                            type='primary'
                            size='large'
                            shape='round'
                            className={style.submitButton}
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
                password={password}
                setPassword={setPassword}
                func={handleSubmit}
            />
        </>
    )
}

export default Trade;
