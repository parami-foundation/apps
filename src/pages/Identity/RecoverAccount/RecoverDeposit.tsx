import React from 'react';
import { useEffect } from 'react';
import { Button, Card, Divider, Input, message, notification, Popconfirm, Spin, Steps, Tag, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import BigModal from '@/components/ParamiModal/BigModal';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { formatBalance } from '@polkadot/util';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';
import AD3 from '@/components/Token/AD3';
import type { VoidFn } from '@polkadot/api/types';
import { ChangeController, GetRecoveryFee, GetStableAccount } from '@/services/parami/Identity';

const { Title } = Typography;
const { Step } = Steps;

const goto = () => {
  setTimeout(() => {
    const redirect = localStorage.getItem('redirect');
    window.location.href = redirect || config.page.walletPage;
    localStorage.removeItem('redirect');
    localStorage.removeItem('process');
  }, 10);
};

let unsub: VoidFn | null = null;

const RecoverDeposit: React.FC<{
  magicKeystore: string;
  password: string;
  controllerUserAddress: string;
  magicUserAddress: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ magicKeystore, password, controllerUserAddress, magicUserAddress }) => {
  const apiWs = useModel('apiWs');
  const [modalVisable, setModalVisable] = useState(false);
  const [magicBalance, setMagicBalance] = useState<bigint>(BigInt(0));
  const [RecoveryFee, setRecoveryFee] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(2);

  const intl = useIntl();

  // Listen Balance Change
  const listenBalance = async () => {
    if (!apiWs) {
      return;
    }
    if (!!magicUserAddress) {
      let free: any;
      unsub = await apiWs.query.system.account(magicUserAddress, (info) => {
        const data: any = info.data;
        if (free && free !== `${data.free}`) {
          notification.success({
            message: 'Changes in Magic Balancee',
            description: formatBalance(BigInt(`${data.free}`) - BigInt(free), { withUnit: 'AD3' }, 18),
          })
        }
        free = `${data.free}`;
        if (BigInt(`${data.free}`) > FloatStringToBigInt('0', 18)) {
          setMagicBalance(data.free);
        }
      });
    }
  }

  // Change Controller
  const changeController = async () => {
    setStep(3);
    // Change Controller process
    let stashUserAddress = localStorage.getItem('stashUserAddress') as string;
    // Get whether all accounts exist
    const existAccounts = await GetStableAccount(controllerUserAddress);
    console.log(existAccounts)
    if (!!existAccounts?.stashAccount) {
      stashUserAddress = existAccounts?.stashAccount;
      localStorage.setItem('stashUserAddress', existAccounts?.stashAccount);
      localStorage.removeItem('magicKeystore');
      setStep(4);
      goto();
      return;
    } else try {
      const events: any = await ChangeController(
        password,
        magicKeystore,
        controllerUserAddress,
      );
      stashUserAddress = events['magic']['Changed'][0][0];
      localStorage.setItem('stashUserAddress', stashUserAddress);
      localStorage.removeItem('magicKeystore');
      setStep(4);
      goto();
      return;
    } catch (e: any) {
      notification.error({
        message: e.message,
        duration: null,
      });
      return;
    }
  };

  // Get Recovery Fee
  const getRecoveryFee = async () => {
    const fee = await GetRecoveryFee(magicUserAddress, controllerUserAddress);
    setRecoveryFee(BigIntToFloatString(BigInt(fee), 18));
  };

  useEffect(() => {
    if (apiWs && magicUserAddress) {
      getRecoveryFee();
      listenBalance();
    }
  }, [apiWs, magicUserAddress]);

  useEffect(() => {
    if (!!RecoveryFee && magicBalance >= FloatStringToBigInt(RecoveryFee, 18)) {
      setLoading(true);
      if (unsub !== null) {
        unsub();
      }
      changeController();
    } else if (!!RecoveryFee && magicBalance > 0 && magicBalance < FloatStringToBigInt(RecoveryFee, 18)) {
      notification.error({
        message: 'Sorry, your credit is running low',
        description: `Please make sure to recharge ${RecoveryFee} $AD3 at least`,
        duration: null,
      });
    }
  }, [magicBalance, RecoveryFee]);

  return (
    <>
      <Card className={styles.card}>
        <Spin
          size='large'
          tip={(
            <Steps direction="vertical" size="default" current={step} className={style.stepContainer}>
              <Step title="Weak Password" icon={step === 1 ? <LoadingOutlined /> : false} />
              <Step title="Deposit" icon={step === 2 ? <LoadingOutlined /> : false} />
              <Step title="Controller Account" icon={step === 3 ? <LoadingOutlined /> : false} />
              <Step title="Jump to wallet" icon={step === 4 ? <LoadingOutlined /> : false} />
            </Steps>
          )}
          indicator={(<></>)}
          spinning={loading}
          wrapperClassName={styles.pageContainer}
          style={{
            background: 'rgba(255,255,255,.7)',
            padding: 30,
          }}
        >
          <img src={'/images/icon/transaction.svg'} className={style.topIcon} />
          <Title
            className={style.title}
          >
            {intl.formatMessage({
              id: 'identity.recoverDeposit.title',
            })}
          </Title>
          <p className={style.description}>
            {intl.formatMessage({
              id: 'identity.recoverDeposit.description',
            }, {
              ad3: (<strong><AD3 value={FloatStringToBigInt(RecoveryFee as string, 18).toString()} /></strong>)
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
              id: 'identity.initialDeposit.whereToBuy',
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
                    id: 'identity.recoverDeposit.magicUserAddress',
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
                  id: 'identity.initialDeposit.status',
                })}
              </span>
              <span className={style.value}>
                <Tag color="processing" icon={<SyncOutlined spin />}>
                  {intl.formatMessage({
                    id: 'identity.initialDeposit.status.pending',
                  })}
                </Tag>
              </span>
            </div>
            <div className={style.field}>
              <span className={style.title}>
                {intl.formatMessage({
                  id: 'identity.initialDeposit.minCharge',
                })}
              </span>
              <span className={style.value}><AD3 value={FloatStringToBigInt(RecoveryFee as string, 18).toString()} /></span>
            </div>
            <Popconfirm
              placement="top"
              title={intl.formatMessage({
                id: 'identity.recreate.description',
              })}
              onConfirm={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = config.page.homePage;
              }}
              okText="Yes"
              cancelText="No"
            >
              <a
                style={{
                  textDecoration: 'underline',
                  color: 'rgb(114, 114, 122)',
                }}
              >
                {intl.formatMessage({
                  id: 'identity.recreate',
                })}
              </a>
            </Popconfirm>
          </div>
        </Spin>
      </Card>
      <BigModal
        visable={modalVisable}
        title={intl.formatMessage({
          id: 'identity.initialDeposit.buyAD3',
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
    </>
  );
};

export default RecoverDeposit;
