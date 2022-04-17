import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import styles from './style.less';

const { Title } = Typography;

const SecurityModal: React.FC<{
  visable: boolean;
  setVisable: React.Dispatch<React.SetStateAction<boolean>>;
  passphrase: string;
  setPassphrase: React.Dispatch<React.SetStateAction<string>>;
  func?: () => Promise<void>;
  changePassphrase?: boolean;
}> = ({ visable, setVisable, passphrase, setPassphrase, func, changePassphrase }) => {
  const { wallet } = useModel('currentUser');
  const [submitting, setSubmitting] = useState(false);

  const intl = useIntl();

  const inputVerify = (e: any) => {
    if (e) {
      setPassphrase(e.target.value);
    } else {
      setPassphrase('');
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    if (!passphrase || passphrase.length < 6) {
      setSubmitting(false);
      return;
    }
    if (func) {
      func();
    }
    setVisable(false);
    setSubmitting(false);
  };

  useEffect(() => {
    if (!!wallet?.passphrase && visable && !changePassphrase) {
      setPassphrase(wallet?.passphrase);
      handleSubmit();
    };
  }, [wallet?.passphrase, passphrase, visable, changePassphrase]);

  return (
    <Modal
      title={
        <>
          <Title level={3}>
            {intl.formatMessage({
              id: 'modal.security.title',
            })}
          </Title>
        </>
      }
      closable={false}
      className={styles.modal}
      centered
      visible={visable}
      width={650}
      footer={
        <>
          <div className={styles.buttons}>
            <Button
              block
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
            <Button
              block
              type="text"
              shape="round"
              size="large"
              className={styles.button}
              onClick={() => { setVisable(false) }}
              loading={submitting}
            >
              {intl.formatMessage({
                id: 'common.cancel',
              })}
            </Button>
          </div>
        </>
      }
    >
      <>
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
      </>
    </Modal>
  );
};
export default SecurityModal;
