import React from 'react';
import { useEffect } from 'react';
import { Button, Card, Divider, Input, message, notification, Spin, Tag, Typography } from 'antd';
import { useIntl } from 'umi';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import BigModal from '@/components/ParamiModal/BigModal';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import TelegramLoginButton from 'react-telegram-login';
import {
  BatchNicknameAndAvatar,
  CreateDid,
  CreateStableAccount,
} from '@/services/parami/wallet';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { GetAvatar, LinkWithTelegram, LoginWithTelegram } from '@/services/parami/api';
import AD3 from '@/components/Token/AD3';
import generateRoundAvatar from '@/utils/encode';
import { uploadIPFS } from '@/services/parami/ipfs';
import { b64toBlob } from '@/utils/common';
import { Mutex } from 'async-mutex';
import { FloatStringToBigInt } from '@/utils/format';
import { getOrInit } from '@/services/parami/init';
import { formatBalance } from '@polkadot/util';

const { Title } = Typography;

const goto = () => {
  setTimeout(() => {
    const redirect = sessionStorage.getItem('redirect');
    window.location.href = redirect || config.page.walletPage;
    sessionStorage.removeItem('redirect');
  }, 10);
};

const InitialDeposit: React.FC<{
  password: string;
  qsTicket?: any;
  minimal?: boolean;
  magicLink?: string;
  magicUserAddress: string;
  controllerUserAddress: string;
  controllerKeystore: string;
}> = ({ password, qsTicket, minimal, magicLink, magicUserAddress, controllerUserAddress, controllerKeystore }) => {
  const [modalVisable, setModalVisable] = useState<boolean>(false);
  const [secModal, setSecModal] = useState<boolean>(false);
  const [Password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [miniLoading, setMiniLoading] = useState<boolean>(true);

  const intl = useIntl();
  const mutex = new Mutex();

  const handleTelegram = async (response) => {
    setLoading(true);
    try {
      const { response: Resp, data } = await LoginWithTelegram({
        ticket: response,
        site: 'Telegram',
        wallet: controllerUserAddress,
      });

      if (Resp?.status === 200) {
        notification.success({
          message: 'Airdrop Success',
        })
        return data;
      }
      if (Resp?.status === 401) {
        notification.error({
          message: 'Ticket Error',
          description: 'There are some problems with your Telegram. Please try to deposit manually.',
          duration: null,
        })
        setLoading(false);
        return;
      }
      if (Resp?.status === 409) {
        notification.error({
          message: 'Airdroped',
          description: 'Your Telegram account has participated in airdrop. Please try to deposit manually.',
          duration: null,
        })
        setLoading(false);
        return;
      }
      if (Resp?.status === 400) {
        notification.error({
          message: 'Got an error',
          description: 'Something went wrong, please try again latar.',
          duration: null,
        })
        setLoading(false);
        return;
      }
    } catch (e: any) {
      message.error(e.message);
      setLoading(false);
    }
  };

  const minimalSubmit = async (data: any, didData: any) => {
    const { response } = await LinkWithTelegram({
      site: 'Telegram',
      wallet: controllerUserAddress,
    });

    if (response?.status === 204) {
      try {
        if (data?.nickname && data?.avatar) {
          const { data: file } = await GetAvatar(data?.avatar);
          generateRoundAvatar(URL.createObjectURL(file), '', '', didData)
            .then(async (img) => {
              const imgBlob = (img as string).substring(22);
              const res = await uploadIPFS(b64toBlob(imgBlob, 'image/png'));
              await BatchNicknameAndAvatar(data?.nickname, `ipfs://${res.Hash}`, password, controllerKeystore);
            });
        }
      } catch (e: any) {
        message.error(e.message);
      }

      setMiniLoading(false);
    };
  };

  const listenController = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const api = await getOrInit();
        if (!!controllerUserAddress) {
          let free: any;
          await api.query.system.account(controllerUserAddress, (info) => {
            const data: any = info.data;
            if (free && free !== `${data.free}`) {
              notification.success({
                message: 'Changes in Gas Balance',
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

  const pendingStatus = async (airdropData?: any) => {
    const release = await mutex.acquire();
    const free: any = await listenController();

    if (BigInt(free) < FloatStringToBigInt('1', 18)) {
      release();
      return;
    }

    try {
      const events: any = await CreateStableAccount(
        password,
        controllerKeystore,
        magicUserAddress,
        '0.01',
      );
      const stashUserAddress = events['magic']['Created'][0][0];
      localStorage.setItem('stashUserAddress', stashUserAddress);
    } catch (e: any) {
      console.log(e.message);
    }

    try {
      const events: any = await CreateDid(
        controllerUserAddress,
        password,
        controllerKeystore,
      );
      const did = events['did']['Assigned'][0][0];
      localStorage.setItem('did', did);
      if (minimal) {
        await minimalSubmit(airdropData, did);
        return;
      }
      if (qsTicket) {
        await minimalSubmit(airdropData, did);
        goto();
        return;
      }
      goto();
      return;
    } catch (e: any) {
      console.log(e.message);
    }

    release();
  }

  const minimalAirdrop = async () => {
    try {
      const data = await handleTelegram(qsTicket);
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (password === '' || controllerUserAddress === '' || controllerKeystore === '') {
      return;
    }
    if (minimal || qsTicket) {
      minimalAirdrop().then((data) => {
        pendingStatus(data);
      });
      return;
    };
    pendingStatus();
  }, [password, controllerUserAddress, controllerKeystore]);

  return (
    <>
      {minimal ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {miniLoading && (
            <>
              <Spin
                tip={intl.formatMessage({
                  id: 'account.loading.creating',
                })}
                size='large'
                indicator={
                  <LoadingOutlined
                    spin
                  />
                }
                spinning={miniLoading}
              />
              <a
                style={{
                  textDecoration: 'underline',
                  color: 'rgb(114, 114, 122)',
                  marginTop: 20,
                }}
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = window.location.href;
                }}
              >
                {intl.formatMessage({
                  id: 'account.restart',
                })}
              </a>
            </>
          )}
          {!miniLoading && (
            <>
              <p className={style.description}>
                {intl.formatMessage({
                  id: 'account.magicLink.description',
                })}
              </p>
              <Divider />
              <CopyToClipboard
                text={magicLink as string}
                onCopy={() => {
                  message.success(
                    intl.formatMessage({
                      id: 'common.copied',
                    }),
                  )
                }}
              >
                <Input size="large" bordered value={magicLink as string} readOnly />
              </CopyToClipboard>
              <div className={style.buttons}>
                <CopyToClipboard
                  text={magicLink as string}
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
                      id: 'account.magicLink.copyMagicLink',
                    })}
                  </Button>
                </CopyToClipboard>
                <Button
                  block
                  type="primary"
                  shape="round"
                  size="large"
                  className={style.button}
                  onClick={async () => {
                    const messageContent = `${intl.formatMessage({
                      id: 'account.magicLink.sendMessage',
                    }, {
                      link: magicLink,
                    })}`;

                    const shareData = {
                      title: 'Para Metaverse Identity',
                      text: messageContent,
                      url: magicLink
                    };
                    if (navigator.canShare && navigator.canShare(shareData)) {
                      try {
                        await navigator.share(shareData);
                      } catch (e) {
                        console.log(e);
                      }
                    }
                    goto();
                  }}
                >
                  {intl.formatMessage({
                    id: 'common.confirm',
                  })}
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <Spin
            size='large'
            tip={intl.formatMessage({
              id: 'account.loading.creating',
            })}
            indicator={
              <LoadingOutlined
                spin
              />
            }
            spinning={loading}
            className={styles.mainContainer}
          >
            <Card className={styles.card}>
              <img src={'/images/icon/transaction.svg'} className={style.topIcon} />
              <Title
                level={2}
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
                className={style.title}
              >
                {intl.formatMessage({
                  id: 'account.initialDeposit.title',
                })}
              </Title>
              <p className={style.description}>
                {intl.formatMessage({
                  id: 'account.initialDeposit.description',
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
                        id: 'account.initialDeposit.chargeAddress',
                      })}
                    </span>
                    <span className={style.value}>
                      <CopyToClipboard
                        text={controllerUserAddress}
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
                    text={controllerUserAddress}
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
                      style={{
                        backgroundColor: '#fff',
                      }}
                      readOnly
                      value={controllerUserAddress}
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
                  <span className={style.value}><AD3 value={config.const.minimalCharge} /></span>
                </div>
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
              <div className={style.socialButtons}>
                <Divider>
                  {intl.formatMessage({
                    id: 'account.beforeStart.faucet',
                  })}
                </Divider>
                <TelegramLoginButton dataOnauth={handleTelegram} botName="paramiofficialbot" />
              </div>
            </Card>
          </Spin>
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
          />
        </>
      )}
    </>
  );
};

export default InitialDeposit;
