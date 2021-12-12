import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, Divider, Input, Typography, message } from 'antd';
import { useIntl, history } from 'umi';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { CreateAccount } from '@/services/parami/wallet';
import { guid } from '@/utils/common';

const { Title } = Typography;

const SetPassword: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setControllerUserAddress: React.Dispatch<React.SetStateAction<string>>;
  setControllerKeystore: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setStep, password, setPassword, setControllerUserAddress, setControllerKeystore }) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorState, setErrorState] = useState<API.Error>({});

  const intl = useIntl();

  // Controller Account
  const createControllerAccount = async (generatePassword?: string) => {
    try {
      const newMnemonic = await mnemonicGenerate(12);
      const createControllerData = await CreateAccount(
        newMnemonic,
        generatePassword,
      );
      setControllerUserAddress(createControllerData.userAddress as string);
      setControllerKeystore(createControllerData.keystore as string);
      localStorage.setItem('controllerUserAddress', createControllerData.userAddress as string);
      localStorage.setItem('controllerKeystore', createControllerData.keystore as string);
    } catch (e: any) {
      message.error(e.message);
      return;
    }
  };
  // Controller Account

  // GeneratePassword
  const GeneratePassword = async () => {
    const generatePassword = guid().substring(0, 6);
    setPassword(generatePassword);
    localStorage.setItem('stamp', generatePassword);
    await createControllerAccount(generatePassword);
  };
  // GeneratePassword

  useEffect(() => {
    GeneratePassword();
    setStep(5);
  }, []);

  const inputVerify = (e: any) => {
    if (e) {
      setPassword(e.target.value);
    } else {
      setPassword('');
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    if (!password || password.length < 6) {
      setErrorState({
        Type: 'empty',
        Message: intl.formatMessage({
          id: 'error.password.empty',
        }),
      });
      setSubmitting(false);
      return;
    }
    setStep(4);
  };

  const Message: React.FC<{
    content: string;
  }> = ({ content }) => (
    <Alert
      style={{
        marginBottom: 24,
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
            textAlign: 'center',
          }}
          className={style.title}
        >
          {intl.formatMessage({
            id: 'account.setPassword.title',
          })}
        </Title>
        <p className={style.description}>
          {intl.formatMessage({
            id: 'account.setPassword.description',
          })}
        </p>
        <Divider />
        <div className={style.codeInput}>
          <div className={style.verifyForm}>
            <span className={password.slice(0) && !password.slice(1, 5) && style.highLight}>
              {password.slice(0, 1).replace(/[^]/, '✱')}
            </span>
            <span className={password.slice(1) && !password.slice(2, 5) && style.highLight}>
              {password.slice(1, 2).replace(/[^]/, '✱')}
            </span>
            <span className={password.slice(2, 3) && !password.slice(3, 5) && style.highLight}>
              {password.slice(2, 3).replace(/[^]/, '✱')}
            </span>
            <span className={password.slice(3, 4) && !password.slice(4, 5) && style.highLight}>
              {password.slice(3, 4).replace(/[^]/, '✱')}
            </span>
            <span className={password.slice(4, 5) && !password.slice(5) && style.highLight}>
              {password.slice(4, 5).replace(/[^]/, '✱')}
            </span>
            <span className={password.slice(5) && style.highLight}>{password.slice(5).replace(/[^]/, '✱')}</span>
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
            disabled={!password || password.length < 6}
            loading={submitting}
          >
            {intl.formatMessage({
              id: 'common.confirm',
            })}
          </Button>
          <span>
            {intl.formatMessage({
              id: 'account.alreadyCreate',
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
              id: 'account.recoverAccount',
            })}
          </a>
        </div>
      </Card>
    </>
  );
};

export default SetPassword;
