import React from 'react';
import { useEffect } from 'react';
import { Button, Card, Divider, Input, message, notification, Tag, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import BigModal from '@/components/ParamiModal/BigModal';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, SyncOutlined } from '@ant-design/icons';
import { ChangeController } from '@/services/parami/wallet';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { Mutex } from 'async-mutex';
import { formatBalance } from '@polkadot/util';
import { FloatStringToBigInt } from '@/utils/format';
import AD3 from '@/components/Token/AD3';

const { Title } = Typography;

const goto = () => {
  setTimeout(() => {
    const redirect = sessionStorage.getItem('redirect');
    window.location.href = redirect || config.page.walletPage;
    sessionStorage.removeItem('redirect');
  }, 10);
};

const RecoverDeposit: React.FC<{
  magicKeystore: string;
  password: string;
  controllerUserAddress: string;
  magicUserAddress: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ magicKeystore, password, controllerUserAddress, magicUserAddress, setStep }) => {
  const apiWs = useModel('apiWs');
  const [modalVisable, setModalVisable] = useState(false);
  const [secModal, setSecModal] = useState(false);
  const [Password, setPassword] = useState('');

  const passwd = password || Password

  const ControllerUserAddress = controllerUserAddress || localStorage.getItem('controllerUserAddress') as string;
  const MagicUserAddress = magicUserAddress || localStorage.getItem('magicUserAddress') as string;

  if (ControllerUserAddress === null) {
    setStep(1);
  }

  const MagicKeystore = magicKeystore || localStorage.getItem('magicKeystore') as string;

  const intl = useIntl();
  const mutex = new Mutex();

  const listenController = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!apiWs) {
          return;
        }
        if (!!magicUserAddress) {
          let free: any;
          await apiWs.query.system.account(magicUserAddress, (info) => {
            const data: any = info.data;
            if (free && free !== `${data.free}`) {
              notification.success({
                message: 'Changes in Magic Balance',
                description: formatBalance(BigInt(`${data.free}`) - BigInt(free), { withUnit: 'AD3' }, 18),
              })
            }
            free = `${data.free}`;
            if (BigInt(`${data.free}`) > FloatStringToBigInt('0', 18)) {
              resolve(data.free);
            }
          });
        }
      } catch (e: any) {
        reject(e);
      }
    });
  }

  const pendingStatus = async () => {
    const release = await mutex.acquire();
    const free: any = await listenController();

    if (BigInt(free) < FloatStringToBigInt('0.0005', 18)) {
      release();
      return;
    }

    try {
      const events: any = await ChangeController(
        passwd,
        MagicKeystore,
        ControllerUserAddress,
      );
      console.log(events)
      const stashUserAddress = events['magic']['Changed'][0][0];
      localStorage.setItem('stashUserAddress', stashUserAddress);
      goto();
      return;
    } catch (e: any) {
      message.error(e.message);
    }
  }

  useEffect(() => {
    if (passwd === '') {
      setSecModal(true);
    }
    if (passwd === '' || controllerUserAddress === '') {
      return;
    }
    pendingStatus();
  }, [passwd, controllerUserAddress]);

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
                  text={MagicUserAddress}
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
              text={MagicUserAddress}
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
                value={MagicUserAddress}
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
            <span className={style.value}><AD3 value={FloatStringToBigInt('0.0005', 18).toString()} /></span>
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
        func={pendingStatus}
      />
    </>
  );
};

export default RecoverDeposit;
