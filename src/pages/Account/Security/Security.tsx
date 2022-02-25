import React, { useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { Typography, Image, Card, Button, Tooltip, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { DecodeKeystoreWithPwd, EncodeKeystoreWithPwd } from '@/services/parami/wallet';
import { guid } from '@/utils/common';

const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

const Security: React.FC = () => {
    const passphrase = localStorage.getItem('passphrase');
    const stamp = localStorage.getItem('stamp') as string;

    const [passphraseEnable, setPassphraseEnable] = useState<string>(passphrase || 'disable');
    const [password, setPassword] = useState<string>('');
    const [secModal, setSecModal] = useState<boolean>(false);
    const [changePassword, setChangePassword] = useState<boolean>(true);
    const [decoded, setDecoded] = useState<string>();

    const intl = useIntl();

    const { Title } = Typography;

    const encryptKeystore = async () => {
        if (passphraseEnable === 'enable') {
            const decodedMnemonic = DecodeKeystoreWithPwd(password, controllerKeystore);
            if (!decodedMnemonic) {
                message.error(intl.formatMessage({
                    id: 'error.password.error',
                }));
                return;
            }
            const generatePassword = guid().substring(0, 6);
            setPassword(generatePassword);
            localStorage.setItem('stamp', generatePassword);
            const encodedMnemonic = EncodeKeystoreWithPwd(generatePassword, decodedMnemonic);
            if (!encodedMnemonic) {
                message.error(intl.formatMessage({
                    id: 'error.password.error',
                }));
                return;
            }
            localStorage.setItem('controllerKeystore', encodedMnemonic);
            localStorage.setItem('passphrase', 'disable');
            setPassphraseEnable('disable');
            message.success(intl.formatMessage({
                id: 'profile.security.passphrase.changeSuccess',
                defaultMessage: 'Modified successfully',
            }));
            window.location.reload();
        } else {
            if (!decoded) {
                message.error(intl.formatMessage({
                    id: 'error.password.error',
                }));
                return;
            }
            const encodedMnemonic = EncodeKeystoreWithPwd(password, decoded);
            if (!encodedMnemonic) {
                message.error(intl.formatMessage({
                    id: 'error.password.error',
                }));
                return;
            }
            localStorage.setItem('controllerKeystore', encodedMnemonic);
            localStorage.setItem('passphrase', 'enable');
            setPassphraseEnable('enable');
            message.success(intl.formatMessage({
                id: 'profile.security.passphrase.changeSuccess',
                defaultMessage: 'Modified successfully',
            }));
            window.location.reload();
        }
    }

    const passphraseModeChange = async () => {
        if (passphraseEnable === 'enable') {
            // disable
            setSecModal(true);
        } else {
            // enable
            const decodedMnemonic = DecodeKeystoreWithPwd(stamp, controllerKeystore);
            if (!decodedMnemonic) {
                message.error(intl.formatMessage({
                    id: 'error.password.error',
                }));
                return;
            }
            setDecoded(decodedMnemonic);
            localStorage.removeItem('stamp');
            setSecModal(true);
        }
    }

    useEffect(() => { }, [passphrase, decoded, stamp]);

    return (
        <>
            <Title
                level={3}
                className={style.sectionTitle}
            >
                <Image
                    src='/images/icon/safe.svg'
                    className={style.sectionIcon}
                    preview={false}
                />
                {intl.formatMessage({
                    id: 'profile.security.title',
                    defaultMessage: 'Security'
                })}
            </Title>
            <Title
                level={5}
                className={style.sectionSubtitle}
            >
                {intl.formatMessage({
                    id: 'profile.security.subtitle',
                    defaultMessage: 'Most Secure (Recommended)'
                })}
                <Tooltip
                    placement="top"
                    title={intl.formatMessage({
                        id: 'profile.security.subtitle.tip',
                        defaultMessage: 'Passphrases can be secure if used correctly (they must be written down and stored safely).'
                    })}
                >
                    <ExclamationCircleOutlined className={style.infoIcon} />
                </Tooltip>
            </Title>
            <div className={style.security}>
                <Card
                    className={`${styles.card} ${style.securityCard}`}
                    bodyStyle={{
                        padding: 0,
                        width: '100%',
                    }}
                >
                    <div className={style.field}>
                        <div className={style.title}>
                            {intl.formatMessage({
                                id: 'profile.security.passphrase',
                                defaultMessage: 'Passphrase'
                            })}
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                                onClick={() => {
                                    passphraseModeChange();
                                }}
                            >
                                {passphraseEnable === 'disable' && intl.formatMessage({
                                    id: 'common.enable',
                                    defaultMessage: 'Enable'
                                })}
                                {passphraseEnable === 'enable' && intl.formatMessage({
                                    id: 'common.disable',
                                    defaultMessage: 'Disable'
                                })}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
            <SecurityModal
                visable={secModal}
                setVisable={setSecModal}
                password={password}
                setPassword={setPassword}
                func={encryptKeystore}
                changePassword={changePassword}
            />
        </>
    )
}

export default Security;
