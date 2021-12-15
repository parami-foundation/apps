import React, { useEffect } from 'react';
import { Button, Card, notification, Typography } from 'antd';
import { useIntl, history } from 'umi';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import access from '@/access';
import BigModal from '@/components/ParamiModal/BigModal';
import { useState } from 'react';
import SelectAccount from './components/SelectAccount';
import config from '@/config/config';

const { Title } = Typography;

const Index: React.FC = () => {
    const [selectModal, setSelectModal] = useState<boolean>(false);
    const [accounts, setAccounts] = useState<any[]>([]);

    const intl = useIntl();

    const initial = () => {
        if (access().canUser) {
        }
    };

    const updateAssetsInfo = async () => {
        const allEntries = await window.apiWs.query.assets.metadata.entries();
        const tmpAssets = {};
        for (let i = 0; i < allEntries.length; i++) {
            const [key, value] = allEntries[i];
            const shortKey = key.toHuman();
            if (!!shortKey) {
                tmpAssets[shortKey[0]] = value.toHuman();
            }
        }
        localStorage.setItem('dashboardAssets', JSON.stringify(tmpAssets));
    };

    const checkExtension = async () => {
        const extensions = await web3Enable('Parami Dashboard');
        if (extensions.length === 0) {
            notification.error({
                message: intl.formatMessage({
                    id: 'error.noExtension.title',
                }),
                description: intl.formatMessage({
                    id: 'error.noExtension.description',
                }),
                duration: null,
                onClick: async () => {
                    window.open('https://polkadot.js.org/extension/');
                },
                onClose: async () => {
                    window.open('https://polkadot.js.org/extension/');
                },
            });
        } else {
            const Accounts = await web3Accounts();
            if (Accounts.length === 0) {
                notification.error({
                    message: intl.formatMessage({
                        id: 'error.noExtension.title',
                    }),
                    description: intl.formatMessage({
                        id: 'error.noExtension.description',
                    }),
                    duration: 6,
                });
            } else {
                localStorage.setItem('dashboardAccounts', JSON.stringify(Accounts));
                await updateAssetsInfo();
                setAccounts(Accounts);
                setSelectModal(true);
            }
        }
    };

    useEffect(() => {
        initial();
    }, []);

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={style.indexContainer}>
                    <Card className={style.indexCard}>
                        <Title
                            level={2}
                            style={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}
                        >
                            {intl.formatMessage({
                                id: 'dashboard.index.title',
                            })}
                        </Title>
                        <span className={style.subTitle}>
                            {intl.formatMessage({
                                id: 'dashboard.index.subtitle',
                            })}
                        </span>
                        <div className={style.buttons}>
                            <Button
                                type="primary"
                                shape="round"
                                size="large"
                                className={style.button}
                                onClick={() => { history.push(config.page.homePage) }}
                            >
                                {intl.formatMessage({
                                    id: 'dashboard.index.createAccount',
                                })}
                            </Button>
                            <span className={style.or}>
                                {intl.formatMessage({
                                    id: 'index.or',
                                })}
                            </span>
                            <Button
                                shape="round"
                                size="large"
                                className={style.button}
                                onClick={() => {
                                    checkExtension();
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'dashboard.index.selectAccount',
                                })}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
            <BigModal
                visable={selectModal}
                title={intl.formatMessage({
                    id: 'dashboard.index.selectAccount',
                })}
                content={
                    <SelectAccount
                        accounts={accounts}
                    />
                }
                footer={
                    <>
                        <Button
                            block
                            shape='round'
                            size='large'
                            onClick={() => {
                                setSelectModal(false);
                            }}
                        >
                            {intl.formatMessage({
                                id: 'common.close',
                            })}
                        </Button>
                    </>
                }
            />
        </>
    );
};

export default Index;
