import React, { useState } from 'react';
import { Button, Input, Typography } from 'antd';
import { useIntl, history } from 'umi';

import styles from '../style.less';

const { Title } = Typography;

const InputAddress: React.FC<{
    setStep: React.Dispatch<React.SetStateAction<string>>,
    address: string | undefined,
    setAddress: React.Dispatch<React.SetStateAction<string | undefined>>,
}> = ({ setStep, address, setAddress }) => {
    const [submitting, setSubmitting] = useState(false);

    const intl = useIntl();

    const handleSubmit = async () => {
        setSubmitting(true);
        setStep('Confirm');
    };

    return (
        <>
            <Title level={4}>
                {intl.formatMessage({
                    id: 'wallet.send.receiverAddress',
                })}
            </Title>
            <Input
                autoFocus
                placeholder='did:ad3:……'
                size='large'
                className={styles.input}
                onChange={(e) => (setAddress(e.target.value))}
                disabled={submitting}
            />
            <div className={styles.buttons}>
                <Button
                    block
                    type="primary"
                    shape="round"
                    size="large"
                    className={styles.button}
                    loading={submitting}
                    disabled={!address}
                    onClick={() => handleSubmit()}
                >
                    {intl.formatMessage({
                        id: 'common.continue',
                    })}
                </Button>
                <Button
                    block
                    type="text"
                    shape="round"
                    size="large"
                    className={styles.button}
                    onClick={() => history.goBack()}
                >
                    {intl.formatMessage({
                        id: 'common.cancel',
                    })}
                </Button>
            </div>
        </>
    )
}

export default InputAddress;
