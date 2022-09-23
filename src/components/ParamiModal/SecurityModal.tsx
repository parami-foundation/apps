import React, { useState, useEffect } from 'react';
import { Alert, Button, Input, Modal, notification, Tooltip, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import styles from './style.less';
import AD3 from '../Token/AD3';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { DecodeKeystoreWithPwd } from '@/services/parami/Crypto';
import Keyring from '@polkadot/keyring';
import config from '@/config/config';

const { Title } = Typography;

const SecurityModal: React.FC<{
  visable: boolean;
  setVisable: React.Dispatch<React.SetStateAction<boolean>>;
  passphrase: string;
  setPassphrase: React.Dispatch<React.SetStateAction<string>>;
  func?: any;
  changePassphrase?: boolean | false;
}> = ({ visable, setVisable, passphrase, setPassphrase, func, changePassphrase }) => {
  const apiWs = useModel('apiWs');
  const { wallet } = useModel('currentUser');
  const { balance } = useModel('balance');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [gasFee, setGasFee] = useState<any>();

  const intl = useIntl();

  const inputVerify = (e: any) => {
    if (!!e) {
      setPassphrase(e.target.value);
    } else {
      setPassphrase('');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    if (!!wallet?.passphrase) {
      setPassphrase(wallet?.passphrase);
    }
    if ((!passphrase || passphrase.length < 6) && !wallet?.passphrase) {
      setSubmitting(false);
      return;
    }

    // validate passphrase
    const pwd = wallet?.passphrase || passphrase;
    if (pwd && wallet?.keystore) {
      const decrypted = DecodeKeystoreWithPwd(pwd, wallet.keystore);
      if (!decrypted) {
        notification.error({
          key: 'passphraseError',
          message: intl.formatMessage({
            id: 'error.passphrase.error',
          }),
          duration: null,
        });
        setPassphrase('');
        setSubmitting(false);
        return;
      }

      const keyring = new Keyring({ type: 'sr25519' });
      const { address } = keyring.addFromUri(decrypted);
      if (wallet?.account && wallet.account !== address) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = config.page.homePage;
      }
    }

    if (!!func) {
      try {
        await func();
      } catch (e) {
        console.log('security modal submit func error fallback', e);
      }
    }
    setVisable(false);
    setSubmitting(false);
  };

  const getGasfee = async () => {
    if (!!apiWs && !!wallet.account) {
      const info = await func(true, wallet.account);
      if (!!info) {
        setGasFee(info.partialFee);
      } else if (!changePassphrase) {
        await handleSubmit();
      }
    }
  };

  useEffect(() => {
    if (!!apiWs && !!wallet?.account && visable) {
      getGasfee();
    }
  }, [apiWs, wallet?.account, visable]);

  useEffect(() => {
    if (!!wallet?.passphrase && visable && !changePassphrase) {
      setPassphrase(wallet?.passphrase);
    };
  }, [wallet?.passphrase, passphrase, visable, changePassphrase]);

  return (
    <Modal
      title={
        <Title level={3}>
          {intl.formatMessage({
            id: 'modal.security.title',
          })}
        </Title>
      }
      closable={false}
      className={styles.modal}
      centered
      visible={visable}
      width={400}
      footer={
        <div className={styles.buttons}>
          <Button
            type="text"
            shape="round"
            size="large"
            className={styles.button}
            onClick={() => {
              setVisable(false);
              window.location.reload();
            }}
            loading={submitting}
          >
            {intl.formatMessage({
              id: 'common.decline',
            })}
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            className={styles.button}
            onClick={() => {
              handleSubmit();
            }}
            disabled={!passphrase || passphrase.length < 6}
            loading={submitting}
          >
            {intl.formatMessage({
              id: 'common.confirm',
            })}
          </Button>
        </div>
      }
    >
      <div className={styles.confirmContainer}>
        {!!gasFee && !!gasFee?.toString() > balance.free && (
          <Alert
            description={
              intl.formatMessage({
                id: 'error.balance.low',
              })
            }
            type="warning"
            showIcon
            banner
            className={styles.alertContainer}
          />
        )}
        {!!gasFee && (
          <div className={styles.field}>
            <div className={styles.labal}>
              {intl.formatMessage({
                id: 'modal.security.gas',
              })}
              <span className={styles.small}>
                ({intl.formatMessage({
                  id: 'modal.security.estimated',
                })})
              </span>
              <Tooltip
                placement="bottom"
                title={intl.formatMessage({
                  id: 'modal.security.gas.tooltip',
                  defaultMessage: 'Gas fees are paid to crypto miners who process transactions on the network. Parami does not profit from gas fees.',
                })}
              >
                <ExclamationCircleFilled
                  className={styles.labalIcon}
                />
              </Tooltip>
            </div>
            <div className={styles.value}>
              <AD3
                value={gasFee}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 900,
                }}
              />
            </div>
          </div>
        )}
      </div>
      {(!wallet?.passphrase || changePassphrase) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div className={styles.codeInput}>
            <div className={styles.verifyForm}>
              <span className={passphrase?.slice(0) && !passphrase?.slice(1, 5) && styles.highLight}>
                {passphrase?.slice(0, 1).replace(/[^]/, '✱')}
              </span>
              <span className={passphrase?.slice(1) && !passphrase?.slice(2, 5) && styles.highLight}>
                {passphrase?.slice(1, 2).replace(/[^]/, '✱')}
              </span>
              <span className={passphrase?.slice(2, 3) && !passphrase?.slice(3, 5) && styles.highLight}>
                {passphrase?.slice(2, 3).replace(/[^]/, '✱')}
              </span>
              <span className={passphrase?.slice(3, 4) && !passphrase?.slice(4, 5) && styles.highLight}>
                {passphrase?.slice(3, 4).replace(/[^]/, '✱')}
              </span>
              <span className={passphrase?.slice(4, 5) && !passphrase?.slice(5) && styles.highLight}>
                {passphrase?.slice(4, 5).replace(/[^]/, '✱')}
              </span>
              <span className={passphrase?.slice(5) && styles.highLight}>{passphrase?.slice(5).replace(/[^]/, '✱')}</span>
            </div>
            <Input.Password
              autoFocus
              autoComplete="new-password"
              size="large"
              className={styles.verifyInput}
              onChange={inputVerify}
              value={passphrase}
              disabled={submitting}
              maxLength={6}
              visibilityToggle={false}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
export default SecurityModal;
