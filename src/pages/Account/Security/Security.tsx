/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { Typography, Image, Card, Button, Tooltip, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { DecodeKeystoreWithPwd, EncodeKeystoreWithPwd } from '@/services/parami/wallet';
import { guid } from '@/utils/common';
import Skeleton from '@/components/Skeleton';

const controllerKeystore = localStorage.getItem('controllerKeystore') as string;
const stamp = localStorage.getItem('stamp') as string;

const Security: React.FC = () => {
    const apiWs = useModel('apiWs');
    const [passphraseEnable, setPassphraseEnable] = useState<string>();
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
            setPassphraseEnable('disable');
            message.success(intl.formatMessage({
                id: 'account.security.passphrase.changeSuccess',
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
            setPassphraseEnable('enable');
            message.success(intl.formatMessage({
                id: 'account.security.passphrase.changeSuccess',
            }));
            localStorage.removeItem('stamp');
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
            setSecModal(true);
        }
    }

    useEffect(() => {
        if (!!stamp) {
            setPassphraseEnable('disable');
        } else {
            setPassphraseEnable('enable');
        }
    }, [stamp, decoded, passphraseEnable]);

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
                    id: 'account.security.title',
                })}
            </Title>
            <Skeleton
                loading={!apiWs}
                children={
                    <>
                        <Title
                            level={5}
                            className={style.sectionSubtitle}
                        >
                            {intl.formatMessage({
                                id: 'account.security.subtitle',
                            })}
                            <Tooltip
                                placement="top"
                                title={intl.formatMessage({
                                    id: 'account.security.subtitle.tip',
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
                                            id: 'account.security.passphrase',
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
                                            })}
                                            {passphraseEnable === 'enable' && intl.formatMessage({
                                                id: 'common.disable',
                                            })}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </>
                }
            />
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
