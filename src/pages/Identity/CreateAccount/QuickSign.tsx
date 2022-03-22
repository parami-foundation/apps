import { Button, Card, Divider, Spin, Typography } from 'antd';
import React, { useState } from 'react';
import { useIntl, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import TelegramLoginButton from 'react-telegram-login';
import config from '@/config/config';
import DiscordLoginButton from '@/components/Discord/DiscordLoginButton';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const { Title } = Typography;

const QuickSign: React.FC<{
    minimal?: boolean;
    controllerUserAddress: string;
    controllerKeystore: string;
    magicUserAddress: string;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setQsTicket: React.Dispatch<any>;
    setQsPlatform: React.Dispatch<React.SetStateAction<string | undefined>>;
}> = ({ minimal, controllerUserAddress, controllerKeystore, magicUserAddress, setStep, setQsTicket, setQsPlatform }) => {
    const [loading, setLoading] = useState<boolean>(true);

    const intl = useIntl();

    const handleQuickCreate = async (response, platform) => {
        setLoading(true);
        setQsPlatform(platform);
        setQsTicket(response);
        setStep(2);
        setLoading(false);
    };

    useEffect(() => {
        console.log(controllerUserAddress, controllerKeystore, magicUserAddress);
        if (!controllerUserAddress || !controllerKeystore || !magicUserAddress) {
            setLoading(false);
        }
    }, [controllerUserAddress, controllerKeystore, magicUserAddress]);

    return (
        <>
            {minimal ? (
                <Spin
                    tip={intl.formatMessage({
                        id: 'common.loading',
                    })}
                    spinning={loading}
                >
                    <TelegramLoginButton
                        dataOnauth={(response) => {
                            response.bot = config.airdropService.telegram.botName;
                            handleQuickCreate(response, 'Telegram');
                        }}
                        botName={config.airdropService.telegram.botName}
                    />
                    <DiscordLoginButton
                        dataOnauth={(response) => { handleQuickCreate(response, 'Discord') }}
                        clientId={config.airdropService.discord.clientId}
                        redirectUri={window.location.origin + config.airdropService.discord.redirectUri}
                    />
                    <small
                        style={{
                            textAlign: 'center',
                            marginTop: 20,
                            color: 'rgb(114, 114, 122)',
                        }}
                    >
                        {intl.formatMessage({
                            id: 'identity.beforeStart.licDesc',
                        })}
                    </small>
                </Spin>
            ) : (
                <Card className={styles.card}>
                    <Spin
                        size='large'
                        tip={intl.formatMessage({
                            id: 'common.loading',
                        })}
                        spinning={loading}
                        style={{
                            display: 'flex',
                            maxHeight: '100%',
                        }}
                    >
                        <img src={'/images/icon/option.svg'} className={style.topIcon} />
                        <Title
                            className={style.title}
                        >
                            {intl.formatMessage({
                                id: 'identity.quicksign.title',
                            })}
                        </Title>
                        <p className={style.description}>
                            {intl.formatMessage({
                                id: 'identity.quicksign.description1',
                            })}
                        </p>
                        <p className={style.description}>
                            {intl.formatMessage({
                                id: 'identity.quicksign.description2',
                            })}
                        </p>
                        <Button
                            type='link'
                            size='large'
                            className={style.link}
                            icon={<ArrowRightOutlined />}
                            onClick={() => {
                                window.open('http://parami.io', '_blank');
                            }}
                        >
                            {intl.formatMessage({
                                id: 'identity.quicksign.learnMore',
                            })}
                        </Button>
                        <Divider />
                        <TelegramLoginButton
                            dataOnauth={(response) => {
                                response.bot = config.airdropService.telegram.botName;
                                handleQuickCreate(response, 'Telegram');
                            }}
                            botName={config.airdropService.telegram.botName}
                        />
                        <DiscordLoginButton
                            dataOnauth={(response) => { handleQuickCreate(response, 'Discord') }}
                            clientId={config.airdropService.discord.clientId}
                            redirectUri={window.location.origin + config.airdropService.discord.redirectUri}
                        />
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
                                    id: 'identity.quicksign.manual',
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
                                    id: 'identity.beforeStart.licDesc',
                                })}
                            </small>
                        </div>
                    </Spin>
                </Card>
            )}
        </>
    )
}

export default QuickSign;
