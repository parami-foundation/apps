import React, { useState } from 'react';
import { Alert, Button, Card, Divider, Input, message, Typography } from 'antd';
import { useIntl, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import {
  GetStableAccount,
  QueryAccountFromMnemonic,
  QueryDid,
  QueryStableAccountByMagic,
} from '@/services/parami/wallet';
import config from '@/config/config';

const { Title } = Typography;

const InputLink: React.FC<{
  mnemonic: string;
  setMnemonic: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ mnemonic, setMnemonic, setStep }) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorState, setErrorState] = useState<API.Error>({});

  const intl = useIntl();

  const queryAccount = async () => {
    try {
      const { userAddress: magicUserAddress } = await QueryAccountFromMnemonic(mnemonic);

      const oldControllerData = await QueryStableAccountByMagic(
        magicUserAddress,
      );

      const stableAccountData = await GetStableAccount(
        oldControllerData?.oldControllerAddress,
      );
      const stashAccount = stableAccountData?.stashAccount;
      const didData = await QueryDid(stashAccount);

      if (didData === null) {
        setErrorState({
          Type: 'restore',
          Message: intl.formatMessage({
            id: 'error.account.notFound',
          }),
        });
        return;
      }

      setStep(2);

      return;
    } catch (e: any) {
      message.error(e.message);
      history.push(config.page.homePage);
      return;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await queryAccount();
    setSubmitting(false);
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
        <img src={'/images/icon/link.svg'} className={style.topIcon} />
        <Title
          level={2}
          style={{
            fontWeight: 'bold',
          }}
          className={style.title}
        >
          {intl.formatMessage({
            id: 'account.withLink.title',
          })}
        </Title>
        <p className={style.description}>
          {intl.formatMessage({
            id: 'account.withLink.description',
          })}
        </p>
        <Divider />
        <div className={style.field}>
          <Title level={4}>
            {intl.formatMessage({
              id: 'account.withLink.inputURL',
            })}
          </Title>
          <Input
            size="large"
            bordered
            onChange={(e) => {
              const pos = e.target.value.indexOf('/link/') + 6;
              const urlEncode = e.target.value.substring(pos);
              const Mnemonic = urlEncode.replace(/%20/g, ' ');
              setMnemonic(Mnemonic);
            }}
            disabled={submitting}
            placeholder={'https://wallet.parami.io/recover/link/...'}
          />
        </div>
        <div className={style.buttons}>
          <Button
            type="primary"
            shape="round"
            size="large"
            className={style.button}
            disabled={!mnemonic}
            loading={submitting}
            onClick={() => handleSubmit()}
          >
            {intl.formatMessage({
              id: 'common.confirm',
            })}
          </Button>
        </div>
      </Card>
    </>
  );
};

export default InputLink;
