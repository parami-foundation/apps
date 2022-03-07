import React from 'react';
import { useEffect } from 'react';
import { Button, Card, Divider, Input, message, notification, Spin, Steps, Tag, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
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
  GetExistentialDeposit,
  GetStableAccount,
  QueryDid,
} from '@/services/parami/wallet';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { GetAvatar, LinkWithAirdrop, LoginWithAirdrop } from '@/services/parami/api';
import AD3 from '@/components/Token/AD3';
import generateRoundAvatar from '@/utils/encode';
import { uploadIPFS } from '@/services/parami/ipfs';
import { b64toBlob } from '@/utils/common';
import { BigIntToFloatString, FloatStringToBigInt } from '@/utils/format';
import { formatBalance } from '@polkadot/util';
import type { VoidFn } from '@polkadot/api/types';
import DiscordLoginButton from '@/components/Discord';

const { Title } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

const goto = () => {
  setTimeout(() => {
    const redirect = localStorage.getItem('redirect');
    window.location.href = redirect || config.page.walletPage;
    localStorage.removeItem('redirect');
  }, 10);
};

let unsub: VoidFn | null = null;

const InitialDeposit: React.FC<{
  password: string;
  qsTicket?: any;
  qsPlatform?: string | undefined;
  minimal?: boolean;
  magicLink?: string;
  magicUserAddress: string;
  controllerUserAddress: string;
  controllerKeystore: string;
  setQsTicket: React.Dispatch<any>;
  setQsPlatform: React.Dispatch<React.SetStateAction<string | undefined>>;
}> = ({ password, qsTicket, qsPlatform, minimal, magicLink, magicUserAddress, controllerUserAddress, controllerKeystore, setQsTicket, setQsPlatform }) => {
  const apiWs = useModel('apiWs');
  const [modalVisable, setModalVisable] = useState<boolean>(false);
  const [secModal, setSecModal] = useState<boolean>(false);
  const [Password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [miniLoading, setMiniLoading] = useState<boolean>(true);
  const [airdropData, setAirDropData] = useState<any>(null);
  const [step, setStep] = useState<number>(3);
  const [controllerBalance, setControllerBalance] = useState<bigint>(BigInt(0));
  const [avatarNicknameData, setAvatarNicknameData] = useState<any>();
  const [DID, setDID] = useState<string>();
  const [ExistentialDeposit, setExistentialDeposit] = useState<string>();

  const intl = useIntl();

  const handleQuickCreate = async (response, platform) => {
    setLoading(true);
    setQsPlatform(platform);
    setQsTicket(response);
    try {
      const { response: Resp, data } = await LoginWithAirdrop({
        ticket: response,
        site: platform,
        wallet: controllerUserAddress,
      });

      if (Resp?.status === 200) {
        notification.success({
          message: 'Airdrop Success',
        })
        setAirDropData(data);
        setStep(4);
        return;
      }
      if (Resp?.status === 401) {
        notification.error({
          message: 'Abnormal account',
          description: `No profile picture or username. Please check your ${qsPlatform} privacy setting, or verify by making a deposit instead.`,
          duration: null,
        })
        setLoading(false);
        return;
      }
      if (Resp?.status === 409) {
        notification.error({
          message: 'Airdroped',
          description: `Your ${qsPlatform} account has participated in airdrop. Please try to deposit manually.`,
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
      notification.error({
        message: 'Got an error',
        description: `Unknown: Something went wrong, please try again latar.`,
        duration: null,
      })
      setLoading(false);
      return;
    } catch (e: any) {
      message.error(e.message);
      setLoading(false);
    }
  };

  const minimalSubmit = async (data: any, didData: any) => {
    const { response } = await LinkWithAirdrop({
      site: qsPlatform,
      wallet: controllerUserAddress,
    });

    if (response?.status === 204) {
      try {
        if (data?.nickname && data?.avatar) {
          const { data: file } = await GetAvatar(data?.avatar);
          generateRoundAvatar(URL.createObjectURL(file), '', '', didData)
            .then(async (img) => {
              const imgBlob = (img as string).substring(22);
              try {
                const res = await uploadIPFS(b64toBlob(imgBlob, 'image/png'));
                const events = await BatchNicknameAndAvatar(data?.nickname || 'Airdrop User', `ipfs://${res.Hash}`, password, controllerKeystore);
                setAvatarNicknameData(events);
              } catch (e: any) {
                console.log(e);
                goto();
                localStorage.removeItem('process');
              }
            });
        } else {
          setAvatarNicknameData('Not have nickname or avatar');
        }
        setStep(7);
      } catch (e: any) {
        message.error(e.message);
      }

      setMiniLoading(false);
    };
  };

  const createAccount = async () => {
    let stashUserAddress = localStorage.getItem('stashUserAddress');
    let existAccounts
    if (stashUserAddress === '' || stashUserAddress === null) {
      // Get whether all accounts exist
      existAccounts = await GetStableAccount(controllerUserAddress);
      if (!!existAccounts?.stashAccount) {
        localStorage.setItem('stashUserAddress', existAccounts?.stashAccount as string);
      } else try {
        const events: any = await CreateStableAccount(
          password,
          controllerKeystore,
          magicUserAddress,
          '0.01',
        );
        stashUserAddress = events['magic']['Created'][0][0];
        localStorage.setItem('stashUserAddress', stashUserAddress as string);
      } catch (e: any) {
        console.log(e.message);
        return;
      }
    }
    setStep(5);

    let did = localStorage.getItem('did');
    if (!did || did === '') {
      // Query DID
      const didData = await QueryDid(existAccounts?.stashAccount || stashUserAddress);
      if (!!didData) {
        localStorage.setItem('did', didData as string);
        setDID(didData as string);
      } else try {
        const events: any = await CreateDid(
          controllerUserAddress,
          password,
          controllerKeystore,
        );
        did = events['did']['Assigned'][0][0];
        localStorage.setItem('did', did as string);
        setDID(did as string);
      } catch (e: any) {
        console.log(e.message);
        return;
      }
    }
    setStep(6);

    if (minimal) {
      await minimalSubmit(airdropData, did);
      return;
    }
    if (qsTicket) {
      await minimalSubmit(airdropData, did);
      return;
    }
    setStep(7);
  };

  const listenBalance = async () => {
    if (!apiWs) {
      return;
    }
    if (!!controllerUserAddress) {
      let free: any;
      unsub = await apiWs.query.system.account(controllerUserAddress, (info) => {
        const data: any = info.data;
        if (free && free !== `${data.free}`) {
          notification.success({
            message: 'Changes in Gas Balance',
            description: formatBalance(BigInt(`${data.free}`) - BigInt(free), { withUnit: 'AD3' }, 18),
          })
        }
        free = `${data.free}`;
        console.log('control free', free);
        if (BigInt(`${data.free}`) > FloatStringToBigInt('0', 18)) {
          setControllerBalance(data.free);
        }
      });
    }
  };

  const minimalAirdrop = async () => {
    try {
      await handleQuickCreate(qsTicket, qsPlatform);
      if (unsub === null) {
        listenBalance();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getExistentialDeposit = async () => {
    const existentialDeposit = await GetExistentialDeposit();
    setExistentialDeposit(BigIntToFloatString(BigInt(existentialDeposit) + FloatStringToBigInt(`${(0.02 * 3).toString()}`, 18), 18));
  };

  useEffect(() => {
    if (apiWs && controllerUserAddress) {
      getExistentialDeposit();
      listenBalance();
    }
  }, [apiWs, controllerUserAddress]);

  useEffect(() => {
    if (!!avatarNicknameData && !!qsTicket) {
      goto();
      localStorage.removeItem('process');
      return;
    }
    if (!qsTicket && !!DID) {
      goto();
      localStorage.removeItem('process');
      return;
    }
  }, [avatarNicknameData, qsTicket, DID]);

  useEffect(() => {
    if (password === '' || controllerUserAddress === '' || controllerKeystore === '') {
      return;
    }
    if (minimal || qsTicket) {
      minimalAirdrop()
      return;
    };
  }, [password, controllerUserAddress, controllerKeystore]);

  useEffect(() => {
    if (!!ExistentialDeposit && controllerBalance >= FloatStringToBigInt(ExistentialDeposit, 18)) {
      setLoading(true);
      if (unsub !== null) {
        unsub();
      }
      createAccount();
    } else if (!!ExistentialDeposit && controllerBalance > 0 && controllerBalance < FloatStringToBigInt(ExistentialDeposit, 18)) {
      notification.error({
        message: 'Sorry, your credit is running low',
        description: `Please make sure to recharge ${ExistentialDeposit} $AD3 at least`,
        duration: null,
      });
    }
  }, [controllerBalance, ExistentialDeposit]);

  return (
    <>
      {minimal ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            height: '100vh',
          }}
        >
          {miniLoading && (
            <>
              <Spin
                tip={(
                  <Steps direction="vertical" size="default" current={step} className={style.stepContainer}>
                    <Step title="Magic Account" icon={step === 0 ? <LoadingOutlined /> : false} />
                    <Step title="Weak Password" icon={step === 1 ? <LoadingOutlined /> : false} />
                    <Step title="Controller Account" icon={step === 2 ? <LoadingOutlined /> : false} />
                    <Step title="Deposit" icon={step === 3 ? <LoadingOutlined /> : false} />
                    <Step title="Stash Account" icon={step === 4 ? <LoadingOutlined /> : false} />
                    <Step title="DID" icon={step === 5 ? <LoadingOutlined /> : false} />
                    <Step title="Bind Account" icon={step === 6 ? <LoadingOutlined /> : false} />
                    <Step title="Jump to wallet" icon={step === 7 ? <LoadingOutlined /> : false} />
                  </Steps>
                )}
                size='large'
                indicator={(<></>)}
                spinning={miniLoading}
                style={{
                  background: 'rgba(255,255,255,.7)',
                }}
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
                  id: 'identity.restart',
                })}
              </a>
            </>
          )}
          {!miniLoading && (
            <>
              <Title
                level={2}
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
                className={style.title}
              >
                {intl.formatMessage({
                  id: 'identity.magicLink.lastStep',
                })}
              </Title>
              <p className={style.description}>
                {intl.formatMessage({
                  id: 'identity.magicLink.description',
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
                <TextArea size="large" bordered value={magicLink as string} readOnly />
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
                      id: 'identity.magicLink.copyMagicLink',
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
                      id: 'identity.magicLink.sendMessage',
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
                    localStorage.removeItem('process');
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
          <Card
            className={styles.card}
            bodyStyle={{
              padding: 0,
              width: '100%'
            }}
          >
            <Spin
              size='large'
              tip={(
                <Steps direction="vertical" size="default" current={step} className={style.stepContainer}>
                  <Step title="Magic Account" icon={step === 0 ? <LoadingOutlined /> : false} />
                  <Step title="Weak Password" icon={step === 1 ? <LoadingOutlined /> : false} />
                  <Step title="Controller Account" icon={step === 2 ? <LoadingOutlined /> : false} />
                  <Step title="Deposit" icon={step === 3 ? <LoadingOutlined /> : false} />
                  <Step title="Stash Account" icon={step === 4 ? <LoadingOutlined /> : false} />
                  <Step title="DID" icon={step === 5 ? <LoadingOutlined /> : false} />
                  <Step title="Bind Account" icon={step === 6 ? <LoadingOutlined /> : false} />
                  <Step title="Jump to wallet" icon={step === 7 ? <LoadingOutlined /> : false} />
                </Steps>
              )}
              indicator={(<></>)}
              spinning={loading}
              wrapperClassName={styles.pageContainer}
              style={{
                background: 'rgba(255,255,255,.7)'
              }}
            >
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
                  id: 'identity.initialDeposit.title',
                })}
              </Title>
              <p className={style.description}>
                {intl.formatMessage({
                  id: 'identity.initialDeposit.description',
                }, {
                  ad3: (<strong><AD3 value={FloatStringToBigInt(ExistentialDeposit as string, 18).toString()} /></strong>)
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
                        id: 'identity.initialDeposit.chargeAddress',
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
                    <TextArea
                      size="small"
                      style={{
                        backgroundColor: '#fff',
                      }}
                      readOnly
                      value={controllerUserAddress}
                      autoSize={{ minRows: 1, maxRows: 4 }}
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
                  <span className={style.value}><AD3 value={FloatStringToBigInt(ExistentialDeposit as string, 18).toString()} /></span>
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
                  id: 'identity.restart',
                })}
              </a>
              <div className={style.socialButtons}>
                <Divider>
                  {intl.formatMessage({
                    id: 'identity.beforeStart.faucet',
                  })}
                </Divider>
                <TelegramLoginButton
                  dataOnauth={(response) => { handleQuickCreate(response, 'Telegram') }}
                  botName={config.airdropService.telegram.botName}
                />
                <DiscordLoginButton
                  dataOnauth={(response) => { handleQuickCreate(response, 'Discord') }}
                  clientId={config.airdropService.discord.clientId}
                  redirectUri={config.airdropService.discord.redirectUri}
                />
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
