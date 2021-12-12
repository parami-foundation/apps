import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import BigModal from '@/components/ParamiModal/BigModal';
import styles from './ExportController.less';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { DecodeKeystoreWithPwd } from '@/services/parami/wallet';

const ExportController: React.FC = () => {
    const [modalVisable, setModalVisable] = useState<boolean>(false);
    const [secModal, setSecModal] = useState<boolean>(false);
    const [mnemonic, setMnemonic] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const intl = useIntl();

    const controllerKeystore = localStorage.getItem('controllerKeystore');

    const handleSubmit = async () => {
        try {
            const decrypted = DecodeKeystoreWithPwd(password, controllerKeystore as string);
            if (!decrypted) {
                message.error(
                    intl.formatMessage({
                        id: 'error.password.error',
                    }),
                );
                setPassword('');
                return;
            }
            setMnemonic(decrypted);
            setModalVisable(true);
        } catch (e: any) {
            message.error(
                intl.formatMessage({
                    id: 'error.password.error',
                }),
            );
            setPassword('');
        }
    }
    useEffect(() => {
        if (password !== '') {
            handleSubmit();
        }
    }, [
        password
    ]);
    return (
        <>
            <Button
                block
                size='large'
                shape='round'
                type='primary'
                className={styles.entryButton}
                icon={
                    <LockOutlined />
                }
                onClick={() => setSecModal(true)}
            >
                {intl.formatMessage({
                    id: 'wallet.exportController.title',
                })}
            </Button>
            <BigModal
                title={
                    intl.formatMessage({
                        id: 'wallet.exportController.subtitle',
                    })
                }
                visable={modalVisable}
                content={
                    <>
                        <Input
                            size="large"
                            value={mnemonic}
                        />
                    </>
                }
                footer={
                    <>
                        <div className={styles.buttons}>
                            <CopyToClipboard
                                text={mnemonic}
                                onCopy={() => message.success(
                                    intl.formatMessage({
                                        id: 'common.copied',
                                    })
                                )}
                            >
                                <Button
                                    block
                                    shape='round'
                                    size='large'
                                    className={styles.button}
                                    icon={<CopyOutlined />}
                                >
                                    {intl.formatMessage({
                                        id: 'common.copy',
                                    })}
                                </Button>
                            </CopyToClipboard>
                            <Button
                                block
                                type='primary'
                                shape='round'
                                size='large'
                                className={styles.button}
                                onClick={() => { setModalVisable(false) }}
                            >
                                {intl.formatMessage({
                                    id: 'common.close',
                                })}
                            </Button>
                        </div>
                    </>
                }
            />
            <SecurityModal
                visable={secModal}
                setVisable={setSecModal}
                password={password}
                setPassword={setPassword}
            />
        </>
    )
}

export default ExportController;
