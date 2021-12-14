/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Card, Image } from 'antd';
import { hexToDid } from '@/utils/common';
import Assets from './components/Assets';
import AD3 from '@/components/Token/AD3';
import DID from '@/components/Did/did';
import { useModel } from 'umi';

const Did: React.FC = () => {
    const { avatar } = useModel('dashboard.user');
    const { stash } = useModel('dashboard.balance');

    const intl = useIntl();

    const did = localStorage.getItem('dashboardDid') as string;

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.contentContainer}>
                    <Card
                        className={styles.dashboardCard}
                    >
                        <div className={style.profileCard}>
                            <Image
                                src={avatar || '/images/logo-square-core.svg'}
                                preview={false}
                                className={style.avatar}
                            />
                            <div className={style.profile}>
                                <div className={style.totalBalance}>
                                    <div className={styles.title}>
                                        {intl.formatMessage({
                                            id: 'dashboard.did.balance',
                                            defaultMessage: 'Balance',
                                        })}
                                    </div>
                                    <div className={style.amount}>
                                        <AD3 value={stash.total} />
                                    </div>
                                    <div className={style.availableBalance}>
                                        {intl.formatMessage({
                                            id: 'dashboard.did.availableBalance',
                                        })}
                                        : <AD3 value={stash.free} />
                                    </div>
                                </div>
                                <DID did={hexToDid(did)} />
                            </div>
                        </div>
                    </Card>
                    <Assets />
                </div>
            </div>
        </>
    )
}

export default Did;
