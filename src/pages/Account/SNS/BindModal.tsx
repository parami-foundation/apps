import MyAvatar from '@/components/Avatar/MyAvatar';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { LinkSociality } from '@/services/parami/linker';
import { DecodeKeystoreWithPwd } from '@/services/parami/wallet';
import { base64url } from '@/utils/format';
import Keyring from '@polkadot/keyring';
import { Alert, Button, Input, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, history } from 'umi';
import style from '../style.less';
import { config } from './config';

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
    const controllerAddress = localStorage.getItem('controllerUserAddress');
    const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

    const handleStamp = async () => {
        const { query } = history.location;
        const { audience, scope } = query as { audience: string, scope: string | null | undefined };
        const scopes = scope ?? '';
        const sign = scopes.indexOf('sign') > -1;

        let stamp: string = '';

        const timestamp = Date.now() / 1000 | 0;

        const header = JSON.stringify({
            alg: sign ? 'SrDSA' : 'none',
            typ: 'JWT'
        });

        const payload = JSON.stringify({
            iss: window.location.origin,
            sub: controllerAddress,
            aud: audience,
            iat: timestamp,
            exp: timestamp + 30
        });

        const plain = `${base64url(header)}.${base64url(payload)}`;

        if (!sign) {
            stamp = `${plain}.`;
            window.open(`${config?.validator?.paramiCommunity}#stamp=${stamp}&t=${Date.now()}`);
            return;
        }

        const instanceKeyring = new Keyring({ type: 'sr25519' });
        const decodedMnemonic = DecodeKeystoreWithPwd(Password, controllerKeystore);
        console.log(decodedMnemonic)
        if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
            message.error(
                intl.formatMessage({
                    id: 'error.password.error',
                })
            );
            return;
        }
        const keypair = instanceKeyring.createFromUri(decodedMnemonic);

        const signature = keypair.sign(plain);
        const ticket = `${plain}.${base64url(signature)}`;

        stamp = ticket;

        window.open(`${config?.validator?.paramiCommunity}#stamp=${stamp}&t=${Date.now()}`);
    };

    const handleSubmit = async () => {
        switch (platform) {
            case 'Discord':
                await handleStamp();
                break;
            default:
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
                    {platform === 'Telegram' && (
                        <>
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
                            <Alert
                                message={intl.formatMessage({
                                    id: 'social.sns.setAvatar.telegram',
                                })}
                                type="warning"
                            />
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
                        </>
                    )}
                    {platform === 'Twitter' && (
                        <>
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
                            <Alert
                                message={intl.formatMessage({
                                    id: 'social.sns.setAvatar',
                                })}
                                type="warning"
                            />
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
                        </>
                    )}
                    {platform === 'Discord' && (
                        <>
                            <div className={style.field}>
                                <Button
                                    block
                                    size='large'
                                    type='primary'
                                    shape='round'
                                    onClick={() => { setSecModal(true) }}
                                >
                                    Parami Community
                                </Button>
                            </div>
                        </>
                    )}
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
