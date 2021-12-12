import { Alert, Button, Card, Divider, Input, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import BigModal from '@/components/ParamiModal/BigModal';
import { GetUserBalance } from '@/services/parami/wallet';
import { didToHex } from '@/utils/common';
import { SupportSomeBody } from '@/services/parami/nft';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { FloatStringToBigInt } from '@/utils/format';
import AD3 from '@/components/Token/AD3';

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

const Support: React.FC<{
    did: string,
    stashUserAddress: string,
    controllerKeystore: string,
}> = ({ did, stashUserAddress, controllerKeystore }) => {
    const [submitting, setSubmitting] = useState(false);
    const [modal, setModal] = useState<boolean>(false);
    const [errorState, setErrorState] = useState<API.Error>({});
    const [number, setNumber] = useState<string>('0');
    const [password, setPassword] = useState('');
    const [secModal, setSecModal] = useState(false);
    const [FreeBalance, setFreeBalance] = useState<any>(null);

    const intl = useIntl();

    const init = async () => {
        try {
            const { freeBalance }: any = await GetUserBalance(stashUserAddress);
            setFreeBalance(`${freeBalance}`);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    };

    const handleSubmit = async () => {
        const didHexString = didToHex(did);
        await SupportSomeBody(didHexString, FloatStringToBigInt(number, 18).toString(), password, controllerKeystore);
        setModal(false);
        setSubmitting(false);
    };
    useEffect(() => {
        if (password != '') {
            handleSubmit();
        };
    }, [password]);
    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <Spin
                tip={intl.formatMessage({
                    id: 'common.submitting',
                })}
                spinning={submitting}
                wrapperClassName={styles.pageContainer}
            >
                <Card
                    className={styles.card}
                    bodyStyle={{
                        width: '100%',
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
                                id: 'creator.explorer.support',
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
                        <Button
                            block
                            shape='round'
                            type='primary'
                            size='large'
                            onClick={() => { setModal(true) }}
                        >
                            {intl.formatMessage({
                                id: 'creator.explorer.support',
                            })}
                        </Button>
                    </div>
                </Card>
                <BigModal
                    visable={modal}
                    title={intl.formatMessage({
                        id: 'creator.explorer.support',
                    })}
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
                                    className={`${style.input} bigInput`}
                                    value={number}
                                    onChange={(e) => {
                                        setNumber(e.target.value);
                                    }}
                                    disabled={submitting}
                                    type="number"
                                />
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
                            disabled={FloatStringToBigInt(number, 18) <= BigInt(0) || FloatStringToBigInt(number, 18) > BigInt(FreeBalance)}
                            onClick={() => {
                                setSubmitting(true);
                                setSecModal(true);
                            }}
                        >
                            {intl.formatMessage({
                                id: 'common.submit',
                            })}
                        </Button>
                    }
                    close={() => { setModal(false) }}
                />
                <SecurityModal
                    visable={secModal}
                    setVisable={setSecModal}
                    password={password}
                    setPassword={setPassword}
                />
            </Spin>
        </>
    )
}

export default Support;
