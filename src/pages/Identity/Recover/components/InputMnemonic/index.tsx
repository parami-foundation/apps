import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Input, notification, Spin, Typography } from 'antd';
import { useIntl, history, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../../../style.less';
import { QueryAccountExist, QueryAccountFromMnemonic, QueryDID } from '@/services/parami/Identity';

const InputMnemonic: React.FC<{
  mnemonic: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  setDID: React.Dispatch<React.SetStateAction<string>>;
  setMnemonic: React.Dispatch<React.SetStateAction<string>>;
}> = ({ mnemonic, setStep, setAccount, setDID, setMnemonic }) => {
  const apiWs = useModel('apiWs');
  const [loading, setLoading] = useState<boolean>(true);

  const { Title } = Typography;
  const intl = useIntl();

  const { hash } = history.location;
  const mnemonics = hash?.substring(1);

  // Compatible with old RecoveryLink
  let importMnemonic: string = '';

  if (!!mnemonics) {
    if (mnemonics.indexOf(';') > -1) {
      const mnemonicArray = mnemonics.split(';');
      importMnemonic = mnemonicArray[1]?.replace(/%20/g, ' ');
      setMnemonic(importMnemonic);
    } else {
      importMnemonic = mnemonics?.replace(/%20/g, ' ');
      setMnemonic(importMnemonic);
    }
  }

  // Query Exist Account
  const queryAccount = async () => {
    setLoading(true);
    try {
      const { address } = await QueryAccountFromMnemonic(mnemonic);

      setAccount(address);

      const exist = await QueryAccountExist(address);

      if (!exist) {
        setLoading(false);
        return;
      };

      const didData = await QueryDID(address);

      if (didData === null) {
        notification.error({
          key: 'identitynotFound',
          message: intl.formatMessage({
            id: 'error.identity.notFound',
          }),
          duration: null,
        });
        setLoading(false);
        return;
      }

      setDID(didData);
      localStorage.setItem('parami:wallet:account', address);
      localStorage.setItem('parami:wallet:did', didData);

      setStep(2);
      setLoading(false);
      return;
    } catch (e: any) {
      notification.error({
        key: 'identitynotFound',
        message: intl.formatMessage({
          id: 'error.identity.notFound',
        }),
        duration: null,
      });
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    // Init chain
    if (!apiWs) {
      return;
    }
    setLoading(false);

    // RecoveryLink Error
    if (!!hash && !mnemonics) {
      notification.error({
        key: 'recoveryLinkError',
        message: intl.formatMessage({
          id: 'error.identity.incorrectRecoveryLink',
        }),
        duration: null,
      });
      return;
    }

    if (!!hash) {
      queryAccount();
    }
  }, [apiWs, hash, mnemonic]);

  return (
    <Card className={styles.card}>
      <Spin
        size='large'
        tip={intl.formatMessage({
          id: 'common.loading',
        })}
        spinning={loading || !apiWs}
        style={{
          display: 'flex',
          maxHeight: '100%',
        }}
      >
        <img src={'/images/icon/mnemonic.svg'} className={style.topIcon} />
        <Title
          className={style.title}
        >
          {intl.formatMessage({
            id: 'identity.inputMnemonic.title',
          })}
        </Title>
        <p className={style.description}>
          {intl.formatMessage({
            id: 'identity.inputMnemonic.description',
          })}
        </p>
        <Divider />
        <div className={style.field}>
          <Title level={4}>
            {intl.formatMessage({
              id: 'identity.inputMnemonic.inputURL',
            })}
          </Title>
          <Input
            size="large"
            bordered
            onChange={(e) => {
              const inputMnenomics = e.target.value.indexOf(' ') > -1 ? e.target.value : null;
              if (!!inputMnenomics) {
                importMnemonic = inputMnenomics;
                setMnemonic(inputMnenomics);
              }
            }}
            disabled={loading}
            placeholder={'Enter your mnemonic likes apple banana orange...'}
          />
        </div>
        <div className={style.buttons}>
          <Button
            type="primary"
            shape="round"
            size="large"
            className={style.button}
            loading={loading}
            onClick={() => {
              queryAccount();
            }}
          >
            {intl.formatMessage({
              id: 'common.confirm',
            })}
          </Button>
        </div>
      </Spin>
    </Card>
  );
};

export default InputMnemonic;
