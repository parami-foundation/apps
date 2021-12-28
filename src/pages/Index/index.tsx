import React, { useEffect } from 'react';
import { Button, Card, Divider, Typography } from 'antd';
import { useIntl, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import config from '@/config/config';
import access from '@/access';

const { Title } = Typography;

const Index: React.FC = () => {
    const intl = useIntl();

    const initial = () => {
        if (access().canUser) {
            history.push(config.page.walletPage);
        }
    };

    useEffect(() => {
        initial();
    }, []);

    return (
        <>
            {window.matchMedia('(display-mode: standalone)').matches}
            <div className={styles.mainBgContainer}>
                <div className={styles.pageContainer}>
                    <Card className={style.indexCard}>
                        <Title
                            level={2}
                            style={{
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >
                            {intl.formatMessage({
                                id: 'index.title',
                            })}
                        </Title>
                        <span
                            className={style.subTitle}
                        >
                            {intl.formatMessage({
                                id: 'index.subtitle',
                            })}
                        </span>
                        <Divider />
                        <div className={style.buttons}>
                            <Button
                                block
                                type="primary"
                                shape="round"
                                size="large"
                                className={style.button}
                                onClick={() => history.push(config.page.createPage)}
                            >
                                {intl.formatMessage({
                                    id: 'index.createAccount',
                                })}
                            </Button>
                            <span className={style.or}>
                                {intl.formatMessage({
                                    id: 'index.or',
                                })}
                            </span>
                            <Button
                                block
                                shape="round"
                                size="large"
                                className={style.button}
                                onClick={() => history.push(config.page.dashboard.homePage)}
                            >
                                {intl.formatMessage({
                                    id: 'index.dashboard',
                                })}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default Index;