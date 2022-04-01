import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Input, notification, Spin, Typography } from 'antd';
import { useIntl, history, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { GetStableAccount, QueryAccountFromMnemonic, QueryDid, QueryStableAccountByMagic } from '@/services/parami/Identity';

const InputLink: React.FC<{
  oldControllerMnemonic: string;
  magicMnemonic: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setOldControllerUserAddress: React.Dispatch<React.SetStateAction<string>>;
  setOldControllerMnemonic: React.Dispatch<React.SetStateAction<string>>;
  setMagicMnemonic: React.Dispatch<React.SetStateAction<string>>;
  setMagicUserAddress: React.Dispatch<React.SetStateAction<string>>;
  setDid: React.Dispatch<React.SetStateAction<string>>;
}> = ({ oldControllerMnemonic, magicMnemonic, setStep, setOldControllerUserAddress, setOldControllerMnemonic, setMagicMnemonic, setMagicUserAddress, setDid }) => {
  const apiWs = useModel('apiWs');
  const [loading, setLoading] = useState<boolean>(true);

  const { Title } = Typography;
  const intl = useIntl();

  const { hash } = history.location;

  let mnemonics = hash?.substring(1).split(';');
  let magicMnemonics = mnemonics[0]?.replace(/%20/g, ' ');
  let controllerMnemonics = mnemonics[1]?.replace(/%20/g, ' ');

  if (!!magicMnemonics) {
    setMagicMnemonic(magicMnemonics);
  };

  if (!!controllerMnemonics) {
    setOldControllerMnemonic(controllerMnemonics);
  };

  // Query Exist Magic Account
  const queryMagicAccount = async () => {
    setLoading(true);
    try {
      const { address } = await QueryAccountFromMnemonic(magicMnemonics || magicMnemonic);

      const oldControllerUserAddress: any = await QueryStableAccountByMagic(
        address,
      );

      setMagicUserAddress(address);

      const stableAccountData = await GetStableAccount(
        oldControllerUserAddress,
      );

      if (!stableAccountData) {
        notification.error({
          message: intl.formatMessage({
            id: 'error.identity.notFound',
          }),
          duration: null,
        });
        setLoading(false);
        return;
      }

      const didData = await QueryDid(stableAccountData?.stashAccount);

      if (didData === null) {
        notification.error({
          message: intl.formatMessage({
            id: 'error.identity.notFound',
          }),
          duration: null,
        });
        setLoading(false);
        return;
      }
      setDid(didData);
      setOldControllerUserAddress(oldControllerUserAddress);
      localStorage.setItem('stashUserAddress', stableAccountData?.stashAccount);
      localStorage.setItem('magicUserAddress', address);
      localStorage.setItem('did', didData);

      setStep(2);
      setLoading(false);
      return;
    } catch (e: any) {
      notification.error({
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
    if (!!hash && !magicMnemonic) {
      notification.error({
        message: intl.formatMessage({
          id: 'error.identity.incorrectRecoveryLink',
        }),
        duration: null,
      });
      return;
    }

    if (!!hash) {
      queryMagicAccount();
    }
  }, [apiWs, hash, magicMnemonic, oldControllerMnemonic]);

  return (
    <>
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
          <div className={style.field}>
            <Title level={4}>
              {intl.formatMessage({
                id: 'identity.selectMode.inputURL',
              })}
            </Title>
            <Input
              size="large"
              bordered
              onChange={(e) => {
                const inputHash = e.target.value.indexOf('#') > -1 ? e.target.value.split('#')[1] : null;
                if (!!inputHash) {
                  mnemonics = inputHash.split(';');
                  magicMnemonics = mnemonics[0]?.replace(/%20/g, ' ');
                  controllerMnemonics = mnemonics[1]?.replace(/%20/g, ' ');
                  setMagicMnemonic(magicMnemonics);
                  if (controllerMnemonics) {
                    setOldControllerMnemonic(controllerMnemonics);
                  };
                }
              }}
              disabled={loading}
              placeholder={`${window.location.origin}/recover/#...`}
            />
          </div>
          <div className={style.buttons}>
            <Button
              type="primary"
              shape="round"
              size="large"
              className={style.button}
              disabled={!magicMnemonic}
              loading={loading}
              onClick={async () => {
                await queryMagicAccount();
              }}
            >
              {intl.formatMessage({
                id: 'common.confirm',
              })}
            </Button>
          </div>
        </Spin>
      </Card>
    </>
  );
};

export default InputLink;
