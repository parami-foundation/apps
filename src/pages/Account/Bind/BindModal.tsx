import MyAvatar from '@/components/Avatar/MyAvatar';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { LinkBlockChain, LinkSociality } from '@/services/parami/linker';
import { DecodeKeystoreWithPwd } from '@/services/parami/wallet';
import { solanaSignMessage } from '@/services/solana/solana';
import { signBSCMessage, signETHMessage } from '@/services/walletconnect/walletconnect';
import { hexToDid } from '@/utils/common';
import { base64url } from '@/utils/format';
import { DownOutlined } from '@ant-design/icons';
import Keyring from '@polkadot/keyring';
import { Alert, Button, Divider, Input, message, notification, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useIntl, history } from 'umi';
import style from '../style.less';
import { config } from './config';

const BindModal: React.FC<{
    bindPlatform: string;
    setBindModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ bindPlatform, setBindModal }) => {
    const stmap = localStorage.getItem('stamp');
    const did = localStorage.getItem('did') as string;
    const controllerUserAddress = localStorage.getItem('controllerUserAddress');
    const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

    const [secModal, setSecModal] = useState<boolean>(false);
    const [Password, setPassword] = useState<string>(stmap || '');
    const [loading, setLoading] = useState<boolean>(false);
    // SNS
    const [profileURL, setProfileURL] = useState<string>('');
    const [stampMode, setStampMode] = useState<boolean>(false);
    // BlockChain
    const [origin, setOrigin] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [signed, setSigned] = useState<string>('');
    const [wallet, setWallet] = useState<string>('');
    const [collapse, setCollapse] = useState<boolean>(false);

    const intl = useIntl();
    const { TextArea } = Input;

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
            sub: controllerUserAddress,
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

    const defaultSNS = async () => {
        if (profileURL === '') {
            message.error(intl.formatMessage({
                id: 'error.sns.emptyInput',
            }));
            return;
        }
        try {
            await LinkSociality(did, bindPlatform, profileURL, Password, controllerKeystore);
            setLoading(false);
            setBindModal(false);
        } catch (e: any) {
            notification.error({
                message: intl.formatMessage({
                    id: e.message || e,
                }),
            });
            setLoading(false);
            return;
        }
    };

    const defaultBlockChain = async () => {
        let Signed = signed;
        if (Signed.indexOf('0x') < 0) {
            message.error(intl.formatMessage({
                id: 'error.bind.signWrong',
            }));
            setLoading(false);
            return;
        };
        if (bindPlatform === 'Polkadot' || bindPlatform === 'Solana') {
            Signed = `0x00${signed}`;
        };

        try {
            await LinkBlockChain(bindPlatform, address, Signed, Password, controllerKeystore);
            setBindModal(false);
            setLoading(false);
        } catch (e: any) {
            notification.error({
                message: intl.formatMessage({
                    id: e.message || e,
                }),
            });
            setLoading(false);
            return;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        switch (bindPlatform) {
            // SNS
            case 'Discord':
                await handleStamp();
                setLoading(false);
                setBindModal(false);
                break;
            case 'Telegram':
                if (stampMode) {
                    await handleStamp();
                    setLoading(false);
                    setBindModal(false);
                } else {
                    await defaultSNS();
                    break;
                }
                break;

            // BlockChain
            case 'Ethereum':
                switch (wallet) {
                    case 'walletconnect':
                        try {
                            const { account: ethAccount, signedMsg: ethSignedMsg } = await signETHMessage(origin);
                            if (!!ethAccount && !!ethSignedMsg) {
                                notification.info({
                                    message: 'Got an signed message',
                                    description: ethSignedMsg,
                                    duration: 2
                                });
                                await LinkBlockChain(bindPlatform, ethAccount, ethSignedMsg, Password, controllerKeystore);
                                setBindModal(false);
                            }
                            setLoading(false);
                        } catch (e: any) {
                            notification.error({
                                message: intl.formatMessage({
                                    id: e.message || e,
                                }),
                            });
                            setLoading(false);
                        }
                        break;
                    default:
                        await defaultBlockChain();
                        break;
                }
                break;
            case 'Binance':
                switch (wallet) {
                    case 'walletconnect':
                        try {
                            const { account: bscAccount, signedMsg: bscSignedMsg } = await signBSCMessage(origin);
                            if (!!bscAccount && !!bscSignedMsg) {
                                notification.info({
                                    message: 'Got an signed message',
                                    description: bscSignedMsg,
                                    duration: 2
                                });
                                await LinkBlockChain(bindPlatform, bscAccount, bscSignedMsg, Password, controllerKeystore);
                                setBindModal(false);
                            }
                            setLoading(false);
                        } catch (e: any) {
                            notification.error({
                                message: intl.formatMessage({
                                    id: e.message || e,
                                }),
                            });
                            setLoading(false);
                        }
                        break;
                    default:
                        await defaultBlockChain();
                        break;
                }
                break;
            case 'Solana':
                switch (wallet) {
                    case 'sollet':
                        try {
                            const { account, signedMsg }: any = await solanaSignMessage(origin);
                            if (!!account && !!signedMsg) {
                                notification.info({
                                    message: 'Got an signed message',
                                    description: `0x00${signedMsg}`,
                                    duration: 2
                                })
                                await LinkBlockChain(bindPlatform, account, `0x00${signedMsg}`, Password, controllerKeystore);
                                setBindModal(false);
                            }
                            setLoading(false);
                        } catch (e: any) {
                            notification.error({
                                message: intl.formatMessage({
                                    id: e.message || e,
                                }),
                            });
                            setLoading(false);
                        }
                        break;
                    default:
                        await defaultBlockChain();
                        break;
                }
        };
    }

    // BlockChain
    useEffect(() => {
        setOrigin(`Link: ${hexToDid(did)}`);
    }, []);

    useEffect(() => {
        if (bindPlatform === 'Ethereum' || bindPlatform === 'Binance' || bindPlatform === 'Polkadot' || bindPlatform === 'Solana' || bindPlatform === 'Tron') {
            setCollapse(true);
        } else {
            setCollapse(false);
        };
    }, [bindPlatform]);

    return (
        <>
            <Spin
                tip={intl.formatMessage({
                    id: 'common.submitting',
                })}
                spinning={loading}
            >
                <div className={style.bindModal}>
                    {/* SNS */}
                    {bindPlatform === 'Telegram' && (
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
                    {bindPlatform === 'Twitter' && (
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
                                    onClick={() => {
                                        setSecModal(true);
                                        setStampMode(false);
                                    }}
                                    disabled={!profileURL}
                                >
                                    {intl.formatMessage({
                                        id: 'common.submit',
                                    })}
                                </Button>
                            </div>
                        </>
                    )}
                    {bindPlatform === 'Discord' && (
                        <>
                            <div className={style.field}>
                                <Button
                                    block
                                    size='large'
                                    type='primary'
                                    shape='round'
                                    onClick={() => {
                                        setSecModal(true);
                                        setStampMode(true);
                                    }}
                                >
                                    Parami Community
                                </Button>
                            </div>
                        </>
                    )}

                    {/* BlockChain */}
                    {(bindPlatform === 'Ethereum' || bindPlatform === 'Binance') && (
                        <>
                            <Button
                                block
                                type='primary'
                                size='large'
                                shape='round'
                                className={style.iconButton}
                                icon={<img src={'/images/sns/walletconnect-white.svg'} />}
                                style={{
                                    backgroundColor: '#3B99FC',
                                }}
                                onClick={() => {
                                    setWallet('walletconnect');
                                    setSecModal(true);
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'social.blockchain.walletconnet',
                                })}
                            </Button>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onClick={() => {
                                    setCollapse(!collapse);
                                }}
                            >
                                <Divider>
                                    {intl.formatMessage({
                                        id: 'social.blockchain.manual',
                                    })}
                                    <Button
                                        type="link"
                                        icon={
                                            <DownOutlined
                                                rotate={!collapse ? 0 : -180}
                                                className={style.expandButtonIcon}
                                            />
                                        }
                                        onClick={() => {
                                            setCollapse(!collapse);
                                        }}
                                    />
                                </Divider>
                            </div>
                        </>
                    )}
                    {bindPlatform === 'Solana' && (
                        <>
                            <Button
                                block
                                type='primary'
                                size='large'
                                shape='round'
                                className={style.iconButton}
                                icon={<img src={'/images/crypto/solana-sol-logo.svg'} />}
                                style={{
                                    backgroundColor: '#512da8',
                                }}
                                onClick={() => {
                                    setWallet('sollet');
                                    setSecModal(true);
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'social.blockchain.sollet',
                                })}
                            </Button>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onClick={() => {
                                    setCollapse(!collapse);
                                }}
                            >
                                <Divider>
                                    {intl.formatMessage({
                                        id: 'social.blockchain.manual',
                                    })}
                                    <Button
                                        type="link"
                                        icon={
                                            <DownOutlined
                                                rotate={!collapse ? 0 : -180}
                                                className={style.expandButtonIcon}
                                            />
                                        }
                                        onClick={() => {
                                            setCollapse(!collapse);
                                        }}
                                    />
                                </Divider>
                            </div>
                        </>
                    )}
                    {(bindPlatform === 'Polkadot' || bindPlatform === 'Tron') && (
                        <>
                            <Button
                                block
                                type='primary'
                                size='large'
                                shape='round'
                                className={style.iconButton}
                                icon={<img src={'/images/sns/tokenpocket-white.svg'} />}
                                style={{
                                    backgroundColor: '#2980FE',
                                }}
                                onClick={() => {
                                    setWallet('tokenpocket');
                                    setSecModal(true);
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'social.blockchain.tokenpocket',
                                })}
                            </Button>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onClick={() => {
                                    setCollapse(!collapse);
                                }}
                            >
                                <Divider>
                                    {intl.formatMessage({
                                        id: 'social.blockchain.manual',
                                    })}
                                    <Button
                                        type="link"
                                        icon={
                                            <DownOutlined
                                                rotate={!collapse ? 0 : -180}
                                                className={style.expandButtonIcon}
                                            />
                                        }
                                        onClick={() => {
                                            setCollapse(!collapse);
                                        }}
                                    />
                                </Divider>
                            </div>
                        </>
                    )}
                    {(bindPlatform === 'Ethereum' || bindPlatform === 'Binance' || bindPlatform === 'Solana' || bindPlatform === 'Polkadot' || bindPlatform === 'Tron') && (
                        <div
                            className={style.manualContainer}
                            style={{
                                maxHeight: !collapse ? '100vh' : 0,
                            }}
                        >
                            <div className={style.field}>
                                <div className={style.title}>
                                    {intl.formatMessage({
                                        id: 'social.blockchain.originText',
                                    })}
                                </div>
                                <div className={style.value}>
                                    <CopyToClipboard
                                        text={origin}
                                        onCopy={() => message.success(
                                            intl.formatMessage({
                                                id: 'common.copied',
                                            })
                                        )}
                                    >
                                        <Input
                                            readOnly
                                            size='large'
                                            value={origin}
                                        />
                                    </CopyToClipboard>
                                </div>
                            </div>
                            <Divider>
                                {intl.formatMessage({
                                    id: 'social.blockchain.tip',
                                })}
                            </Divider>
                            <div className={style.field}>
                                <div className={style.title}>
                                    {intl.formatMessage({
                                        id: 'social.blockchain.signed',
                                    })}
                                </div>
                                <div className={style.value}>
                                    <TextArea
                                        size='large'
                                        rows={4}
                                        value={signed}
                                        onChange={(e) => { setSigned(e.target.value) }}
                                    />
                                </div>
                            </div>
                            <div className={style.field}>
                                <div className={style.title}>
                                    {intl.formatMessage({
                                        id: 'social.blockchain.address',
                                    })}
                                </div>
                                <div className={style.value}>
                                    <Input
                                        size='large'
                                        onChange={(e) => { setAddress(e.target.value) }}
                                    />
                                </div>
                            </div>
                            <div className={style.field}>
                                <Button
                                    block
                                    size='large'
                                    type='primary'
                                    shape='round'
                                    onClick={() => {
                                        setPassword('');
                                        setSecModal(true);
                                    }}
                                    disabled={!address || !signed}
                                >
                                    {intl.formatMessage({
                                        id: 'common.submit',
                                    })}
                                </Button>
                            </div>
                        </div>
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
