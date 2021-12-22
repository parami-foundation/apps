import React from 'react';
import { useState } from 'react';
import { Card } from 'antd';
import { useIntl, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import classNames from 'classnames';
import SNS from './SNS/sns';
import Blockchain from './Blockchain/Blockchain';
import { useEffect } from 'react';

const Bind: React.FC = () => {
    const [tab, setTab] = useState<string>('sns');

    const intl = useIntl();

    const { query } = history.location;
    const { type, from } = query as { type: string, from: string };

    useEffect(() => {
        if (type) {
            setTab(type);
        }
    }, []);

    return (
        <>
            <div className={styles.mainTopContainer}>
                <div className={styles.pageContainer}>
                    <Card
                        className={styles.card}
                        bodyStyle={{
                            padding: 0,
                            width: '100%',
                        }}
                    >
                        <div className={styles.tabSelector}>
                            <div
                                className={classNames(styles.tabItem, tab === 'sns' ? '' : styles.inactive)}
                                onClick={() => setTab('sns')}
                            >
                                {intl.formatMessage({
                                    id: 'social.snsAccount',
                                })}
                            </div>
                            <div
                                className={classNames(styles.tabItem, tab === 'blockchain' ? '' : styles.inactive)}
                                onClick={() => setTab('blockchain')}
                            >
                                {intl.formatMessage({
                                    id: 'social.blockchainAccount',
                                })}
                            </div>
                        </div>
                        <div className={style.bindList}>
                            {tab === 'sns' && (
                                <>
                                    <SNS from={from} />
                                </>
                            )}
                            {tab === 'blockchain' && (
                                <>
                                    <Blockchain from={from} />
                                </>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Bind;