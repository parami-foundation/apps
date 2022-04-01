import React, { useState } from 'react';
import { Button, Card, Divider, Input, message, Spin, Typography, notification } from 'antd';
import { useIntl, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import config from '@/config/config';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { guid } from '@/utils/common';
import { CreateAccountAddress, CreateAccountKeystore, CreateMnemonic } from '@/services/parami/Identity';
import BigModal from '@/components/ParamiModal/BigModal';

const { Title } = Typography;

const RecoveryLink: React.FC<{
  magicMnemonic: string;
  controllerMnemonic: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setControllerMnemonic: React.Dispatch<React.SetStateAction<string>>;
  setControllerKeystore: React.Dispatch<React.SetStateAction<string>>;
  setControllerUserAddress: React.Dispatch<React.SetStateAction<string>>;
}> = ({ magicMnemonic, controllerMnemonic, setStep, setPassword, setControllerMnemonic, setControllerKeystore, setControllerUserAddress }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [verifyLink, setVerifyLink] = useState<string>();

  const recoverWithLink = `${window.location.origin}/recover/#${encodeURI(
    magicMnemonic as string,
  )};${encodeURI(
    controllerMnemonic as string,
  )}`;

  const intl = useIntl();
  const { TextArea } = Input;

  // Create Controller Keystore
  const createControllerKeystore = async (password: string) => {
    try {
      const { mnemonic } = await CreateMnemonic();
      const { keystore } = await CreateAccountKeystore(
        mnemonic,
        password,
      );
      setControllerMnemonic(mnemonic);
      setControllerKeystore(keystore);
      localStorage.setItem('controllerKeystore', keystore);
    } catch (e: any) {
      notification.error({
        message: e.message,
        duration: null,
      });
      return;
    }
  }

  // Create Controller Address
  const createControllerUserAddress = async () => {
    try {
      const { address } = await CreateAccountAddress(controllerMnemonic);
      setControllerUserAddress(address);
      localStorage.setItem('controllerUserAddress', address);
    } catch (e: any) {
      notification.error({
        message: e.message,
        duration: null,
      });
      return;
    }
  }

  // Generate Password
  const GeneratePassword = async () => {
    const generatePassword = guid().substring(0, 6);
    setPassword(generatePassword);
    localStorage.setItem('stamp', generatePassword);
    await createControllerKeystore(generatePassword);
  };
  // GeneratePassword

  const handleSubmit = async () => {
    setSubmitting(true);

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

    setSubmitting(false);

    if (navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (e: any) {
        notification.warning({
          message: 'Please keep your Recovery Link safe.',
        })
      }
    }

    await createControllerUserAddress();

    setStep(3);
  };

  useEffect(() => {
    GeneratePassword();
  }, []);

  return (
    <>
      <Card className={styles.card}>
        <img src={'/images/icon/link.svg'} className={style.topIcon} />
        <Title
          className={style.title}
        >
          {intl.formatMessage({
            id: 'identity.recoveryLink.title',
          })}
        </Title>
        <p className={style.description}>
          {intl.formatMessage({
            id: 'identity.recoveryLink.description',
          }, {
            strong: <strong>{intl.formatMessage({ id: 'identity.recoveryLink.description.strong' })}</strong>
          })}
        </p>
        <Divider />
        <div className={style.recoveryLinkContainer}>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            spinning={!magicMnemonic}
            wrapperClassName={style.recoveryLinkSpinWrapper}
            tip={intl.formatMessage({
              id: 'identity.recoveryLink.placeholder',
            })}
          >
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
        <div className={style.buttons}>
          <Button
            block
            type="primary"
            shape="round"
            size="large"
            className={style.button}
            onClick={() => setShowModal(true)}
            disabled={!magicMnemonic || !copied}
            loading={submitting}
          >
            {intl.formatMessage({
              id: 'common.confirm',
            })}
          </Button>
          <span>
            {intl.formatMessage({
              id: 'identity.alreadyCreate',
            })}
          </span>
          <a
            style={{
              textDecoration: 'underline',
              color: 'rgb(114, 114, 122)',
            }}
            onClick={() => history.push(config.page.recoverPage)}
          >
            {intl.formatMessage({
              id: 'identity.recoverAccount',
            })}
          </a>
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
                placeholder={`${window.location.origin}/recover/#...`}
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
                loading={submitting}
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

export default RecoveryLink;
