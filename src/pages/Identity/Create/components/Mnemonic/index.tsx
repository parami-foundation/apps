import React, { useState } from 'react';
import { Button, Card, Divider, Input, message, Spin, Typography, notification } from 'antd';
import { useIntl, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../../../style.less';
import config from '@/config/config';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { guid } from '@/utils/common';
import { CreateKeystore } from '@/services/parami/Identity';
import BigModal from '@/components/ParamiModal/BigModal';

const { Title } = Typography;

const Mnemonic: React.FC<{
  mnemonic: string;
  passphrase: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setPassphrase: React.Dispatch<React.SetStateAction<string>>;
  setKeystore: React.Dispatch<React.SetStateAction<string>>;
}> = ({ mnemonic, setStep, setPassphrase, setKeystore }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [verifyMnemonic, setVerifyMnemonic] = useState<string>();

  const intl = useIntl();

  // Create Keystore
  const createKeystore = async (password: string) => {
    try {
      const { keystore } = await CreateKeystore(
        mnemonic,
        password,
      );
      setKeystore(keystore);
      localStorage.setItem('parami:wallet:keystore', keystore);
    } catch (e: any) {
      notification.error({
        message: e.message || e,
        duration: null,
      });
      return;
    }
  };

  // Generate Password
  const GeneratePassword = async () => {
    const generatePassword = guid().substring(0, 6);
    setPassphrase(generatePassword);
    localStorage.setItem('parami:wallet:passphrase', generatePassword);
    await createKeystore(generatePassword);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const shareData = {
      title: 'Para Metaverse Identity',
      text: mnemonic,
    };

    setSubmitting(false);

    if (navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (e: any) {
        notification.warning({
          key: 'shareWarning',
          message: 'Please keep your Recovery Link safe.',
        })
      }
    }

    await GeneratePassword();

    setStep(3);
  };

  return (
    <>
      <Card className={styles.card}>
        <img src={'/images/icon/mnemonic.svg'} className={style.topIcon} />
        <Title
          className={style.title}
        >
          {intl.formatMessage({
            id: 'identity.mnemonic.title',
          })}
        </Title>
        <p className={style.description}>
          {intl.formatMessage({
            id: 'identity.mnemonic.description',
          }, {
            strong:
              <strong>
                {intl.formatMessage({
                  id: 'identity.mnemonic.description.strong'
                })}
              </strong>
          })}
        </p>
        <Divider />
        <div className={style.recoveryLinkContainer}>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            spinning={!mnemonic}
            wrapperClassName={style.recoveryLinkSpinWrapper}
            tip={intl.formatMessage({
              id: 'identity.mnemonic.placeholder',
            })}
          >
            <CopyToClipboard
              text={mnemonic}
              onCopy={() => {
                if (!!mnemonic) {
                  message.success(
                    intl.formatMessage({
                      id: 'common.copied',
                    }),
                  )
                  setCopied(true);
                }
              }}
            >
              <div className={style.seedPhrase}>
                {mnemonic.split(' ').map((word, index) => (
                  <span
                    key={index + 1}
                    className={style.singlePhrase}
                  >
                    <span className={style.singlePhraseIndex}>
                      {index + 1}
                    </span>
                    <span className={style.singlePhraseWord}>
                      {word}
                    </span>
                  </span>
                ))}
              </div>
            </CopyToClipboard>
            <Divider />
            <CopyToClipboard
              text={mnemonic}
              onCopy={() => {
                if (!!mnemonic) {
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
                  id: 'identity.mnemonic.copyMnemonics',
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
            disabled={!mnemonic || !copied}
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
          id: 'identity.mnemonic.verifyMnemonics',
        })}
        content={
          <>
            <div className={style.field}>
              <Title level={4}>
                {intl.formatMessage({
                  id: 'identity.mnemonic.verifyMnemonics.description',
                })}
              </Title>
              <Input
                size="large"
                bordered
                onChange={(e) => setVerifyMnemonic(e.target.value)}
                placeholder={'Enter your mnemonic likes apple banana orange...'}
              />
            </div>
            <div className={style.buttons}>
              <Button
                block
                type="primary"
                shape="round"
                size="large"
                className={style.button}
                disabled={verifyMnemonic !== mnemonic}
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

export default Mnemonic;
