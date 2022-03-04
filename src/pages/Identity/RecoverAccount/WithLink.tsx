import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Input, message, Typography, Divider } from 'antd';
import { useIntl, history, useModel } from 'umi';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import {
  CreateAccount,
  GetStableAccount,
  QueryAccountFromMnemonic,
  QueryDid,
  QueryStableAccountByMagic,
  RestoreAccount,
} from '@/services/parami/wallet';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { guid, hexToDid } from '@/utils/common';

const { Title } = Typography;

const WithLink: React.FC<{
  magicMnemonic: string;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setMagicKeystore: React.Dispatch<React.SetStateAction<string>>;
  setControllerUserAddress: React.Dispatch<React.SetStateAction<string>>;
  setMagicUserAddress: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ magicMnemonic, password, setPassword, setMagicKeystore, setControllerUserAddress, setMagicUserAddress, setStep }) => {
  const apiWs = useModel('apiWs');
  const [submitting, setSubmitting] = useState(false);
  const [errorState, setErrorState] = useState<API.Error>({});
  const [Did, setDid] = useState<string>('');

  const intl = useIntl();

  const inputVerify = (e: any) => {
    if (e) {
      setPassword(e.target.value);
    } else {
      setPassword('');
    }
  };

  const queryAccount = async () => {
    try {
      const { userAddress: MagicUserAddress } = await QueryAccountFromMnemonic(magicMnemonic);

      const oldControllerAddress = await QueryStableAccountByMagic(
        MagicUserAddress,
      );

      const stableAccountData = await GetStableAccount(
        oldControllerAddress,
      );

      const didData = await QueryDid(stableAccountData?.stashAccount);

      if (didData === null) {
        message.error(
          intl.formatMessage({
            id: 'error.identity.notFound',
          }),
        );
        history.push(config.page.homePage);
        return;
      }
      localStorage.setItem('magicUserAddress', MagicUserAddress);
      localStorage.setItem('did', didData);

      setMagicUserAddress(MagicUserAddress);
      setDid(didData as string);

      return;
    } catch (e: any) {
      message.error(e.message);
      history.push(config.page.homePage);
      return;
    }
  };

  const handleSubmit = async (genPassword?: string) => {
    setSubmitting(true);

    const passwd = genPassword || password;
    console.log(passwd)

    try {
      const magicData = await RestoreAccount(
        passwd,
        magicMnemonic,
      );
      setMagicKeystore(magicData?.keystore as string);
      sessionStorage.setItem('magicKeystore', magicData?.keystore as string);

      // New Controller
      const controllerMnemonic = mnemonicGenerate(12);
      const newControllerData = await CreateAccount(
        controllerMnemonic,
        passwd,
      );

      setControllerUserAddress(newControllerData?.userAddress as string);

      // Set Controller
      localStorage.setItem('controllerUserAddress', newControllerData?.userAddress as string);
      localStorage.setItem('controllerKeystore', newControllerData?.keystore as string);

      setStep(3);

      setSubmitting(false);
    } catch (e: any) {
      setErrorState({
        Type: 'restore',
        Message: e.message,
      });
      return;
    }
  };

  // GeneratePassword
  const GeneratePassword = async () => {
    const generatePassword = guid().substring(0, 6);
    setPassword(generatePassword);
    localStorage.setItem('stamp', generatePassword);
    await handleSubmit(generatePassword);
  };
  // GeneratePassword

  useEffect(() => {
    if (apiWs) {
      queryAccount();
    }
  }, [apiWs]);

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
        <img src={'/images/icon/link.svg'} className={style.topIcon} />
        <Title
          level={2}
          style={{
            fontWeight: 'bold',
          }}
          className={style.title}
        >
          {intl.formatMessage({
            id: 'identity.withLink.title',
          })}
        </Title>
        <p className={style.description}>
          {intl.formatMessage({
            id: 'identity.withLink.description',
          })}
        </p>
        <Divider />
        <div className={style.field}>
          <Title level={4}>
            {intl.formatMessage({
              id: 'identity.withLink.subtitle',
            })}
          </Title>
          <Input
            size="large"
            bordered
            disabled
            value={Did ? hexToDid(Did) : ''}
            placeholder="did:ad3:"
          />
        </div>
        <div className={style.field}>
          <Title level={4}>
            {intl.formatMessage({
              id: 'identity.withLink.setPassword',
            })}
          </Title>
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
        </div>
        <div className={style.buttons}>
          <Button
            block
            type="primary"
            shape="round"
            size="large"
            className={style.button}
            loading={submitting}
            onClick={() => GeneratePassword()}
          >
            {intl.formatMessage({
              id: 'identity.withLink.generatePassword',
            })}
          </Button>
          <Button
            block
            type="primary"
            shape="round"
            size="large"
            className={style.button}
            loading={submitting}
            disabled={!password || password.length < 6}
            onClick={() => handleSubmit()}
          >
            {intl.formatMessage({
              id: 'common.confirm',
            })}
          </Button>
          <CopyToClipboard
            text={window.location.toString()}
            onCopy={() =>
              message.success(
                intl.formatMessage({
                  id: 'common.copied',
                }),
              )
            }
          >
            <Button
              block
              shape="round"
              size="large"
              className={style.button}
              icon={<CopyOutlined />}
            >
              {intl.formatMessage({
                id: 'common.copy',
              })}
            </Button>
          </CopyToClipboard>
        </div>
      </Card>
    </>
  );
};

export default WithLink;
