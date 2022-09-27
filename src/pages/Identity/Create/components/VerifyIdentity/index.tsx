import React from 'react';
import { useEffect } from 'react';
import { Button, Card, Divider, Input, message, notification, Popconfirm, Spin, Steps, Tag, Typography } from 'antd';
import { useIntl, useModel, history } from 'umi';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import style from '../../../style.less';
import BigModal from '@/components/ParamiModal/BigModal';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { LoginWithAirdrop } from '@/services/parami/HTTP';
import AD3 from '@/components/Token/AD3';
import { BigIntToFloatString, FloatStringToBigInt } from '@/utils/format';
import { formatBalance } from '@polkadot/util';
import type { VoidFn } from '@polkadot/api/types';
import DiscordLoginButton from '@/components/Discord';
import { QueryDID, RegisterDID, GetExistentialDeposit } from '@/services/parami/Identity';
import CustomTelegramLoginButton from '@/components/Telegram/CustomTelegramLoginButton';
import TwitterLoginButton from '@/components/TwitterLoginButton/TwitterLoginButton';

let unsub: VoidFn | null = null;

const VerifyIdentity: React.FC<{
  quickSign: { platform: string; ticket: any } | undefined;
  passphrase: string;
  account: string;
  keystore: string;
  did: string;
  setDID: React.Dispatch<React.SetStateAction<string>>;
}> = ({ passphrase, account, keystore, did, setDID, quickSign }) => {
  const apiWs = useModel('apiWs');
  const { refresh } = useModel('@@initialState');
  const [modalVisable, setModalVisable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(2);
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [ExistentialDeposit, setExistentialDeposit] = useState<string>();

  const intl = useIntl();
  const { Title } = Typography;
  const { Step } = Steps;
  const { TextArea } = Input;

  // Goto redirect page
  const goto = async () => {
    await refresh();
    const redirect = localStorage.getItem('parami:wallet:redirect') || config.page.walletPage;
    localStorage.removeItem('parami:wallet:inProcess');
    localStorage.removeItem('parami:wallet:redirect');
    window.location.href = redirect;
  };

  // Login With Airdrop
  const handleLoginWithAirdrop = async (ticket, platform) => {
    setLoading(true);

    try {
      const { response: Resp, data: Data } = await LoginWithAirdrop({
        ticket: ticket,
        site: platform,
        wallet: account,
      });

      // Network exception
      if (!Resp) {
        notification.error({
          key: 'networkException',
          message: 'Network exception',
          description: 'Unable to connect to airdrop server. Please replace the network environment, refresh and try again, or deposit manually.',
          duration: null,
        });
        return;
      };

      if (Resp?.status === 200) {
        // query did
        let didData = await QueryDID(account);
        if (!!didData) {
          setDID(didData);
          localStorage.setItem('parami:wallet:did', didData);

          notification.success({
            message: 'Airdrop Success',
          });
          setStep(5);
        } else {
          console.log('no did', didData);
          notification.error({
            message: 'No DID'
          });
          setLoading(false);
        }
        return;
      }

      if (Resp?.status === 401) {
        notification.error({
          message: `${Data}`,
          description: `Cannot get your profile picture or username. Please check your ${platform} privacy setting, or verify by making a deposit instead. Click here for details.`,
          duration: null,
          onClick: () => {
            window.open("https://parami.notion.site/Setting-up-Telegram-to-bind-Parami-f2b43b04c87c4467841499b3d5732b99");
          }
        })
        history.push(config.page.createPage);
        setLoading(false);
        return;
      }

      if (Resp?.status === 409) {
        notification.error({
          message: `${Data}`,
          description: `Your ${platform} account has been used. Please try to deposit manually.`,
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
    } catch (e: any) {
      notification.error({
        key: 'unknowError',
        message: e.message,
        duration: null,
      });
      setLoading(false);
      return;
    }
  };

  // Create DID
  const createDID = async () => {
    // Query DID
    try {
      let didData = await QueryDID(account);
      if (!!didData) {
        setDID(didData);
        localStorage.setItem('parami:wallet:did', didData);
      } else {
        const events: any = await RegisterDID(
          passphrase,
          keystore,
        );
        didData = events['did']['Assigned'][0][0];
        setDID(didData);
        localStorage.setItem('parami:wallet:did', didData);
      }
    } catch (e: any) {
      notification.error({
        key: 'unknowError',
        message: e.message || e,
        duration: null,
      });
      return;
    }

    quickSign ? setStep(4) : setStep(5);
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
            key: 'balanceChange',
            message: 'Changes in Balance',
            description: formatBalance(BigInt(`${data.free}`) - BigInt(free), { withUnit: 'AD3' }, 18),
          })
        }
        free = `${data.free}`;
        if (BigInt(`${data.free}`) > FloatStringToBigInt('0', 18)) {
          setBalance(data.free);
        }
      });
    }
  };

  // From Quick Sign
  const airdrop = async (quickSign: { platform: string; ticket: any }) => {
    try {
      await handleLoginWithAirdrop(quickSign.ticket, quickSign.platform);
      if (unsub === null) {
        listenBalance();
      }
    } catch (e: any) {
      notification.error({
        key: 'unknowError',
        message: e.message,
        duration: null,
      });
      return;
    }
  };

  // Compute Existential Deposit
  const getExistentialDeposit = async () => {
    const existentialDeposit = await GetExistentialDeposit();
    setExistentialDeposit(BigIntToFloatString(BigInt(existentialDeposit) + FloatStringToBigInt(`${(0.02 * 1).toString()}`, 18), 18));
  };

  useEffect(() => {
    if (apiWs && account) {
      getExistentialDeposit();
      listenBalance();
    }
  }, [apiWs, account]);

  useEffect(() => {
    if (!!did) {
      goto();
    }
  }, [did]);

  useEffect(() => {
    if (passphrase === '' || account === '' || keystore === '') {
      return;
    }
    if (quickSign) {
      airdrop(quickSign)
      return;
    };
  }, [passphrase, account, keystore, quickSign]);

  useEffect(() => {
    if (!!ExistentialDeposit && balance >= FloatStringToBigInt(ExistentialDeposit, 18)) {
      setStep(3);
      setLoading(true);
      if (unsub !== null) {
        unsub();
      }
      createDID();
    } else if (!!ExistentialDeposit && balance > 0 && balance < FloatStringToBigInt(ExistentialDeposit, 18)) {
      notification.error({
        key: 'balanceNotEnough',
        message: 'Sorry, your credit is running low',
        description: `Please make sure to recharge ${ExistentialDeposit} $AD3 at least`,
        duration: null,
      });
    }
  }, [balance, ExistentialDeposit]);

  return (
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
              <Step title="Create Account" icon={step === 0 ? <LoadingOutlined /> : false} />
              <Step title="Generate Passphrase" icon={step === 1 ? <LoadingOutlined /> : false} />
              <Step title="Deposit" icon={step === 2 ? <LoadingOutlined /> : false} />
              <Step title="Create DID" icon={step === 3 ? <LoadingOutlined /> : false} />
              {quickSign && <Step title="Bind Social Account" icon={step === 4 ? <LoadingOutlined /> : false} />}
              <Step title="Completing" icon={step === 5 ? <LoadingOutlined /> : false} />
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
              id: 'identity.initialDeposit.title',
            })}
          </Title>
          <p className={style.description}>
            {intl.formatMessage({
              id: 'identity.initialDeposit.description',
            }, {
              ad3: (<strong><AD3 value={FloatStringToBigInt(ExistentialDeposit!, 18).toString()} /></strong>)
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
                <TextArea
                  size="small"
                  style={{
                    backgroundColor: '#fff',
                  }}
                  readOnly
                  value={account}
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
          <div className={style.socialButtons}>
            <Divider>
              {intl.formatMessage({
                id: 'identity.beforeStart.faucet',
              })}
            </Divider>
            <TwitterLoginButton></TwitterLoginButton>
            <CustomTelegramLoginButton
              dataOnauth={(response) => {
                response.bot = config.airdropService.telegram.botName;
                handleLoginWithAirdrop(response, 'Telegram');
              }}
              botName={config.airdropService.telegram.botName}
            />
            <DiscordLoginButton
              clientId={config.airdropService.discord.clientId}
              redirectUri={window.location.origin + '/oauth/discord'}
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
    </>
  );
};

export default VerifyIdentity;
