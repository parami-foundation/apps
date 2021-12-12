import React, { useEffect, useState } from 'react';
import { Alert, Button, Input, message, notification, Tooltip } from 'antd';
import { useIntl, history } from 'umi';
import QRCode from 'qrcode.react';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import CopyToClipboard from 'react-copy-to-clipboard';
import { GetUserBalance, Transfer } from '@/services/parami/wallet';
import config from '@/config/config';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import classNames from 'classnames';
import AD3 from '@/components/Token/AD3';
import { FloatStringToBigInt } from '@/utils/format';

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

const ChargeFee: React.FC = () => {
    const [errorState, setErrorState] = useState<API.Error>({});
    const [number, setNumber] = useState<string>('0');
    const [FreeBalance, setFreeBalance] = useState<any>('');
    const [fee, setFee] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [secModal, setSecModal] = useState(false);
    const [password, setPassword] = useState('');
    const [tab, setTab] = useState<string>('qrcode');

    const controllerAddress = localStorage.getItem('controllerUserAddress');
    const controllerKeystore = localStorage.getItem('controllerKeystore');
    const stashAddress = localStorage.getItem('stashUserAddress');

    const intl = useIntl();

    const getBalance = async () => {
        try {
            const { freeBalance }: any = await GetUserBalance(
                stashAddress as string,
            );
            setFreeBalance(`${freeBalance}`);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    };

    const partialFee = async () => {
        try {
            const info = await window.apiWs.tx.balances
                .transfer(controllerAddress as string, FloatStringToBigInt(number, 18))
                .paymentInfo(stashAddress as string);

            setFee(`${info.partialFee}`);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await Transfer(
                number.toString(),
                controllerKeystore as string,
                controllerAddress as string,
                password,
            );
            notification.success({
                message: intl.formatMessage({
                    id: 'wallet.charge.pending',
                }),
                description: (
                    <>
                        <p>
                            {intl.formatMessage({
                                id: 'wallet.charge.chargeAddress',
                            })}
                            : {controllerAddress}
                        </p>
                    </>
                ),
            });
            history.push(config.page.walletPage);
            setSubmitting(false);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
            setPassword('');
            setSubmitting(false);
        }
    };
    useEffect(() => {
        if (password !== '') {
            handleSubmit();
        }
    }, [password]);
    useEffect(() => {
        getBalance();
        partialFee();
    }, []);

    return (
        <>
            {errorState.Message && <Message content={errorState.Message} />}
            <div className={style.charge}>
                <div className={styles.tabSelector}>
                    <div
                        className={classNames(styles.tabItem, tab === 'qrcode' ? '' : styles.inactive)}
                        onClick={() => setTab('qrcode')}
                    >
                        {intl.formatMessage({
                            id: 'wallet.charge.qrcode',
                        })}
                    </div>
                    <div
                        className={classNames(
                            styles.tabItem,
                            tab === 'stash' ? '' : styles.inactive,
                        )}
                        onClick={() => setTab('stash')}
                    >
                        {intl.formatMessage({
                            id: 'wallet.charge.stash',
                        })}
                    </div>
                </div>
                {tab === 'qrcode' && (
                    <>
                        <div className={style.qrcode}>
                            <QRCode value={controllerAddress as string} size={200} />
                        </div>
                        <CopyToClipboard
                            text={controllerAddress as string}
                            onCopy={() =>
                                message.success(
                                    intl.formatMessage({
                                        id: 'common.copied',
                                    }),
                                )
                            }
                        >
                            <div className={style.field}>
                                <span className={style.title}>
                                    {intl.formatMessage({
                                        id: 'wallet.charge.controllerAddress',
                                    })}
                                </span>
                                <Tooltip placement="topRight" title={controllerAddress}>
                                    <span className={style.value}>{controllerAddress}</span>
                                </Tooltip>
                            </div>
                        </CopyToClipboard>
                    </>
                )}
                {tab === 'stash' && (
                    <>
                        <Input
                            autoFocus
                            size="large"
                            placeholder="0"
                            bordered={false}
                            className={`${style.input} bigInput`}
                            onChange={(e) => {
                                setNumber(e.target.value);
                            }}
                            disabled={submitting}
                            type="number"
                            value={number}
                        />
                        <div className={style.field}>
                            <span className={style.title}>
                                {intl.formatMessage({
                                    id: 'wallet.charge.stashBalance',
                                })}
                            </span>
                            <span className={style.value}>
                                <AD3 value={FreeBalance} />
                            </span>
                        </div>
                        <div className={style.field}>
                            <span className={style.title}>
                                {intl.formatMessage({
                                    id: 'wallet.charge.fee',
                                })}
                            </span>
                            <span className={style.value}>
                                <AD3 value={fee} />
                            </span>
                        </div>
                        <div className={style.buttons}>
                            <Button
                                type="primary"
                                shape="round"
                                size="large"
                                className={style.button}
                                loading={submitting}
                                disabled={FloatStringToBigInt(number, 18) <= BigInt(0) || FloatStringToBigInt(number, 18) > BigInt(FreeBalance)}
                                onClick={() => setSecModal(true)}
                            >
                                {intl.formatMessage({
                                    id: 'common.confirm',
                                })}
                            </Button>
                            <Button
                                type="text"
                                shape="round"
                                size="large"
                                className={style.button}
                                onClick={() => history.goBack()}
                                loading={submitting}
                            >
                                {intl.formatMessage({
                                    id: 'common.cancel',
                                })}
                            </Button>
                        </div>
                        <SecurityModal
                            visable={secModal}
                            setVisable={setSecModal}
                            password={password}
                            setPassword={setPassword}
                        //func={handleSubmit}
                        />
                    </>
                )}
            </div>
        </>
    );
}

export default ChargeFee;
