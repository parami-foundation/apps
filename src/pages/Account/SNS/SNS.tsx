import React, { useEffect, useState } from 'react';
import { useIntl, history, useModel } from 'umi';
import { Typography, Image, Card, Button, Spin } from 'antd';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { LoadingOutlined } from '@ant-design/icons';
import BigModal from '@/components/ParamiModal/BigModal';
import BindModal from './BindModal';
import config from '@/config/config';

const SNS: React.FC = () => {
    const linkedInfo = useModel('sns');
    const [bindModal, setBindModal] = useState<boolean>(false);
    const [platform, setPlatform] = useState<string>('');

    const intl = useIntl();

    const { query } = history.location;
    const { type, from } = query as { type: string, from: string };

    const { Title } = Typography;

    useEffect(() => {
        if (from && type === 'sns') {
            setBindModal(true);
            setPlatform(from);
        }
    }, [from, type]);

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
                                        setPlatform('Telegram');
                                    }}
                                >
                                    {!linkedInfo.Telegram ?
                                        intl.formatMessage({
                                            id: 'social.bind',
                                        }) :
                                        intl.formatMessage({
                                            id: 'social.binded',
                                        })
                                    }
                                </Button>
                            </Spin>
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
                                    setPlatform('Twitter');
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
                                    setPlatform('Discord');
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
                                    setPlatform('Facebook');
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
                                    setPlatform('Mastodon');
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
                                    setPlatform('Github');
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
                                    setPlatform('Github');
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
                                    setPlatform('Reddit');
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

            <BigModal
                visable={bindModal}
                title={intl.formatMessage({
                    id: 'social.bind.sns.title',
                }, {
                    platform: platform,
                })}
                content={
                    <BindModal
                        platform={platform}
                        setBindModal={setBindModal}
                    />}
                close={() => {
                    setBindModal(false);
                    history.push(config.page.accountPage);
                }}
                footer={
                    <>
                        <Button
                            block
                            shape='round'
                            size='large'
                            onClick={() => {
                                setBindModal(false);
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
    )
}

export default SNS;
