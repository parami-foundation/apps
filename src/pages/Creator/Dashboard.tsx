import { Badge, Card, message } from 'antd';
import React, { useState, useEffect } from 'react';
import Create from './Dashboard/Create';
import styles from '@/pages/wallet.less';
import { GetKolDeposit, GetPreferedNFT } from '@/services/parami/nft';
import { parseAmount, hexToDid } from '@/utils/common';
import { useIntl, useModel, history } from 'umi';
import copy from 'copy-to-clipboard';

const Dashboard: React.FC = () => {
    const apiWs = useModel('apiWs');
    const [KOL, setKOL] = useState(false);
    const [reach, setReach] = useState(false);
    const [deposit, setDeposit] = useState('');

    const did = localStorage.getItem('did') as string;

    const link = `https://wallet.parami.io/${hexToDid(did)}`;

    const intl = useIntl();

    const init = async () => {
        const nftID = await GetPreferedNFT(did);

        if (!nftID.isEmpty) {
            setKOL(true);
            return;
        };

        const kolDeposit = await GetKolDeposit(did);
        if (!!kolDeposit) {
            const value = BigInt(kolDeposit.toString());
            setDeposit(value.toString());
            if (value >= parseAmount('1000')) {
                setReach(true);
            }
        }
    }

    useEffect(() => {
        if (KOL) {
            history.push(`/${hexToDid(did)}`);
        }
    }, [KOL]);

    useEffect(() => {
        if (apiWs) {
            init();
        }
    }, [apiWs]);

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
                                        onClick={async () => {
                                            const shareData = {
                                                title: 'Para Metaverse Identity',
                                                text: intl.formatMessage({
                                                    id: 'creator.explorer.shareMessage',
                                                }),
                                                url: link,
                                            };
                                            if (navigator.canShare && navigator.canShare(shareData)) {
                                                try {
                                                    await navigator.share(shareData);
                                                } catch (e) {
                                                    message.error(intl.formatMessage({
                                                        id: 'error.share.failed',
                                                    }));

                                                    return;
                                                }
                                            } else {
                                                copy(link + ` ${intl.formatMessage({
                                                    id: 'creator.explorer.shareMessage',
                                                })}`);
                                                message.success(
                                                    intl.formatMessage({
                                                        id: 'common.copied',
                                                    }),
                                                );
                                            }
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'creator.create.shareMine',
                                        })}
                                    </span>
                                }
                                color="volcano"
                            >
                                <Create
                                    deposit={deposit}
                                    reach={reach}
                                    setKOL={setKOL}
                                />
                            </Badge.Ribbon>
                        </Card>
                    </div>
                </div>
            )}
        </>
    )
}

export default Dashboard;
