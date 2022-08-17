import React, { useEffect, useState } from 'react';
import { Button, Divider, Input, message, Spin, Typography, notification } from 'antd';
import { useIntl } from 'umi';
import style from './Mnemonic.less';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import BigModal from '@/components/ParamiModal/BigModal';
import { useModel } from 'umi';
import { DecodeKeystoreWithPwd, EncodeKeystoreWithPwd } from '@/services/parami/Crypto';
import InputPassphraseModal from '../InputPassphraseModal/InputPassphraseModal';

const { Title } = Typography;

const Mnemonic: React.FC<{
  onConfirm: () => void,
}> = ({ onConfirm }) => {
  const { wallet } = useModel('currentUser');
  const [mnemonic, setMnemonic] = useState<string>('');


  const [copied, setCopied] = useState<boolean>(false);
  const [confirmMnemonicModal, setConfirmMnemonicModal] = useState<boolean>(false);
  const [verifyMnemonic, setVerifyMnemonic] = useState<string>();
  const [passphraseModal, setPassphraseModal] = useState<boolean>(false);

  const [passphrase, setPassphrase] = useState<string>('');

  const intl = useIntl();

  const onConfirmPassphrase = (passphraseConfirm: string) => {
    if (passphraseConfirm !== passphrase) {
      notification.error({
        message: 'Passphrases do not match.',
        description: 'Please re-enter.'
      });
      return;
    }

    const encodedKeystore = EncodeKeystoreWithPwd(passphrase, mnemonic);
    if (!encodedKeystore) {
      message.error(intl.formatMessage({
        id: 'error.passphrase.error',
      }));
      return;
    }
    
    localStorage.setItem('parami:wallet:keystore', encodedKeystore);
    message.success('Mnemonic Setup Complete!');
    localStorage.removeItem('parami:wallet:passphrase');
    localStorage.setItem('parami:wallet:mnemonicExported', 'true');
    window.location.reload();
  }

  useEffect(() => {
    if (wallet?.passphrase && wallet?.keystore) {
      const decrypted = DecodeKeystoreWithPwd(wallet?.passphrase, wallet?.keystore);
      if (!decrypted) {
        notification.error({
          message: 'Export Mnemonic Error',
          duration: null
        });
        return;
      }
      setMnemonic(decrypted);
    }
  }, [wallet])

  return (
    <>
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
          onClick={() => setConfirmMnemonicModal(true)}
          disabled={!mnemonic || !copied}
        >
          {intl.formatMessage({
            id: 'common.confirm',
          })}
        </Button>
      </div>

      {confirmMnemonicModal && <BigModal
        visable
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
                onClick={() => {
                  setConfirmMnemonicModal(false);
                  setPassphraseModal(true);
                }}
              >
                {intl.formatMessage({
                  id: 'common.confirm',
                })}
              </Button>
            </div>
          </>
        }
        footer={false}
        close={() => { setConfirmMnemonicModal(false) }}
      />}

      {passphraseModal && <InputPassphraseModal
        title='Set Passphrase'
        onCancel={() => setPassphraseModal(false)}
        onSubmit={p => {
          setPassphraseModal(false);
          setPassphrase(p);
        }}
      ></InputPassphraseModal>}

      {passphrase && <InputPassphraseModal
        title='Confirm Passphrase'
        onCancel={() => setPassphrase('')}
        onSubmit={onConfirmPassphrase}
      ></InputPassphraseModal>}
    </>
  );
};

export default Mnemonic;
