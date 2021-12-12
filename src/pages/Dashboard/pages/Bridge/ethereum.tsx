import { Alert, Button, Input } from 'antd';
import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/dashboard.less';
import AD3 from '@/components/Token/AD3';
import Token from '@/components/Token/Token';

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

const Ethereum: React.FC<{
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setLoading }) => {
    const { account, chainName } = useModel('metaMask');
    const [errorState, setErrorState] = useState<API.Error>({});
    const [preflightDetails, setPreflightDetails] = useState<Bridge.PreflightDetails>({
        receiver: "",
        token: "",
        tokenAmount: 0,
        tokenSymbol: "",
    });

    const intl = useIntl();

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
                            value={chainName}
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
                            value={account}
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
                            value={'Parami'}
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
                            addonAfter={
                                <Button
                                    block
                                    shape='round'
                                    size='large'
                                    type='primary'
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
                        <AD3 value={'123'} />
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
                        <Token value={'123'} symbol='ETH' />
                    </div>
                </div>
                <div className={styles.field}>
                    <Button
                        block
                        type='primary'
                        size='large'
                        shape='round'
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

export default Ethereum;
