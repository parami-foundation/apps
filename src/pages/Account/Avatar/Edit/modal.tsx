import config from '@/config/config';
import { b64toBlob } from '@/utils/common';
import React, { useState } from 'react';
import { useIntl, history, useModel } from 'umi';
import generateRoundAvatar from '@/utils/encode';
import { Button, message, Spin, Upload, notification } from 'antd';
import { uploadAvatar, uploadIPFS } from '@/services/parami/IPFS';
import style from '../style.less';
import MyAvatar from '@/components/Avatar/MyAvatar';
import ImgCrop from 'antd-img-crop';
import { CloudUploadOutlined } from '@ant-design/icons';
import SecurityModal from '@/components/ParamiModal/SecurityModal';

const Modal: React.FC<{
  setModalVisable: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setModalVisable }) => {
  const { avatar, setAvatar } = useModel('user');
  const { wallet } = useModel('currentUser');
  const [passphrase, setPassphrase] = useState<string>('');
  const [secModal, setSecModal] = useState<boolean>(false);
  const [File, setFile] = useState<Blob>();
  const [spinning, setSpinning] = useState<boolean>(false);

  const intl = useIntl();

  const onChange = async (info: any) => {
    setSpinning(true);
    if (info?.event?.percent === 100) {
      if (wallet?.did === null) {
        history.push(config.page.createPage);
      };
      generateRoundAvatar(URL.createObjectURL(info.file.originFileObj), '', '', wallet?.did)
        .then(async (img) => {
          const file = (img as string).substring(22);
          setFile(b64toBlob(file, 'image/png'));
          setAvatar(window.URL.createObjectURL(b64toBlob(file, 'image/png')));
          setSecModal(true);
        });
    }
  };

  const UploadAvatar = async () => {
    if (!!wallet && !!wallet.keystore) {
      if (!File) {
        message.error(intl.formatMessage({
          id: 'error.avatar.empty',
        }));
        return;
      }
      try {
        const { response, data } = await uploadIPFS(File);
        if (response.ok) {
          await uploadAvatar(`ipfs://${data.Hash}`, passphrase, wallet?.keystore);
          setModalVisable(false);
        } else if (response.status === 405) {
          notification.error({
            message: intl.formatMessage({
              id: 'error.avatar.largeSize',
            }),
            duration: null,
          })
          setSpinning(false);
          return;
        }
      } catch (e: any) {
        notification.error({
          message: e.message || e,
          duration: null,
        });
        setSpinning(false);
        return;
      }
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      })
    }
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
          {!!avatar ? (
            <MyAvatar
              width={200}
              height={200}
            />
          ) : (
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
                action={config.ipfs.upload}
              >
                <MyAvatar
                  width={200}
                  height={200}
                />
              </Upload>
            </ImgCrop>
          )}
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
                action={config.ipfs.upload}
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
          </div>
        </div>
      </Spin>

      <SecurityModal
        visable={secModal}
        setVisable={setSecModal}
        passphrase={passphrase}
        setPassphrase={setPassphrase}
        func={UploadAvatar}
      />
    </>
  )
}

export default Modal;
