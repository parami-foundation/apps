import React, { useState } from 'react';
import { Button, Card, Input, Typography, Divider, notification } from 'antd';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../../../style.less';
import { guid, hexToDid } from '@/utils/common';
import { useEffect } from 'react';
import { EncodeKeystoreWithPwd } from '@/services/parami/crypto';
import config from '@/config/config';

const SelectMode: React.FC<{
  passphrase: string;
  mnemonic: string;
  account: string;
  did: string;
  setPassphrase: React.Dispatch<React.SetStateAction<string>>;
}> = ({ mnemonic, passphrase, account, did, setPassphrase }) => {
  const apiWs = useModel('apiWs');
  const { initialState, refresh } = useModel('@@initialState');
  const [loading, setLoading] = useState<boolean>(false);

  const intl = useIntl();
  const { Title } = Typography;
  const { TextArea } = Input;

  const goto = () => {
    refresh();
    setTimeout(() => {
      window.location.href = initialState?.currentInfo?.wallet?.redirect || config.page.walletPage;
      localStorage.removeItem('parami:wallet:inProcess');
      localStorage.removeItem('parami:wallet:redirect');
    }, 10);
  };

  // GeneratePassword
  const GeneratePassword = async () => {
    const generatePassword = guid().substring(0, 6);
    setPassphrase(generatePassword);
    localStorage.setItem('parami:wallet:passphrase', generatePassword);
  };

  // Next Step
  const handleSubmit = async () => {
    setLoading(true);

    const keystore = await EncodeKeystoreWithPwd(passphrase, mnemonic);

    if (!!keystore) {
      localStorage.setItem('parami:wallet:account', account);
      localStorage.setItem('parami:wallet:keystore', keystore);
      setLoading(true);
    } else {
      notification.error({
        key: 'passwordIncorrect',
        message: 'The password is incorrect.',
      });
      setLoading(false);
      return;
    }

    goto();
  };

  useEffect(() => {
    // Wait for chain to be ready
    if (!apiWs) {
      return;
    };

    // Generate Password
    if (!passphrase) {
      GeneratePassword();
    };
  }, [apiWs, passphrase, mnemonic]);

  return (
    <Card className={styles.card}>
      <img src={'/images/icon/link.svg'} className={style.topIcon} />
      <Title
        className={style.title}
      >
        {intl.formatMessage({
          id: 'identity.selectMode.title',
        })}
      </Title>
      <p className={style.description}>
        {intl.formatMessage({
          id: 'identity.selectMode.description',
        })}
      </p>
      <Divider />
      <div className={style.listBtn}>
        <div
          className={style.field}
          style={{
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 10,
            }}
          >
            <span className={style.title}>
              {intl.formatMessage({
                id: 'identity.selectMode.did',
              })}
            </span>
          </div>
          <TextArea
            size="small"
            style={{
              backgroundColor: '#fff',
            }}
            readOnly
            value={hexToDid(did)}
            autoSize={{ minRows: 1, maxRows: 4 }}
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
          loading={loading}
          onClick={() => {
            handleSubmit();
          }}
        >
          {intl.formatMessage({
            id: 'common.confirm',
          })}
        </Button>
      </div>
    </Card>
  );
};

export default SelectMode;
