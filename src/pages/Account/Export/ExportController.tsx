import { Typography, Image, Card, Button, message, Input } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { DecodeKeystoreWithPwd } from '@/services/parami/wallet';
import BigModal from '@/components/ParamiModal/BigModal';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import SecurityModal from '@/components/ParamiModal/SecurityModal';

const ExportController: React.FC = () => {
    const [modalVisable, setModalVisable] = useState<boolean>(false);
    const [secModal, setSecModal] = useState<boolean>(false);
    const [mnemonic, setMnemonic] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const intl = useIntl();

    const controllerKeystore = localStorage.getItem('controllerKeystore') as string;
    const stamp = localStorage.getItem('stamp') as string;

    const { Title } = Typography;

    const handleSubmit = async () => {
        try {
            const decrypted = DecodeKeystoreWithPwd(password || stamp, controllerKeystore);
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

    return (
        <>
            <Title
                level={3}
                className={style.sectionTitle}
            >
                <Image
                    src='/images/icon/backup.svg'
                    className={style.sectionIcon}
                    preview={false}
                />
                {intl.formatMessage({
                    id: 'profile.export.title',
                    defaultMessage: 'Export'
                })}
            </Title>
            <div className={style.export}>
                <Card
                    className={`${styles.card} ${style.exportCard}`}
                    bodyStyle={{
                        padding: 0,
                        width: '100%',
                    }}
                >
                    <div className={style.field}>
                        <div className={style.title}>
                            {intl.formatMessage({
                                id: 'profile.export.exportController',
                                defaultMessage: 'Export Controller'
                            })}
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                                onClick={() => {
                                    setSecModal(true);
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'common.export',
                                    defaultMessage: 'Export'
                                })}
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card
                    className={`${styles.card} ${style.exportCard}`}
                    bodyStyle={{
                        padding: 0,
                        width: '100%',
                    }}
                >
                    <div className={style.field}>
                        <div className={style.title}>
                            {intl.formatMessage({
                                id: 'profile.export.exportAll',
                                defaultMessage: 'Export All'
                            })}
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'common.export',
                                    defaultMessage: 'Export'
                                })}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

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
                        <div className={style.bottomButtons}>
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
                                    className={style.button}
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
                                className={style.button}
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
                func={handleSubmit}
            />
        </>
    )
}

export default ExportController;
