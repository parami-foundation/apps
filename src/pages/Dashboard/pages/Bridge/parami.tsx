import { Alert, Button, Input, message } from 'antd';
import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/dashboard.less';
import AD3 from '@/components/Token/AD3';
import Token from '@/components/Token/Token';
import { AD3ToETH } from '@/services/parami/bridge';
import { isETHAddress } from '@/utils/checkAddress';
import { GetUserBalance, GetStableAccount } from '@/services/parami/wallet';
import { useEffect } from 'react';
import { BigIntToFloatString, FloatStringToBigInt } from '@/utils/format';

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

const Parami: React.FC<{
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setLoading }) => {
    const { chainName } = useModel('metaMask');
    const [errorState, setErrorState] = useState<API.Error>({});
    const [FreeBalance, setFreeBalance] = useState<any>(null);

    const [amount, setAmount] = useState<string>('');
    const [destinationAddress, setDestinationAddress] = useState<string>();

    const intl = useIntl();

    const currentAccount = localStorage.getItem('dashboardCurrentAccount') as string;

    const handleSubmit = async () => {
        setLoading(true);
        if (!isETHAddress(destinationAddress)) {
            message.error('Please input ETH Address!');
            setLoading(false);
            return;
        }

        try {
            await AD3ToETH(JSON.parse(currentAccount), FloatStringToBigInt(amount, 18).toString(), destinationAddress as string);
            setLoading(false);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e,
            });
            setLoading(false);
        }
    }

    const getBalance = async () => {
        try {
            const { stashAccount }: any = await GetStableAccount(JSON.parse(currentAccount).address);
            const { freeBalance }: any = await GetUserBalance(stashAccount);
            setFreeBalance(`${freeBalance}`);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    }

    useEffect(() => {
        getBalance();
    }, [])

    return (
        <>
            <div className={styles.windowCardBody}>
                {errorState.Message && <Message content={errorState.Message} />}
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.homeNetwork',
                            defaultMessage: 'Home network',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Input
                            bordered={true}
                            size='large'
                            value={'Parami'}
                            disabled
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.fromAccount',
                            defaultMessage: 'From Account',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Input
                            bordered={true}
                            size='large'
                            value={`${JSON.parse(currentAccount).address} - ${JSON.parse(currentAccount).meta.name}`}
                            disabled
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.destinationNetwork',
                            defaultMessage: 'Destination network',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Input
                            bordered={true}
                            size='large'
                            value={chainName}
                            disabled
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.amount',
                            defaultMessage: 'Amount',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Input
                            className={'after'}
                            bordered={true}
                            size='large'
                            onChange={(e) => {
                                setAmount(e.target.value);
                            }}
                            value={amount}
                            type='number'
                            addonAfter={
                                <Button
                                    block
                                    shape='round'
                                    size='large'
                                    type='primary'
                                    onClick={() => {
                                        setAmount(BigIntToFloatString(FreeBalance, 18));
                                    }}
                                >
                                    {intl.formatMessage({
                                        id: 'dashboard.bridge.all',
                                        defaultMessage: 'All',
                                    })}
                                </Button>
                            }
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.destinationAddress',
                            defaultMessage: 'Destination Address',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Input
                            className={'after'}
                            bordered={true}
                            size='large'
                            onChange={(e) => {
                                setDestinationAddress(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className={styles.rowField}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.availableBalance',
                            defaultMessage: 'Available Balance',
                        })}
                    </div>
                    <div className={styles.value}>
                        <AD3 value={FreeBalance} />
                    </div>
                </div>
                <div className={styles.rowField}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.bridgeFee',
                            defaultMessage: 'Bridge Fee',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Token value={'0'} symbol='ETH' />
                    </div>
                </div>
                <div className={styles.field}>
                    <Button
                        block
                        type='primary'
                        size='large'
                        shape='round'
                        onClick={() => {
                            handleSubmit();
                        }}
                        disabled={!amount || !destinationAddress || FloatStringToBigInt(amount, 18) <= BigInt(0) || FloatStringToBigInt(amount, 18) > BigInt(FreeBalance)}
                    >
                        {intl.formatMessage({
                            id: 'common.submit',
                        })}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Parami;
