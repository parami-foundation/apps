import React from 'react';
import { Button, Typography } from 'antd';
import { useIntl, history } from 'umi';
import styles from '../style.less';

const { Title } = Typography;

const Exchange: React.FC = () => {
    const intl = useIntl();

    return (
        <>
            <Title level={4}>
                {intl.formatMessage({
                    id: 'wallet.buy.exchange',
                })}
            </Title>
            <div className={styles.exchanges}>
                <a href="https://www.binance.com/" target="_blank" rel="noreferrer">
                    <img src="/images/exchange/binance-logo.svg" alt="BINANCE" />
                </a>
                <a href="https://www.gate.io/" target="_blank" rel="noreferrer">
                    <img src="/images/exchange/gate-io-logo.svg" alt="GATE" />
                </a>
            </div>
            <div className={styles.buttons}>
                <Button
                    shape="round"
                    size="large"
                    className={styles.button}
                    onClick={() => (history.goBack())}
                >
                    {intl.formatMessage({
                        id: 'common.back',
                    })}
                </Button>
            </div>
        </>
    )
}

export default Exchange;