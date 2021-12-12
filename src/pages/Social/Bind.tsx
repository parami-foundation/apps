import React from 'react';
import { useState } from 'react';
import { Card } from 'antd';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import classNames from 'classnames';
import SNS from './SNS/sns';
import Blockchain from './Blockchain/Blockchain';

const Bind: React.FC = () => {
    const [tab, setTab] = useState<string>('sns');

    const intl = useIntl();

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
                                    <SNS />
                                </>
                            )}
                            {tab === 'blockchain' && (
                                <>
                                    <Blockchain />
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