import React from 'react';
import { useState } from 'react';
import { Button, Card } from 'antd';
import classNames from 'classnames';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import Add from './Staking/Add';
import Redeem from './Staking/Redeem';
import List from './Staking/List';

const Staking: React.FC = () => {
    const [tab, setTab] = useState<string>('add');

    const intl = useIntl();

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.pageContainer}>
                    <Button
                        block
                        type='primary'
                        shape='round'
                        size='large'
                    >
                        {intl.formatMessage({
                            id: 'stake.add',
                            defaultMessage: 'Add',
                        })}
                    </Button>
                    <List />

                    <Card
                        className={styles.card}
                        bodyStyle={{
                            padding: 0,
                            width: '100%',
                        }}
                    >
                        <div className={styles.tabSelector}>
                            <div
                                className={classNames(styles.tabItem, tab === 'add' ? '' : styles.inactive)}
                                onClick={() => setTab('add')}
                            >
                                {intl.formatMessage({
                                    id: 'miner.mining.add',
                                })}
                            </div>
                            <div
                                className={classNames(styles.tabItem, tab === 'redeem' ? '' : styles.inactive)}
                                onClick={() => setTab('redeem')}
                            >
                                {intl.formatMessage({
                                    id: 'miner.mining.redeem',
                                })}
                            </div>
                        </div>
                        {tab === "add" && (
                            <Add />
                        )}
                        {tab === "redeem" && (
                            <Redeem />
                        )}
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Staking;