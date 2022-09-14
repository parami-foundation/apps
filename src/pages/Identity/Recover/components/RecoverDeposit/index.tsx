import React from 'react';
import { useEffect } from 'react';
import { Button, Card, Divider, Input, message, notification, Popconfirm, Spin, Steps, Tag, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import style from '../../../style.less';
import BigModal from '@/components/ParamiModal/BigModal';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { formatBalance } from '@polkadot/util';
import { FloatStringToBigInt } from '@/utils/format';
import AD3 from '@/components/Token/AD3';
import type { VoidFn } from '@polkadot/api/types';

const { Title } = Typography;
const { Step } = Steps;

let unsub: VoidFn | null = null;

const RecoverDeposit: React.FC<{
  keystore: string;
  passphrase: string;
  account: string;
}> = ({ keystore, passphrase, account }) => {
  const apiWs = useModel('apiWs');
  const { wallet } = useModel('currentUser');
  const [modalVisable, setModalVisable] = useState(false);
  const [magicBalance, setMagicBalance] = useState<bigint>(BigInt(0));
  const [RecoveryFee, setRecoveryFee] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(2);

  const intl = useIntl();

  const goto = () => {
    setTimeout(() => {
      window.location.href = wallet?.redirect || config.page.walletPage;
      localStorage.removeItem('parami:wallet:redirect');
      localStorage.removeItem('parami:wallet:process');
    }, 10);
  };

  // Listen Balance Change
  const listenBalance = async () => {
    if (!apiWs) {
      return;
    }
    if (!!account) {
      let free: any;
      unsub = await apiWs.query.system.account(account, (info) => {
        const data: any = info.data;
        if (free && free !== `${data.free}`) {
          notification.success({
            key: 'magicBalanceChange',
            message: 'Changes in Magic Balancee',
            description: formatBalance(BigInt(`${data.free}`) - BigInt(free), { withUnit: 'AD3', decimals: 18 }),
          })
        }
        free = `${data.free}`;
        if (BigInt(`${data.free}`) > FloatStringToBigInt('0', 18)) {
          setMagicBalance(data.free);
        }
      });
    }
  };

  // TODO: Move DID

  useEffect(() => {
    if (apiWs && account) {
      listenBalance();
    }
  }, [apiWs, account]);

  useEffect(() => {
    if (!!RecoveryFee && magicBalance >= FloatStringToBigInt(RecoveryFee, 18)) {
      setLoading(true);
      if (unsub !== null) {
        unsub();
      }
    } else if (!!RecoveryFee && magicBalance > 0 && magicBalance < FloatStringToBigInt(RecoveryFee, 18)) {
      notification.error({
        key: 'balanceNotEnough',
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
                    text={account}
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
                text={account}
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
                  value={account}
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
