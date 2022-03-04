import React, { useState } from 'react';
import { Alert, Button, Card, Divider, Input, Typography } from 'antd';
import { useIntl, history } from 'umi';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import style from '../style.less';

const { Title } = Typography;

const ConfirmPassword: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>;
  password: string,
}> = ({ setStep, password }) => {
  const [submitting, setSubmitting] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorState, setErrorState] = useState<API.Error>({});

  const intl = useIntl();

  const inputVerify = (e: any) => {
    if (e) {
      setConfirmPassword(e.target.value);
    } else {
      setConfirmPassword('');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    if (confirmPassword !== password) {
      setErrorState({
        Type: 'not match',
        Message: intl.formatMessage({
          id: 'error.password.passwordNotMatch',
        }),
      });
      setSubmitting(false);
      return;
    }

    setStep(5);
  };

  const Message: React.FC<{
    content: string;
  }> = ({ content }) => (
    <Alert
      style={{
        marginBottom: 24,
        textAlign: 'center',
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  return (
    <>
      {errorState.Message && <Message content={errorState.Message} />}
      <Card className={styles.card}>
        <img src={'/images/icon/password.svg'} className={style.topIcon} />
        <Title
          level={2}
          style={{
            fontWeight: 'bold',
          }}
          className={style.title}
        >
          {intl.formatMessage({
            id: 'identity.confirmPassword.title',
          })}
        </Title>
        <p className={style.description}>
          {intl.formatMessage({
            id: 'identity.confirmPassword.description',
          })}
        </p>
        <Divider />
        <div className={style.codeInput}>
          <div className={style.verifyForm}>
            <span className={confirmPassword.slice(0) && !confirmPassword.slice(1, 5) && style.highLight}>
              {confirmPassword.slice(0, 1).replace(/[^]/, '✱')}
            </span>
            <span className={confirmPassword.slice(1) && !confirmPassword.slice(2, 5) && style.highLight}>
              {confirmPassword.slice(1, 2).replace(/[^]/, '✱')}
            </span>
            <span className={confirmPassword.slice(2, 3) && !confirmPassword.slice(3, 5) && style.highLight}>
              {confirmPassword.slice(2, 3).replace(/[^]/, '✱')}
            </span>
            <span className={confirmPassword.slice(3, 4) && !confirmPassword.slice(4, 5) && style.highLight}>
              {confirmPassword.slice(3, 4).replace(/[^]/, '✱')}
            </span>
            <span className={confirmPassword.slice(4, 5) && !confirmPassword.slice(5) && style.highLight}>
              {confirmPassword.slice(4, 5).replace(/[^]/, '✱')}
            </span>
            <span className={confirmPassword.slice(5) && style.highLight}>{confirmPassword.slice(5).replace(/[^]/, '✱')}</span>
          </div>
          <Input.Password
            autoFocus
            autoComplete="new-password"
            size="large"
            className={style.verifyInput}
            onChange={inputVerify}
            disabled={submitting}
            maxLength={6}
            visibilityToggle={false}
          />
        </div>
        <div className={style.buttons}>
          <Button
            block
            type="primary"
            shape="round"
            size="large"
            className={style.button}
            onClick={() => handleSubmit()}
            disabled={!confirmPassword || confirmPassword.length < 6}
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
    </>
  );
};

export default ConfirmPassword;
