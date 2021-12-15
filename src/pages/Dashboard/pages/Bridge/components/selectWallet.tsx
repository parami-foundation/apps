import React, { useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Card, Typography, Divider, Button } from 'antd';
import BigModal from '@/components/ParamiModal/BigModal';
import MetaMask, { MetamaskModal } from './metamask';

const SelectWallet: React.FC = () => {
    const [waitingModal, setWaitingModal] = useState<boolean>(false);
    const [walletType, setWalletType] = useState<string>('');

    const intl = useIntl();

    const { Title } = Typography;

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.contentContainer}>
                    <Card
                        className={style.loginCard}
                        bodyStyle={{
                            padding: 32,
                            width: '100%',
                        }}
                    >
                        <Title
                            level={4}
                            className={style.title}
                        >
                            {intl.formatMessage({
                                id: 'dashboard.bridge.login',
                                defaultMessage: 'Login',
                            })}
                        </Title>
                        <div className={style.appList}>
                            <MetaMask
                                setWaitingModal={setWaitingModal}
                                setWalletType={setWalletType}
                            />
                        </div>
                        <Divider />
                        <div className={style.getWallet}>
                            {intl.formatMessage({
                                id: 'dashboard.bridge.dontHaveWallet',
                                defaultMessage: 'Don\'t have wallet?',
                            })}
                            <Button
                                type='link'
                                size='middle'
                            >
                                {intl.formatMessage({
                                    id: 'dashboard.bridge.downloadHere',
                                    defaultMessage: 'Download here',
                                })}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
            <BigModal
                visable={waitingModal}
                title={walletType}
                content={walletType === 'Metamask' && (
                    <MetamaskModal />
                )}
                footer={false}
            />
        </>
    )
}

export default SelectWallet;
