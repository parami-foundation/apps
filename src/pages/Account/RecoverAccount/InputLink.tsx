import React, { useState } from 'react';
import { Button, Card, Divider, Input, message, Typography } from 'antd';
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
  magicMnemonic: string;
  setMagicMnemonic: React.Dispatch<React.SetStateAction<string>>;
  setControllerKeystore: React.Dispatch<React.SetStateAction<string>>;
  setMagicUserAddress: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ magicMnemonic, setMagicMnemonic, setMagicUserAddress, setStep }) => {
  const [submitting, setSubmitting] = useState(false);

  const intl = useIntl();

  const queryAccount = async () => {
    try {
      const { userAddress: MagicUserAddress } = await QueryAccountFromMnemonic(magicMnemonic);

      const oldControllerData: any = await QueryStableAccountByMagic(
        MagicUserAddress,
      );

      setMagicUserAddress(MagicUserAddress);

      const stableAccountData = await GetStableAccount(
        oldControllerData?.oldControllerAddress,
      );

      const didData = await QueryDid(stableAccountData?.stashAccount);

      if (didData === null) {
        message.error(
          intl.formatMessage({
            id: 'error.account.notFound',
          }),
        );
        history.push(config.page.homePage);
        return;
      }
      localStorage.setItem('stashUserAddress', MagicUserAddress);
      localStorage.setItem('stashUserAddress', stableAccountData?.stashAccount as string);
      localStorage.setItem('did', didData);

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

  return (
    <>
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
              setMagicMnemonic(Mnemonic);
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
            disabled={!magicMnemonic}
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
