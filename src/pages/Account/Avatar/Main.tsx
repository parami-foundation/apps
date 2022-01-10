import config from '@/config/config';
import { b64toBlob } from '@/utils/common';
import React, { useState } from 'react';
import { useIntl, history } from 'umi';
import generateRoundAvatar from '@/utils/encode';
import { Button, message, Spin, Upload } from 'antd';
import { uploadAvatar, uploadIPFS } from '@/services/parami/ipfs';
import style from './style.less';
import MyAvatar from '@/components/Avatar/MyAvatar';
import ImgCrop from 'antd-img-crop';
import { CloudUploadOutlined } from '@ant-design/icons';
import SecurityModal from '@/components/ParamiModal/SecurityModal';

const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

const Main: React.FC<{
    setModalVisable: React.Dispatch<React.SetStateAction<boolean>>;
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
                    setSecModal(true);
                });
        }
    };

    const UploadAvatar = async () => {
        if (!File) {
            message.error(intl.formatMessage({
                id: 'error.avatar.empty',
            }));
            return;
        }
        setSpinning(true);
        try {
            const res = await uploadIPFS(File);
            await uploadAvatar(`ipfs://${res.Hash}`, password, controllerKeystore);
            setModalVisable(false);
        } catch (e: any) {
            message.error(e.message);
        }
        setSpinning(false);
    };

    return (
        <>
            <Spin
                tip={intl.formatMessage({
                    id: 'common.uploading',
                })}
                spinning={spinning}
            >
                <div className={style.avatarEdit}>
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
                    <div className={style.buttons}>
                        <ImgCrop
                            zoom
                            rotate
                            quality={1}
                            modalTitle={intl.formatMessage({
                                id: 'wallet.avatar.uploadAvatar',
                            })}
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
                                    className={style.button}
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
                            className={style.button}
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
                func={UploadAvatar}
            />
        </>
    )
}

export default Main;