import React from 'react';
import { Card, Typography } from 'antd';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import ChargeFee from './Charge/ChargeFee';

const { Title } = Typography;

const Charge: React.FC = () => {
    const intl = useIntl();

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.pageContainer}>
                    <Card className={styles.card}>
                        <img
                            src={'/images/icon/charge.svg'}
                            className={style.topIcon}
                        />
                        <Title
                            level={2}
                            style={{
                                fontWeight: 'bold',
                            }}
                            className={style.title}
                        >
                            {intl.formatMessage({
                                id: 'wallet.charge.chargeFee',
                            })}
                        </Title>
                        <ChargeFee />
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Charge;
