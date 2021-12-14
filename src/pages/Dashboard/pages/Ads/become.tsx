import React, { useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import { Alert, Button, Card, Input, Typography } from 'antd';
import { BecomeAdvertiser } from '@/services/parami/dashboard';
import { parseAmount } from '@/utils/common';

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

const currentAccount = localStorage.getItem('dashboardCurrentAccount') as string;

const Become: React.FC<{
    setAdvertisers: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setAdvertisers }) => {
    const [errorState, setErrorState] = useState<API.Error>({});
    const [number, setNumber] = useState<string>('');

    const intl = useIntl();

    const becomeAdvertiser = async () => {
        try {
            await BecomeAdvertiser(parseAmount(number), JSON.parse(currentAccount));
            setAdvertisers(true);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    }

    return (
        <>
            {errorState.Message && <Message content={errorState.Message} />}
            <div className={styles.mainContainer}>
                <div className={styles.contentContainer}>
                    <Card
                        className={styles.windowCard}
                    >
                        <Title
                            level={2}
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            {intl.formatMessage({
                                id: 'dashboard.ads.becomeAdvertisers',
                            })}
                        </Title>
                        <div className={styles.field}>
                            <div className={styles.title}>
                                {intl.formatMessage({
                                    id: 'dashboard.ads.deposit',
                                })}
                                <small>(The minimum is 1000)</small>
                            </div>
                            <div className={styles.value}>
                                <Input
                                    className={styles.withAfterInput}
                                    placeholder="0.00"
                                    size='large'
                                    type='number'
                                    onChange={(e) => setNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <Button
                                block
                                shape='round'
                                size='large'
                                type='primary'
                                disabled={!number || BigInt(number) < BigInt(1000)}
                                onClick={() => { becomeAdvertiser() }}
                            >
                                {intl.formatMessage({
                                    id: 'common.submit',
                                })}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Become;
