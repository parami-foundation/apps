import React, { useState } from 'react';
import { Button, Card, Input, message, Typography, Divider, notification, Spin, Alert } from 'antd';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { guid, hexToDid } from '@/utils/common';
import { useEffect } from 'react';
import { CreateAccountAddress, CreateAccountKeystore, CreateMnemonic } from '@/services/parami/Identity';
import { EncodeKeystoreWithPwd } from '@/services/parami/Crypto';
import config from '@/config/config';
import BigModal from '@/components/ParamiModal/BigModal';

const goto = () => {
  setTimeout(() => {
    const redirect = localStorage.getItem('redirect');
    window.location.href = redirect || config.page.walletPage;
    localStorage.removeItem('redirect');
    localStorage.removeItem('process');
  }, 10);
};

const SelectMode: React.FC<{
  password: string;
  oldControllerUserAddress: string;
  oldControllerMnemonic: string;
  magicMnemonic: string;
  did: string;
  controllerMnemonic: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setMagicKeystore: React.Dispatch<React.SetStateAction<string>>;
  setControllerUserAddress: React.Dispatch<React.SetStateAction<string>>;
  setControllerMnemonic: React.Dispatch<React.SetStateAction<string>>;
}> = ({ password, oldControllerUserAddress, oldControllerMnemonic, magicMnemonic, did, controllerMnemonic, setStep, setPassword, setMagicKeystore, setControllerUserAddress, setControllerMnemonic }) => {
  const apiWs = useModel('apiWs');
  const [loading, setLoading] = useState<boolean>(true);
  const [recoverWithLink, setRecoverWithLink] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [verifyLink, setVerifyLink] = useState<string>();

  const intl = useIntl();
  const { Title } = Typography;
  const { TextArea } = Input;

  // Create New Controller Address
  const createNewControllerAddress = async () => {
    setLoading(true);
    try {
      // Create New Controller
      const { mnemonic: ControllerMnemonic } = await CreateMnemonic();
      const { address } = await CreateAccountAddress(ControllerMnemonic);
      setControllerMnemonic(ControllerMnemonic);
      setControllerUserAddress(address);

      // Set Controller
      localStorage.setItem('controllerUserAddress', address);

      setLoading(false);
    } catch (e: any) {
      notification.error({
        message: e.message,
        duration: null,
      });
      setLoading(false);
      return;
    }
  };

  // Create New Controller Keystore
  const createNewControllerKeystore = async () => {
    setLoading(true);
    try {
      const { keystore: ControllerKeystore } = await CreateAccountKeystore(
        controllerMnemonic,
        password,
      );

      // Set Controller
      localStorage.setItem('controllerKeystore', ControllerKeystore);
      setLoading(false);
    } catch (e: any) {
      notification.error({
        message: e.message,
        duration: null,
      });
      setLoading(false);
      return;
    }
  };

  // Create Magic Keystore
  const recoveryMagicKeystore = async () => {
    setLoading(true);
    try {
      // Recovery Magic Account
      const { keystore: MagicKeyStore } = await CreateAccountKeystore(
        magicMnemonic,
        password,
      );
      setMagicKeystore(MagicKeyStore);
      localStorage.setItem('magicKeystore', MagicKeyStore);
      setLoading(false);
    } catch (e: any) {
      notification.error({
        message: e.message,
        duration: null,
      });
      setLoading(false);
      return;
    }
  };

  // GeneratePassword
  const GeneratePassword = async () => {
    const generatePassword = guid().substring(0, 6);
    setPassword(generatePassword);
    localStorage.setItem('stamp', generatePassword);
  };
  // GeneratePassword

  // Next Step
  const handleSubmit = async () => {
    if (!oldControllerMnemonic) {
      await createNewControllerKeystore();
      await recoveryMagicKeystore();

      setStep(3);
      return;
    } else {
      setLoading(true);
      const messageContent = `${intl.formatMessage({
        id: 'identity.recoveryLink.sendMessage',
      }, {
        link: recoverWithLink,
      })}`;

      const shareData = {
        title: 'Para Metaverse Identity',
        text: messageContent,
        url: recoverWithLink
      };

      setLoading(false);

      if (navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (e: any) {
          notification.warning({
            message: 'Please keep your Recovery Link safe.',
          })
        }
      };

      const oldControllerKeystore = await EncodeKeystoreWithPwd(password, oldControllerMnemonic)

      if (!!oldControllerKeystore) {
        localStorage.setItem('controllerUserAddress', oldControllerUserAddress);
        localStorage.setItem('controllerKeystore', oldControllerKeystore);
      } else {
        notification.error({
          message: 'The password is incorrect.',
        });
        return;
      }

      goto();
    }
  };

  useEffect(() => {
    // Init chain
    if (!apiWs) {
      return;
    }
    setLoading(false);

    // Generate Password
    if (!password) {
      GeneratePassword();
    }

    // Generate New Recovery Link
    if (!oldControllerMnemonic) {
      const newLink = `${window.location.origin}/recover/#${encodeURI(
        magicMnemonic as string,
      )};${encodeURI(
        controllerMnemonic as string,
      )}`;
      setRecoverWithLink(newLink);
    }
  }, [apiWs, password, oldControllerMnemonic, magicMnemonic, controllerMnemonic]);

  useEffect(() => {
    // Init chain
    if (!apiWs) {
      return;
    }
    if (!oldControllerMnemonic) {
      createNewControllerAddress();
    }
  }, [apiWs, oldControllerMnemonic]);

  return (
    <>
      <Card className={styles.card}>
        <img src={'/images/icon/link.svg'} className={style.topIcon} />
        <Title
          className={style.title}
        >
          {intl.formatMessage({
            id: 'identity.selectMode.title',
          })}
        </Title>
        <p className={style.description}>
          {intl.formatMessage({
            id: 'identity.selectMode.description',
          })}
        </p>
        <Divider />
        <div className={style.listBtn}>
          <div
            className={style.field}
            style={{
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: 10,
              }}
            >
              <span className={style.title}>
                {intl.formatMessage({
                  id: 'identity.selectMode.did',
                })}
              </span>
            </div>
            <TextArea
              size="small"
              style={{
                backgroundColor: '#fff',
              }}
              readOnly
              value={hexToDid(did)}
              autoSize={{ minRows: 1, maxRows: 4 }}
            />
          </div>
          {/* IF OLD USER */}
          {!oldControllerMnemonic && (
            <div className={style.recoveryLinkContainer}>
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                spinning={!magicMnemonic || !controllerMnemonic}
                wrapperClassName={style.recoveryLinkSpinWrapper}
                tip={intl.formatMessage({
                  id: 'identity.recoveryLink.placeholder',
                })}
              >
                <Alert
                  message={intl.formatMessage({
                    id: 'identity.recoveryLink.message',
                  })}
                  type="warning"
                  showIcon
                  style={{
                    width: '100%',
                    marginBottom: 10,
                  }}
                />
                <CopyToClipboard
                  text={recoverWithLink}
                  onCopy={() => {
                    if (!!magicMnemonic) {
                      message.success(
                        intl.formatMessage({
                          id: 'common.copied',
                        }),
                      )
                      setCopied(true);
                    }
                  }}
                >
                  <TextArea
                    autoSize
                    size="large"
                    placeholder={intl.formatMessage({
                      id: 'identity.recoveryLink.placeholder',
                    })}
                    value={!magicMnemonic ? intl.formatMessage({ id: 'identity.recoveryLink.placeholder' }) : recoverWithLink}
                    readOnly
                    className={style.recoveryLinkInput}
                  />
                </CopyToClipboard>
                <Divider />
                <CopyToClipboard
                  text={recoverWithLink}
                  onCopy={() => {
                    if (!!magicMnemonic) {
                      message.success(
                        intl.formatMessage({
                          id: 'common.copied',
                        }),
                      )
                      setCopied(true);
                    }
                  }}
                >
                  <Button
                    block
                    shape="round"
                    size="large"
                    className={style.copyButton}
                    icon={<CopyOutlined />}
                  >
                    {intl.formatMessage({
                      id: 'identity.recoveryLink.copyRecoveryLink',
                    })}
                  </Button>
                </CopyToClipboard>
              </Spin>
            </div>
          )}
          {/* IF OLD USER */}
        </div>
        <div className={style.buttons}>
          <Button
            block
            type="primary"
            shape="round"
            size="large"
            className={style.button}
            loading={loading}
            disabled={!oldControllerMnemonic ? !copied : false}
            onClick={() => !oldControllerMnemonic ? setShowModal(true) : handleSubmit()}
          >
            {intl.formatMessage({
              id: 'common.confirm',
            })}
          </Button>
        </div>
      </Card>
      <BigModal
        visable={showModal}
        title={intl.formatMessage({
          id: 'identity.recoveryLink.verifyRecoveryLink',
        })}
        content={
          <>
            <div className={style.field}>
              <Title level={4}>
                {intl.formatMessage({
                  id: 'identity.recoveryLink.verifyRecoveryLink.description',
                })}
              </Title>
              <Input
                size="large"
                bordered
                onChange={(e) => setVerifyLink(e.target.value)}
                placeholder={'https://app.parami.io/recover/#...'}
              />
            </div>
            <div className={style.buttons}>
              <Button
                block
                type="primary"
                shape="round"
                size="large"
                className={style.button}
                disabled={verifyLink !== recoverWithLink}
                onClick={() => handleSubmit()}
                loading={loading}
              >
                {intl.formatMessage({
                  id: 'common.confirm',
                })}
              </Button>
            </div>
          </>
        }
        footer={false}
        close={() => { setShowModal(false) }}
      />
    </>
  );
};

export default SelectMode;
