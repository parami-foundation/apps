import { Badge, Card } from 'antd';
import React, { useState, useEffect } from 'react';
import Create from './Dashboard/Create';
import styles from '@/pages/wallet.less';
import Explorer from './Explorer';
import { GetKolDeposit, GetUserInfo } from '@/services/parami/nft';
import { parseAmount, hexToDid } from '@/utils/common';
import { useIntl, history } from 'umi';

const Dashboard: React.FC = () => {
    const [KOL, setKOL] = useState(false);
    const [reach, setReach] = useState(false);
    const [deposit, setDeposit] = useState('');

    const intl = useIntl();

    const did = localStorage.getItem('did') as string;

    const init = async () => {
        const res = await GetUserInfo(did);

        if (res.isEmpty) {
            return;
        }
        const user = res.toHuman() as any;
        if (user.nft !== null) {
            setKOL(true);
        };

        const kolDeposit = await GetKolDeposit(did)
        if (!kolDeposit.isEmpty) {
            const value = BigInt(kolDeposit.toString());
            setDeposit(value.toString());
            if (value >= parseAmount('1000')) {
                setReach(true);
            }
        }
    }
    useEffect(() => {
        init();
    }, []);

    return (
        <>
            {!KOL && (
                <div className={styles.mainContainer}>
                    <div className={styles.pageContainer}>
                        <Card
                            className={styles.card}
                            bodyStyle={{
                                padding: 0,
                                width: '100%',
                            }}
                        >
                            <Badge.Ribbon
                                text={
                                    <span
                                        style={{
                                            paddingLeft: 5,
                                            paddingRight: 10,
                                            fontSize: 15,
                                        }}
                                        onClick={() => {
                                            history.push(`/${hexToDid(did)}`)
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'creator.create.goToMine',
                                        })}
                                    </span>
                                }
                                color="volcano"
                            >
                                <Create
                                    deposit={deposit}
                                    reach={reach}
                                />
                            </Badge.Ribbon>
                        </Card>
                    </div>
                </div>
            )}
            {KOL && (
                <Explorer />
            )}
        </>
    )
}

export default Dashboard;
