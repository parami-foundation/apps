import { Alert, Button, Card, Divider, Input, message, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import BigModal from '@/components/ParamiModal/BigModal';
import { GetUserBalance } from '@/services/parami/wallet';
import { BuyToken, GetAssetBalance, GetCostOf, GetValueOf, SellToken } from '@/services/parami/nft';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import AD3 from '@/components/Token/AD3';
import { FloatStringToBigInt } from '@/utils/format';
import Token from '@/components/Token/Token';

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
    stashUserAddress: string,
    controllerKeystore: string,
    user: any,
    asset: any,
}> = ({ stashUserAddress, controllerKeystore, user, asset }) => {
    const [submitting, setSubmitting] = useState(false);
    const [buyModal, setBuyModal] = useState<boolean>(false);
    const [sellModal, setSellModal] = useState<boolean>(false);
    const [number, setNumber] = useState<string>('0');
    const [FreeBalance, setFreeBalance] = useState<any>(null);
    const [FreeAssetBalance, setFreeAssetBalance] = useState<any>(null);
    const [errorState, setErrorState] = useState<API.Error>({});
    const [secModal, setSecModal] = useState(false);
    const [password, setPassword] = useState('');
    const [costOf, setCostOf] = useState<any>(0);
    const [valueOf, setValueOf] = useState<any>(0);
    const [type, setType] = useState<string>('');

    const intl = useIntl();

    const init = async () => {
        try {
            const { freeBalance }: any = await GetUserBalance(
                stashUserAddress,
            );
            setFreeBalance(`${freeBalance}`);

            const freeAssetBalance = await GetAssetBalance(user?.nft, stashUserAddress);
            setFreeAssetBalance(`${freeAssetBalance}`);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setBuyModal(false);
        switch (type) {
            case 'buy':
                try {
                    await BuyToken(user?.nft, FloatStringToBigInt(number, 18).toString(), costOf.toString(), password, controllerKeystore as string).then(() => {
                        setSubmitting(false);
                    });
                    setBuyModal(false);
                    return;
                } catch (e: any) {
                    message.error(e.message);
                    setBuyModal(false);
                    return;
                }
            case 'sell':
                try {
                    await SellToken(user?.nft, FloatStringToBigInt(number, 18).toString(), valueOf.toString(), password, controllerKeystore as string).then(() => {
                        setSubmitting(false);
                    });
                    setSellModal(false);
                    return;
                } catch (e: any) {
                    message.error(e.message);
                    setSellModal(false);
                    return;
                }
        }
    };
    useEffect(() => {
        if (password != '') {
            handleSubmit();
        }
    }, [password]);

    useEffect(() => {
        init();
    }, [user, asset]);

    return (
        <>
            <Spin
                tip={intl.formatMessage({
                    id: 'common.submitting',
                })}
                spinning={submitting}
            >
                <Card
                    className={styles.card}
                    bodyStyle={{
                        width: '100%',
                    }}
                    style={{
                        marginTop: 50,
                    }}
                >
                    {errorState.Message && <Message content={errorState.Message} />}
                    <div className={style.trade}>
                        <Title
                            level={3}
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
                        <Input
                            autoFocus
                            size="large"
                            placeholder={'0'}
                            bordered={false}
                            className={`${style.input} bigInput`}
                            value={number}
                            onChange={(e) => {
                                setNumber(e.target.value);
                            }}
                            disabled={submitting}
                            type="number"
                        />
                        <Divider />
                        <div className={style.buttons}>
                            <Button
                                block
                                shape='round'
                                type='primary'
                                size='large'
                                icon={<LoginOutlined />}
                                style={{
                                    backgroundColor: '#a3cf62',
                                    boxShadow: '0 4px 14px 0 rgba(163,207,98,0.39)',
                                }}
                                onClick={() => {
                                    GetCostOf(user?.nft, FloatStringToBigInt(number, 18).toString()).then((res: any) => { setCostOf(res) });
                                    setBuyModal(true);
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'creator.explorer.buy',
                                })}
                            </Button>
                            <Divider
                                type='vertical'
                            />
                            <Button
                                block
                                danger
                                shape='round'
                                type='primary'
                                size='large'
                                icon={<LogoutOutlined />}
                                onClick={() => {
                                    GetValueOf(user?.nft, FloatStringToBigInt(number, 18).toString()).then((res: any) => { setValueOf(res) });
                                    setSellModal(true);
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'creator.explorer.sell',
                                })}
                            </Button>
                        </div>
                    </div>
                </Card>


                <BigModal
                    visable={buyModal}
                    title={
                        `${intl.formatMessage({
                            id: 'creator.explorer.buy',
                        })} ${asset?.name}(${asset?.symbol})`
                    }
                    content={
                        <>
                            <div className={style.tradeModal}>
                                <Input
                                    autoFocus
                                    size="large"
                                    placeholder={'0'}
                                    bordered={false}
                                    className={`${style.input} bigInput`}
                                    value={number}
                                    onChange={(e) => {
                                        setNumber(e.target.value);
                                        GetCostOf(user?.nft, FloatStringToBigInt(e.target.value, 18).toString()).then((res: any) => { setCostOf(res) });
                                    }}
                                    disabled={submitting}
                                    type="number"
                                />
                                <div className={style.field}>
                                    <span className={style.title}>
                                        {intl.formatMessage({
                                            id: 'creator.explorer.price',
                                        })}
                                    </span>
                                    <span className={style.value}>
                                        <AD3 value={costOf} />
                                    </span>
                                </div>
                                <div className={style.field}>
                                    <span className={style.title}>
                                        {intl.formatMessage({
                                            id: 'creator.explorer.availableBalance',
                                        })}
                                    </span>
                                    <span className={style.value}>
                                        <AD3 value={FreeBalance} />
                                    </span>
                                </div>
                            </div>
                        </>
                    }
                    footer={
                        <Button
                            block
                            shape='round'
                            type='primary'
                            size='large'
                            loading={submitting}
                            disabled={FloatStringToBigInt(number, 18) <= BigInt(0) || BigInt(costOf) > BigInt(FreeBalance)}
                            onClick={() => {
                                setType('buy');
                                setSecModal(true);
                            }}
                        >
                            {intl.formatMessage({
                                id: 'common.submit',
                            })}
                        </Button>
                    }
                    close={() => { setBuyModal(false) }}
                />

                <BigModal
                    visable={sellModal}
                    title={
                        `${intl.formatMessage({
                            id: 'creator.explorer.sell',
                        })} ${asset?.name}(${asset?.symbol})`
                    }
                    content={
                        <>
                            <div className={style.tradeModal}>
                                <Input
                                    autoFocus
                                    size="large"
                                    placeholder={intl.formatMessage({
                                        id: 'miner.add.number.placeholder',
                                    })}
                                    bordered={false}
                                    className={style.input}
                                    onChange={(e) => {
                                        setNumber(e.target.value);
                                        GetValueOf(user?.nft, FloatStringToBigInt(e.target.value, 18).toString()).then((res: any) => { setValueOf(res) });
                                    }}
                                    disabled={submitting}
                                    type="number"
                                    value={number}
                                />
                                <div className={style.field}>
                                    <span className={style.title}>
                                        {intl.formatMessage({
                                            id: 'creator.explorer.price',
                                        })}
                                    </span>
                                    <span className={style.value}>
                                        <AD3 value={valueOf} />
                                    </span>
                                </div>
                                <div className={style.field}>
                                    <span className={style.title}>
                                        {intl.formatMessage({
                                            id: 'creator.explorer.availableBalance',
                                        })}
                                    </span>
                                    <span className={style.value}>
                                        <Token value={FreeAssetBalance} symbol={asset?.symbol} />
                                    </span>
                                </div>
                            </div>
                        </>
                    }
                    footer={
                        <Button
                            block
                            shape='round'
                            type='primary'
                            size='large'
                            loading={submitting}
                            disabled={FloatStringToBigInt(number, 18) <= BigInt(0) || FloatStringToBigInt(number, 18) > BigInt(FreeAssetBalance)}
                            onClick={() => {
                                setType('sell');
                                setSecModal(true);
                            }}
                        >
                            {intl.formatMessage({
                                id: 'common.submit',
                            })}
                        </Button>
                    }
                    close={() => { setSellModal(false) }}
                />
                <SecurityModal
                    visable={secModal}
                    setVisable={setSecModal}
                    password={password}
                    setPassword={setPassword}
                // func={handleSubmit}
                />
            </Spin>
        </>
    )
}

export default Trade;
