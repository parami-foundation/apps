import React, { useEffect } from 'react';
import { Button, notification, Spin } from 'antd';
import { useIntl, history, useModel } from 'umi';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import BigModal from '@/components/ParamiModal/BigModal';
import { useState } from 'react';
import SelectAccount from './components/SelectAccount';
import config from '@/config/config';
import { LoadingOutlined } from '@ant-design/icons';

const Index: React.FC = () => {
    const apiWs = useModel('apiWs');
    const [selectModal, setSelectModal] = useState<boolean>(false);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const intl = useIntl();

    const updateAssetsInfo = async () => {
        if (!apiWs) {
            return;
        }
        const allEntries = await apiWs.query.assets.metadata.entries();
        const tmpAssets = {};
        for (let i = 0; i < allEntries.length; i++) {
            const [key, value] = allEntries[i];
            const shortKey = key.toHuman();
            if (!!shortKey) {
                tmpAssets[shortKey[0]] = value.toHuman();
            }
        }
        localStorage.setItem('parami:dashboard:assets', JSON.stringify(tmpAssets));
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
                localStorage.setItem('parami:dashboard:accounts', JSON.stringify(Accounts));
                await updateAssetsInfo();
                setAccounts(Accounts);
                setSelectModal(true);
            }
        }
    };

    useEffect(() => {
        if (apiWs) {
            setLoading(false);
        }
    }, [apiWs]);

    return (
        <>
            <div className={styles.mainIndexContainer}>
                <div className={styles.background} />
                <div className={styles.logoMark} />
                <div className={styles.pageContainer}>
                    <div className={style.firstPage}>
                        <div className={style.slogan}>
                            <div className={style.slogan}>
                                {intl.formatMessage({
                                    id: 'dashboard.index.title',
                                })}
                            </div>
                        </div>
                        <div className={style.buttons}>
                            <Button
                                block
                                size='large'
                                type='primary'
                                shape='round'
                                className={style.button}
                                onClick={() => {
                                    history.push(config.page.homePage);
                                }}
                            >
                                <div className={style.title}>
                                    {intl.formatMessage({
                                        id: 'dashboard.index.createAccount',
                                    })}
                                </div>
                                <span className={style.desc}>
                                    {intl.formatMessage({
                                        id: 'dashboard.index.createAccount.desc',
                                    })}
                                </span>
                            </Button>
                            <Spin
                                indicator={
                                    <LoadingOutlined spin />
                                }
                                style={{
                                    width: '100%',
                                }}
                                wrapperClassName={style.spinWrapper}
                                spinning={loading}
                            >
                                <Button
                                    block
                                    ghost
                                    size='large'
                                    type='link'
                                    shape='round'
                                    className={`${style.button} ${style.buttonImport}`}
                                    onClick={() => {
                                        checkExtension();
                                    }}
                                >
                                    <div className={style.title}>
                                        {intl.formatMessage({
                                            id: 'dashboard.index.selectAccount',
                                        })}
                                    </div>
                                    <span className={style.desc}>
                                        {intl.formatMessage({
                                            id: 'dashboard.index.selectAccount.desc',
                                        })}
                                    </span>
                                </Button>
                            </Spin>
                        </div>
                    </div>
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
