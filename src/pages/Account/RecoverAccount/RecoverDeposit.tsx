import React from 'react';
import { useEffect } from 'react';
import { Button, Card, Divider, Input, message, Tag, Typography } from 'antd';
import { useIntl } from 'umi';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import BigModal from '@/components/ParamiModal/BigModal';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, SyncOutlined } from '@ant-design/icons';
import {
  ChangeController,
  GetStableAccount,
  QueryDid,
} from '@/services/parami/wallet';
import SecurityModal from '@/components/ParamiModal/SecurityModal';

const { Title } = Typography;

const goto = () => {
  setTimeout(() => {
    const redirect = sessionStorage.getItem('redirect');
    window.location.href = redirect || config.page.walletPage;
    sessionStorage.removeItem('redirect');
  }, 10);
};

const RecoverDeposit: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>,
  magicKeystore: string,
  oldController: string,
  password: string,
}> = ({ setStep, magicKeystore, oldController, password }) => {
  const [modalVisable, setModalVisable] = useState(false);
  const [secModal, setSecModal] = useState(false);
  const [Password, setPassword] = useState('');

  const controllerUserAddress = localStorage.getItem('controllerUserAddress') as string;
  const magicUserAddress = localStorage.getItem('magicUserAddress') as string;

  if (controllerUserAddress === null) {
    setStep(1);
  }

  const OldController = oldController || localStorage.getItem('oldController') as string;
  const MagicKeystore = magicKeystore || localStorage.getItem('magicKeystore') as string;

  const intl = useIntl();

  const checkPassword = () => {
    if (password == null || !password) {
      setSecModal(true);
      return false;
    }
    return true;
  };

  const fetchChargeStatus = async () => {
    let pass = password;
    if (!password || password == null) {
      pass = Password;
    }

    setTimeout(async () => {
      try {
        await ChangeController(
          pass,
          MagicKeystore,
          controllerUserAddress,
        );

        const existAccounts = await GetStableAccount(OldController);

        localStorage.setItem('stashUserAddress', existAccounts?.stashAccount as string);

        // Query DID
        const didData = await QueryDid(existAccounts?.stashAccount);
        if (didData !== null) {
          localStorage.setItem('did', didData as string);
          localStorage.removeItem('oldController');
          localStorage.removeItem('magicKeystore');

          goto();
          return;
        }
      } catch (e: any) {
        console.log(e.message);
      }
      await fetchChargeStatus();
    }, 2000);
  };

  useEffect(() => {
    if (Password === '') {
      setSecModal(true);
    }
  }, [Password]);

  useEffect(() => {
    const isPassword = checkPassword();
    if (!!isPassword) {
      fetchChargeStatus();
    }
  }, []);

  return (
    <>
      <Card className={styles.card}>
        <img src={'/images/icon/transaction.svg'} className={style.topIcon} />
        <Title
          level={2}
          style={{
            fontWeight: 'bold',
          }}
          className={style.title}
        >
          {intl.formatMessage({
            id: 'account.recoverDeposit.title',
          })}
        </Title>
        <p className={style.description}>
          {intl.formatMessage({
            id: 'account.recoverDeposit.description',
          })}
        </p>
        <Divider />
        <Button
          type="link"
          onClick={() => {
            setModalVisable(true);
          }}
        >
          {intl.formatMessage({
            id: 'account.initialDeposit.whereToBuy',
          })}
        </Button>
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
                  id: 'account.recoverDeposit.magicAddress',
                })}
              </span>
              <span className={style.value}>
                <CopyToClipboard
                  text={magicUserAddress}
                  onCopy={() =>
                    message.success(
                      intl.formatMessage({
                        id: 'common.copied',
                      }),
                    )
                  }
                >
                  <Button type="link" icon={<CopyOutlined />}>
                    {intl.formatMessage({
                      id: 'common.copy',
                    })}
                  </Button>
                </CopyToClipboard>
              </span>
            </div>
            <CopyToClipboard
              text={magicUserAddress}
              onCopy={() =>
                message.success(
                  intl.formatMessage({
                    id: 'common.copied',
                  }),
                )
              }
            >
              <Input
                size="small"
                readOnly
                value={magicUserAddress}
              />
            </CopyToClipboard>
          </div>
          <div className={style.field}>
            <span className={style.title}>
              {intl.formatMessage({
                id: 'account.initialDeposit.status',
              })}
            </span>
            <span className={style.value}>
              <Tag color="processing" icon={<SyncOutlined spin />}>
                {intl.formatMessage({
                  id: 'account.initialDeposit.status.pending',
                })}
              </Tag>
            </span>
          </div>
          <div className={style.field}>
            <span className={style.title}>
              {intl.formatMessage({
                id: 'account.initialDeposit.minCharge',
              })}
            </span>
            <span className={style.value}>2 AD3</span>
          </div>
          <a
            style={{
              textDecoration: 'underline',
              color: 'rgb(114, 114, 122)',
            }}
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = config.page.homePage;
            }}
          >
            {intl.formatMessage({
              id: 'account.restart',
            })}
          </a>
        </div>
      </Card>
      <BigModal
        visable={modalVisable}
        title={intl.formatMessage({
          id: 'account.initialDeposit.buyAD3',
        })}
        content={
          <>
            <div className={style.exchanges}>
              <a href="https://www.binance.com/" target="_blank" rel="noreferrer">
                <img src="/images/exchange/binance-logo.svg" alt="BINANCE" />
              </a>
              <a href="https://www.gate.io/" target="_blank" rel="noreferrer">
                <img src="/images/exchange/gate-io-logo.svg" alt="GATE" />
              </a>
            </div>
          </>
        }
        footer={
          <>
            <Button
              block
              shape='round'
              size='large'
              onClick={() => {
                setModalVisable(false);
              }}
            >
              {intl.formatMessage({
                id: 'common.close',
              })}
            </Button>
          </>
        }
      />
      <SecurityModal
        visable={secModal}
        setVisable={setSecModal}
        password={Password}
        setPassword={setPassword}
        func={fetchChargeStatus}
      />
    </>
  );
};

export default RecoverDeposit;
