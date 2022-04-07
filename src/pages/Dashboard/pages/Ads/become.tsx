import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/dashboard.less';
import { Button, Card, Input, notification, Typography } from 'antd';
import { BecomeAdvertiser } from '@/services/parami/dashboard';
import { parseAmount } from '@/utils/common';

const { Title } = Typography;

const currentAccount = localStorage.getItem('dashboardCurrentAccount') as string;

const Become: React.FC<{
    setAdvertisers: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setAdvertisers }) => {
    const apiWs = useModel('apiWs');
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [number, setNumber] = useState<string>('');

    const intl = useIntl();

    const becomeAdvertiser = async () => {
        setSubmitLoading(true);
        try {
            await BecomeAdvertiser(parseAmount(number), JSON.parse(currentAccount));
            setAdvertisers(true);
            setSubmitLoading(false);
        } catch (e: any) {
            notification.error({
                message: e.message,
                duration: null,
            });
            setSubmitLoading(false);
        }
    }

    return (
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
                    loading={!apiWs || submitLoading}
                    disabled={!number || BigInt(number) < BigInt(1000)}
                    onClick={() => {
                        becomeAdvertiser();
                    }}
                >
                    {intl.formatMessage({
                        id: 'common.submit',
                    })}
                </Button>
            </div>
        </Card>
    );
}

export default Become;
