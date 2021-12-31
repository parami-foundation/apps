import React from 'react';
import { useIntl } from 'umi';
import { Typography, Image, Card, Button } from 'antd';
import styles from '@/pages/wallet.less';
import style from '../style.less';

const SNS: React.FC = () => {
    const intl = useIntl();

    const { Title } = Typography;

    return (
        <>
            <Title
                level={3}
                className={style.sectionTitle}
            >
                <Image
                    src='/images/icon/sns.svg'
                    className={style.sectionIcon}
                    preview={false}
                />
                {intl.formatMessage({
                    id: 'profile.sns.title',
                    defaultMessage: 'SNS'
                })}
            </Title>
            <div className={style.bind}>
                <Card
                    className={`${styles.card} ${style.bindCard}`}
                    bodyStyle={{
                        padding: 0,
                        width: '100%',
                    }}
                >
                    <div className={style.field}>
                        <div className={style.title}>
                            <Image
                                className={style.icon}
                                src="/images/sns/telegram.svg"
                                preview={false}
                            />
                            <span className={style.label}>Telegram</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/sns/twitter.svg" />
                            <span className={style.label}>Twitter</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/sns/discord.svg" />
                            <span className={style.label}>Discord</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/sns/facebook.svg" />
                            <span className={style.label}>Facebook</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/sns/mastodon.svg" />
                            <span className={style.label}>Mastodon</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/sns/github.svg" />
                            <span className={style.label}>Github</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/sns/hacker-news.svg" />
                            <span className={style.label}>Hacker News</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/sns/reddit.svg" />
                            <span className={style.label}>Reddit</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
                                })}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default SNS;
