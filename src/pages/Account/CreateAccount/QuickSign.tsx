import { Button, Card, Divider, Spin, Typography } from 'antd';
import React, { useState } from 'react';
import { useIntl, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import TelegramLoginButton from 'react-telegram-login';
import config from '@/config/config';

const { Title } = Typography;

const QuickSign: React.FC<{
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setQsTicket: React.Dispatch<any>;
    minimal?: boolean;
}> = ({ setStep, setQsTicket, minimal }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const intl = useIntl();

    const handleTelegram = async (response) => {
        setLoading(true);
        setQsTicket(response);
        setStep(2);
        setLoading(false);
    };

    return (
        <>
            {!minimal && (
                <Spin
                    tip={intl.formatMessage({
                        id: 'common.loading',
                    })}
                    spinning={loading}
                    wrapperClassName={styles.pageContainer}
                >
                    <Card className={styles.card}>
                        <img src={'/images/icon/option.svg'} className={style.topIcon} />
                        <Title
                            level={2}
                            style={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}
                            className={style.title}
                        >
                            {intl.formatMessage({
                                id: 'account.quicksign.title',
                            })}
                        </Title>
                        <p className={style.description}>
                            {intl.formatMessage({
                                id: 'account.quicksign.description',
                            })}
                        </p>
                        <Divider />
                        <TelegramLoginButton dataOnauth={handleTelegram} botName="paramiofficialbot" />
                        <Divider>
                            {intl.formatMessage({
                                id: 'index.or',
                            })}
                        </Divider>
                        <div className={style.buttons}>
                            <Button
                                block
                                type="primary"
                                shape="round"
                                size="large"
                                className={style.button}
                                onClick={() => setStep(2)}
                            >
                                {intl.formatMessage({
                                    id: 'account.quicksign.manual',
                                })}
                            </Button>
                            <Button
                                block
                                type="link"
                                size="large"
                                onClick={() => history.push(config.page.homePage)}
                            >
                                {intl.formatMessage({
                                    id: 'common.cancel',
                                })}
                            </Button>
                            <small
                                style={{
                                    textAlign: 'center',
                                    marginTop: 20,
                                    color: 'rgb(114, 114, 122)',
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'account.beforeStart.licDesc',
                                })}
                            </small>
                        </div>
                    </Card>
                </Spin>
            )}
            {minimal && (
                <Spin
                    tip={intl.formatMessage({
                        id: 'common.loading',
                    })}
                    spinning={loading}
                >
                    <TelegramLoginButton dataOnauth={handleTelegram} botName="paramiofficialbot" />
                    <small
                        style={{
                            textAlign: 'center',
                            marginTop: 20,
                            color: 'rgb(114, 114, 122)',
                        }}
                    >
                        {intl.formatMessage({
                            id: 'account.beforeStart.licDesc',
                        })}
                    </small>
                </Spin>
            )}
        </>
    )
}

export default QuickSign;
