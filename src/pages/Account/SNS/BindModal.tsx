import MyAvatar from '@/components/Avatar/MyAvatar';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { LinkSociality } from '@/services/parami/linker';
import { Alert, Button, Input, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import style from '../style.less';

const Message: React.FC<{
    content: string;
}> = ({ content }) => (
    <Alert
        style={{
            marginBottom: 24,
        }}
        message={content}
        type="error"
        showIcon
    />
);

const BindModal: React.FC<{
    platform: string;
    setBindModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ platform, setBindModal }) => {
    const [errorState, setErrorState] = useState<API.Error>({});
    const [profileURL, setProfileURL] = useState<string>('');
    const [secModal, setSecModal] = useState<boolean>(false);
    const [Password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const intl = useIntl();

    const did = localStorage.getItem('did') as string;
    const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

    const handleSubmit = async () => {
        if (profileURL === '') {
            message.error(intl.formatMessage({
                id: 'error.sns.emptyInput',
            }));
            return;
        }
        setLoading(true);
        try {
            await LinkSociality(did, platform, profileURL, Password, controllerKeystore);
            setLoading(false);
            setBindModal(false);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: intl.formatMessage({
                    id: e,
                }),
            });
            setLoading(false);
            return;
        }
    };

    useEffect(() => { }, [profileURL]);

    return (
        <>
            <Spin
                tip={intl.formatMessage({
                    id: 'common.submitting',
                })}
                spinning={loading}
            >
                <div className={style.bindModal}>
                    {errorState.Message && <Message content={errorState.Message} />}
                    <MyAvatar
                        width={200}
                        height={200}
                    />
                    <span
                        className={style.avatarSaveDesc}
                    >
                        {intl.formatMessage({
                            id: 'wallet.avatar.saveDesc',
                        })}
                    </span>
                    {platform !== 'Telegram' && (
                        <Alert
                            message={intl.formatMessage({
                                id: 'social.sns.setAvatar',
                            })}
                            type="warning"
                        />
                    )}
                    {platform === 'Telegram' && (
                        <Alert
                            message={intl.formatMessage({
                                id: 'social.sns.setAvatar.telegram',
                            })}
                            type="warning"
                        />
                    )}
                    {platform === 'Telegram' && (
                        <div className={style.field}>
                            <div className={style.title}>
                                {intl.formatMessage({
                                    id: 'social.sns.username',
                                })}
                            </div>
                            <div className={style.value}>
                                <Input
                                    addonBefore="@"
                                    size='large'
                                    onChange={(e) => (
                                        setProfileURL(`https://t.me/${e.target.value}`)
                                    )}
                                />
                            </div>
                        </div>
                    )}
                    {platform === 'Twitter' && (
                        <div className={style.field}>
                            <div className={style.title}>
                                {intl.formatMessage({
                                    id: 'social.sns.username',
                                })}
                            </div>
                            <div className={style.value}>
                                <Input
                                    addonBefore="@"
                                    size='large'
                                    onChange={(e) => (
                                        setProfileURL(`https://twitter.com/${e.target.value}`)
                                    )}
                                />
                            </div>
                        </div>
                    )}
                    {(platform !== 'Telegram' && platform !== 'Twitter') && (
                        <div className={style.field}>
                            <div className={style.title}>
                                {intl.formatMessage({
                                    id: 'social.sns.profileURL',
                                })}
                            </div>
                            <div className={style.value}>
                                <Input
                                    size='large'
                                    onChange={(e) => (
                                        setProfileURL(e.target.value)
                                    )}
                                />
                            </div>
                        </div>
                    )}
                    <div className={style.field}>
                        <Button
                            block
                            size='large'
                            type='primary'
                            shape='round'
                            onClick={() => { setSecModal(true) }}
                            disabled={!profileURL}
                        >
                            {intl.formatMessage({
                                id: 'common.submit',
                            })}
                        </Button>
                    </div>
                </div>
            </Spin>
            <SecurityModal
                visable={secModal}
                setVisable={setSecModal}
                password={Password}
                setPassword={setPassword}
                func={handleSubmit}
            />
        </>
    )
}

export default BindModal;
