import React from 'react';
import { useIntl, history } from 'umi';
import { useState } from 'react';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Upload, message, Spin } from 'antd';
import ImgCrop from 'antd-img-crop';
import { CloudUploadOutlined } from '@ant-design/icons';
import config from '@/config/config';
import styles from './Avatar.less';
import generateRoundAvatar from '@/utils/encode';
import { useEffect } from 'react';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { b64toBlob } from '@/utils/common';
import { uploadAvatar, uploadIPFS } from '@/services/parami/ipfs';
import MyAvatar from '@/components/Avatar/MyAvatar';

const keystore = localStorage.getItem('controllerKeystore') as string;

const AvatarMain: React.FC<{
    setModalVisable: React.Dispatch<React.SetStateAction<boolean>>,
}> = ({ setModalVisable }) => {
    const [password, setPassword] = useState<string>('');
    const [secModal, setSecModal] = useState<boolean>(false);
    const [File, setFile] = useState<Blob>();
    const [spinning, setSpinning] = useState<boolean>(false);

    const intl = useIntl();

    const onChange = async (info: any) => {
        if (info.event) {
            const did = localStorage.getItem('did');
            if (did === null) {
                history.push(config.page.createPage);
            };
            generateRoundAvatar(URL.createObjectURL(info.file.originFileObj), '', '', did)
                .then(async (img) => {
                    const file = (img as string).substring(22);
                    setFile(b64toBlob(file, 'image/png'));
                });
        }
    };

    const UploadAvatar = async () => {
        setSpinning(true);
        try {
            const res = await uploadIPFS(File);
            await uploadAvatar(`ipfs://${res.Hash}`, password, keystore);
            setModalVisable(false);
        } catch (e: any) {
            message.error(e.message);
        }
        setSpinning(false);
    };

    useEffect(() => {
        if (password !== '' && !!File) {
            UploadAvatar();
        }
        return;
    }, [password, File]);

    return (
        <>
            <Spin
                tip={intl.formatMessage({
                    id: 'common.uploading',
                })}
                spinning={spinning}
            >
                <div className={styles.avatarEdit}>
                    <MyAvatar
                        width={200}
                        height={200}
                    />
                    <span
                        className={styles.avatarSaveDesc}
                    >
                        {intl.formatMessage({
                            id: 'wallet.avatar.saveDesc',
                        })}
                    </span>
                    <div className={styles.buttons}>
                        <ImgCrop
                            zoom
                            rotate
                            quality={1}
                            modalTitle={intl.formatMessage({
                                id: 'wallet.avatar.uploadAvatar',
                            })}
                            onModalOk={() => {
                                setSecModal(true)
                            }}
                        >
                            <Upload
                                accept="image/*"
                                showUploadList={false}
                                onChange={onChange}
                            >
                                <Button
                                    block
                                    type="primary"
                                    size="large"
                                    shape='round'
                                    icon={<CloudUploadOutlined />}
                                    className={styles.button}
                                >
                                    {intl.formatMessage({
                                        id: 'wallet.avatar.upload',
                                    })}
                                </Button>
                            </Upload>
                        </ImgCrop>

                        <Button
                            block
                            size="large"
                            shape='round'
                            className={styles.button}
                            onClick={() => { setModalVisable(false) }}
                        >
                            {intl.formatMessage({
                                id: 'common.close',
                            })}
                        </Button>
                    </div>
                </div>
            </Spin>

            <SecurityModal
                visable={secModal}
                setVisable={setSecModal}
                password={password}
                setPassword={setPassword}
            //func={async () => { }}
            />
        </>
    )
}

const AvatarEdit: React.FC<{
    modalVisable: boolean,
    setModalVisable: React.Dispatch<React.SetStateAction<boolean>>,
}> = ({ modalVisable, setModalVisable }) => {
    const intl = useIntl();

    return (
        <>
            <BigModal
                visable={modalVisable}
                title={intl.formatMessage({
                    id: 'wallet.avatar.edit',
                })}
                content={
                    <AvatarMain
                        setModalVisable={setModalVisable}
                    />
                }
                footer={false}
            />
        </>
    )
}

const Avatar: React.FC = () => {
    const [modalVisable, setModalVisable] = useState<boolean>(false);
    return (
        <>
            <span
                onClick={() => { setModalVisable(true) }}
            >
                <MyAvatar
                    width={200}
                    height={200}
                />
            </span>
            <AvatarEdit
                modalVisable={modalVisable}
                setModalVisable={setModalVisable}
            />
        </>
    )
}

export default Avatar;