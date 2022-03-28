import React from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { LoadingOutlined } from '@ant-design/icons';
import { Typography, Image, Card, Button, Spin } from 'antd';
import Skeleton from '@/components/Skeleton';

const SNS: React.FC<{
    setBindModal: React.Dispatch<React.SetStateAction<boolean>>;
    setBindPlatform: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setBindModal, setBindPlatform }) => {
    const linkedInfo = useModel('sns');

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
                    id: 'account.sns.title',
                })}
            </Title>
            <Skeleton
                loading={!Object.keys(linkedInfo).length}
                height={400}
                children={
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
                                    <Spin
                                        indicator={
                                            <LoadingOutlined spin />
                                        }
                                        spinning={!Object.keys(linkedInfo).length}
                                    >
                                        <Button
                                            disabled={null !== linkedInfo.Telegram}
                                            size='large'
                                            shape='round'
                                            type='primary'
                                            onClick={() => {
                                                setBindModal(true);
                                                setBindPlatform('Telegram');
                                            }}
                                        >
                                            {!linkedInfo.Telegram &&
                                                intl.formatMessage({
                                                    id: 'social.bind',
                                                })
                                            }
                                            {linkedInfo.Telegram === 'linked' &&
                                                intl.formatMessage({
                                                    id: 'social.binded',
                                                })
                                            }
                                            {linkedInfo.Telegram === 'verifing' &&
                                                intl.formatMessage({
                                                    id: 'social.verifing',
                                                })
                                            }
                                        </Button>
                                    </Spin>
                                </div>
                            </div>
                            <div className={style.field}>
                                <div className={style.title}>
                                    <img className={style.icon} src="/images/sns/discord.svg" />
                                    <span className={style.label}>Discord</span>
                                </div>
                                <div className={style.button}>
                                    <Button
                                        disabled
                                        size='large'
                                        shape='round'
                                        type='primary'
                                        onClick={() => {
                                            setBindModal(true);
                                            setBindPlatform('Discord');
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'social.coming',
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
                                        disabled
                                        size='large'
                                        shape='round'
                                        type='primary'
                                        onClick={() => {
                                            setBindModal(true);
                                            setBindPlatform('Twitter');
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'social.coming',
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
                                        disabled
                                        size='large'
                                        shape='round'
                                        type='primary'
                                        onClick={() => {
                                            setBindModal(true);
                                            setBindPlatform('Facebook');
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'social.coming',
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
                                        disabled
                                        size='large'
                                        shape='round'
                                        type='primary'
                                        onClick={() => {
                                            setBindModal(true);
                                            setBindPlatform('Mastodon');
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'social.coming',
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
                                        disabled
                                        size='large'
                                        shape='round'
                                        type='primary'
                                        onClick={() => {
                                            setBindModal(true);
                                            setBindPlatform('Github');
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'social.coming',
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
                                        disabled
                                        size='large'
                                        shape='round'
                                        type='primary'
                                        onClick={() => {
                                            setBindModal(true);
                                            setBindPlatform('Github');
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'social.coming',
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
                                        disabled
                                        size='large'
                                        shape='round'
                                        type='primary'
                                        onClick={() => {
                                            setBindModal(true);
                                            setBindPlatform('Reddit');
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'social.coming',
                                        })}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                }
            />
        </>
    )
}

export default SNS;
