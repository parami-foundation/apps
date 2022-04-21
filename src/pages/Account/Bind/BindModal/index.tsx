import MyAvatar from '@/components/Avatar/MyAvatar';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { DecodeKeystoreWithPwd } from '@/services/parami/Crypto';
import { LinkBlockChain, LinkSociality } from '@/services/parami/Linker';
import { solanaSignMessage } from '@/services/solana/solana';
import { signBSCMessage, signETHMessage } from '@/services/walletconnect/walletconnect';
import { hexToDid } from '@/utils/common';
import { base64url } from '@/utils/format';
import { DownOutlined } from '@ant-design/icons';
import Keyring from '@polkadot/keyring';
import { Alert, Button, Divider, Input, message, notification, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useIntl, history, useModel } from 'umi';
import style from '../../style.less';
import { config } from '../config';

const BindModal: React.FC<{
  bindPlatform: string;
  setBindModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ bindPlatform, setBindModal }) => {
  const { wallet } = useModel('currentUser');
  const [secModal, setSecModal] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>(wallet?.passphrase || '');
  const [loading, setLoading] = useState<boolean>(false);
  // SNS
  const [profileURL, setProfileURL] = useState<string>('');
  const [stampMode, setStampMode] = useState<boolean>(false);
  // BlockChain
  const [origin, setOrigin] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [signed, setSigned] = useState<string>('');
  const [app, setApp] = useState<string>('');
  const [collapse, setCollapse] = useState<boolean>(false);

  const intl = useIntl();
  const { TextArea } = Input;

  const handleStamp = async () => {
    if (!!wallet && !!wallet?.keystore) {
      const { query } = history.location;
      const { audience, scope } = query as { audience: string, scope: string | null | undefined };
      const scopes = scope ?? '';
      const sign = scopes.indexOf('sign') > -1;

      let stamp: string = '';

      const timestamp = Date.now() / 1000 | 0;

      const header = JSON.stringify({
        alg: sign ? 'SrDSA' : 'none',
        typ: 'JWT'
      });

      const payload = JSON.stringify({
        iss: window.location.origin,
        sub: wallet?.account,
        aud: audience,
        iat: timestamp,
        exp: timestamp + 30
      });

      const plain = `${base64url(header)}.${base64url(payload)}`;

      if (!sign) {
        stamp = `${plain}.`;
        window.open(`${config?.validator?.paramiCommunity}#stamp=${stamp}&t=${Date.now()}`);
        return;
      }

      const instanceKeyring = new Keyring({ type: 'sr25519' });
      const decodedMnemonic = DecodeKeystoreWithPwd(passphrase, wallet?.keystore);
      if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
        message.error(
          intl.formatMessage({
            id: 'error.passphrase.error',
          })
        );
        return;
      }
      const keypair = instanceKeyring.createFromUri(decodedMnemonic);

      const signature = keypair.sign(plain);
      const ticket = `${plain}.${base64url(signature)}`;

      stamp = ticket;

      window.open(`${config?.validator?.paramiCommunity}#stamp=${stamp}&t=${Date.now()}`);
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      })
    }
  };

  const defaultSNS = async () => {
    if (!!wallet && !!wallet?.did && !!wallet.keystore) {
      if (profileURL === '') {
        message.error(intl.formatMessage({
          id: 'error.sns.emptyInput',
        }));
        return;
      }
      try {
        await LinkSociality(wallet?.did, bindPlatform, profileURL, passphrase, wallet?.keystore);
        setLoading(false);
        setBindModal(false);
      } catch (e: any) {
        notification.error({
          message: intl.formatMessage({
            id: e.message || e,
          }),
        });
        setLoading(false);
        return;
      }
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      })
    }
  };

  const defaultBlockChain = async () => {
    if (!!wallet && !!wallet.keystore) {
      let Signed = signed;
      if (Signed.indexOf('0x') < 0) {
        message.error(intl.formatMessage({
          id: 'error.bind.signWrong',
        }));
        setLoading(false);
        return;
      };
      if (bindPlatform === 'Polkadot' || bindPlatform === 'Solana') {
        Signed = `0x00${signed}`;
      };

      try {
        await LinkBlockChain(bindPlatform, address, Signed, passphrase, wallet?.keystore);
        setBindModal(false);
        setLoading(false);
      } catch (e: any) {
        notification.error({
          message: intl.formatMessage({
            id: e.message || e,
          }),
        });
        setLoading(false);
        return;
      }
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      })
    }
  };

  const handleSubmit = async () => {
    if (!!wallet && !!wallet?.keystore) {
      setLoading(true);
      switch (bindPlatform) {
        // SNS
        case 'Discord':
          await handleStamp();
          setLoading(false);
          setBindModal(false);
          break;
        case 'Telegram':
          if (stampMode) {
            await handleStamp();
            setLoading(false);
            setBindModal(false);
          } else {
            await defaultSNS();
            break;
          }
          break;

        // BlockChain
        case 'Ethereum':
          switch (app) {
            case 'walletconnect':
              try {
                const { account: ethAccount, signedMsg: ethSignedMsg } = await signETHMessage(origin);
                if (!!ethAccount && !!ethSignedMsg) {
                  notification.info({
                    message: 'Got an signed message',
                    description: ethSignedMsg,
                    duration: 2
                  });
                  await LinkBlockChain(bindPlatform, ethAccount, ethSignedMsg, passphrase, wallet?.keystore);
                  setBindModal(false);
                }
                setLoading(false);
              } catch (e: any) {
                notification.error({
                  message: intl.formatMessage({
                    id: e.message || e,
                  }),
                });
                setLoading(false);
              }
              break;
            default:
              await defaultBlockChain();
              break;
          }
          break;
        case 'Binance':
          switch (app) {
            case 'walletconnect':
              try {
                const { account: bscAccount, signedMsg: bscSignedMsg } = await signBSCMessage(origin);
                if (!!bscAccount && !!bscSignedMsg) {
                  notification.info({
                    message: 'Got an signed message',
                    description: bscSignedMsg,
                    duration: 2
                  });
                  await LinkBlockChain(bindPlatform, bscAccount, bscSignedMsg, passphrase, wallet?.keystore);
                  setBindModal(false);
                }
                setLoading(false);
              } catch (e: any) {
                notification.error({
                  message: intl.formatMessage({
                    id: e.message || e,
                  }),
                });
                setLoading(false);
              }
              break;
            default:
              await defaultBlockChain();
              break;
          }
          break;
        case 'Solana':
          switch (app) {
            case 'sollet':
              try {
                const { account, signedMsg }: any = await solanaSignMessage(origin);
                if (!!account && !!signedMsg) {
                  notification.info({
                    message: 'Got an signed message',
                    description: `0x00${signedMsg}`,
                    duration: 2
                  })
                  await LinkBlockChain(bindPlatform, account, `0x00${signedMsg}`, passphrase, wallet?.keystore);
                  setBindModal(false);
                }
                setLoading(false);
              } catch (e: any) {
                notification.error({
                  message: intl.formatMessage({
                    id: e.message || e,
                  }),
                });
                setLoading(false);
              }
              break;
            default:
              await defaultBlockChain();
              break;
          }
      };
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      })
    }
  }

  // BlockChain
  useEffect(() => {
    if (!!wallet && !!wallet?.did) {
      setOrigin(`Link: ${hexToDid(wallet?.did)}`);
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      })
    }
  }, []);

  useEffect(() => {
    if (bindPlatform === 'Ethereum' || bindPlatform === 'Binance' || bindPlatform === 'Polkadot' || bindPlatform === 'Solana' || bindPlatform === 'Tron') {
      setCollapse(true);
    } else {
      setCollapse(false);
    };
  }, [bindPlatform]);

  return (
    <>
      <Spin
        tip={intl.formatMessage({
          id: 'common.submitting',
        })}
        spinning={loading}
      >
        <div className={style.bindModal}>
          {/* SNS */}
          {bindPlatform === 'Telegram' && (
            <>
              <MyAvatar
                width={200}
                height={200}
              />
              <span
                className={style.avatarSaveDesc}
              >
                {intl.formatMessage({
                  id: 'wallet.avatar.saveDesc',
                })}
              </span>
              <Alert
                message={intl.formatMessage({
                  id: 'social.sns.setAvatar.telegram',
                })}
                type="warning"
              />
              <div className={style.field}>
                <div className={style.title}>
                  {intl.formatMessage({
                    id: 'social.sns.username',
                  })}
                </div>
                <div className={style.value}>
                  <Input
                    addonBefore="@"
                    size='large'
                    onChange={(e) => (
                      setProfileURL(`https://t.me/${e.target.value}`)
                    )}
                  />
                </div>
              </div>
              <div className={style.field}>
                <Button
                  block
                  size='large'
                  type='primary'
                  shape='round'
                  onClick={() => { setSecModal(true) }}
                  disabled={!profileURL}
                >
                  {intl.formatMessage({
                    id: 'common.submit',
                  })}
                </Button>
              </div>
            </>
          )}
          {bindPlatform === 'Twitter' && (
            <>
              <MyAvatar
                width={200}
                height={200}
              />
              <span
                className={style.avatarSaveDesc}
              >
                {intl.formatMessage({
                  id: 'wallet.avatar.saveDesc',
                })}
              </span>
              <Alert
                message={intl.formatMessage({
                  id: 'social.sns.setAvatar',
                })}
                type="warning"
              />
              <div className={style.field}>
                <div className={style.title}>
                  {intl.formatMessage({
                    id: 'social.sns.username',
                  })}
                </div>
                <div className={style.value}>
                  <Input
                    addonBefore="@"
                    size='large'
                    onChange={(e) => (
                      setProfileURL(`https://twitter.com/${e.target.value}`)
                    )}
                  />
                </div>
              </div>
              <div className={style.field}>
                <Button
                  block
                  size='large'
                  type='primary'
                  shape='round'
                  onClick={() => {
                    setSecModal(true);
                    setStampMode(false);
                  }}
                  disabled={!profileURL}
                >
                  {intl.formatMessage({
                    id: 'common.submit',
                  })}
                </Button>
              </div>
            </>
          )}
          {bindPlatform === 'Discord' && (
            <>
              <div className={style.field}>
                <Button
                  block
                  size='large'
                  type='primary'
                  shape='round'
                  onClick={() => {
                    setSecModal(true);
                    setStampMode(true);
                  }}
                >
                  Parami Community
                </Button>
              </div>
            </>
          )}

          {/* BlockChain */}
          {(bindPlatform === 'Ethereum' || bindPlatform === 'Binance') && (
            <>
              <Button
                block
                type='primary'
                size='large'
                shape='round'
                className={style.iconButton}
                icon={<img src={'/images/sns/walletconnect-white.svg'} />}
                style={{
                  backgroundColor: '#3B99FC',
                }}
                onClick={() => {
                  setApp('walletconnect');
                  setSecModal(true);
                }}
              >
                {intl.formatMessage({
                  id: 'social.blockchain.walletconnet',
                })}
              </Button>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  setCollapse(!collapse);
                }}
              >
                <Divider>
                  {intl.formatMessage({
                    id: 'social.blockchain.manual',
                  })}
                  <Button
                    type="link"
                    icon={
                      <DownOutlined
                        rotate={!collapse ? 0 : -180}
                        className={style.expandButtonIcon}
                      />
                    }
                    onClick={() => {
                      setCollapse(!collapse);
                    }}
                  />
                </Divider>
              </div>
            </>
          )}
          {bindPlatform === 'Solana' && (
            <>
              <Button
                block
                type='primary'
                size='large'
                shape='round'
                className={style.iconButton}
                icon={<img src={'/images/crypto/solana-sol-logo.svg'} />}
                style={{
                  backgroundColor: '#512da8',
                }}
                onClick={() => {
                  setApp('sollet');
                  setSecModal(true);
                }}
              >
                {intl.formatMessage({
                  id: 'social.blockchain.sollet',
                })}
              </Button>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  setCollapse(!collapse);
                }}
              >
                <Divider>
                  {intl.formatMessage({
                    id: 'social.blockchain.manual',
                  })}
                  <Button
                    type="link"
                    icon={
                      <DownOutlined
                        rotate={!collapse ? 0 : -180}
                        className={style.expandButtonIcon}
                      />
                    }
                    onClick={() => {
                      setCollapse(!collapse);
                    }}
                  />
                </Divider>
              </div>
            </>
          )}
          {(bindPlatform === 'Polkadot' || bindPlatform === 'Tron') && (
            <>
              <Button
                block
                type='primary'
                size='large'
                shape='round'
                className={style.iconButton}
                icon={<img src={'/images/sns/tokenpocket-white.svg'} />}
                style={{
                  backgroundColor: '#2980FE',
                }}
                onClick={() => {
                  setApp('tokenpocket');
                  setSecModal(true);
                }}
              >
                {intl.formatMessage({
                  id: 'social.blockchain.tokenpocket',
                })}
              </Button>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  setCollapse(!collapse);
                }}
              >
                <Divider>
                  {intl.formatMessage({
                    id: 'social.blockchain.manual',
                  })}
                  <Button
                    type="link"
                    icon={
                      <DownOutlined
                        rotate={!collapse ? 0 : -180}
                        className={style.expandButtonIcon}
                      />
                    }
                    onClick={() => {
                      setCollapse(!collapse);
                    }}
                  />
                </Divider>
              </div>
            </>
          )}
          {(bindPlatform === 'Ethereum' || bindPlatform === 'Binance' || bindPlatform === 'Solana' || bindPlatform === 'Polkadot' || bindPlatform === 'Tron') && (
            <div
              className={style.manualContainer}
              style={{
                maxHeight: !collapse ? '100vh' : 0,
              }}
            >
              <div className={style.field}>
                <div className={style.title}>
                  {intl.formatMessage({
                    id: 'social.blockchain.originText',
                  })}
                </div>
                <div className={style.value}>
                  <CopyToClipboard
                    text={origin}
                    onCopy={() => message.success(
                      intl.formatMessage({
                        id: 'common.copied',
                      })
                    )}
                  >
                    <Input
                      readOnly
                      size='large'
                      value={origin}
                    />
                  </CopyToClipboard>
                </div>
              </div>
              <Divider>
                {intl.formatMessage({
                  id: 'social.blockchain.tip',
                })}
              </Divider>
              <div className={style.field}>
                <div className={style.title}>
                  {intl.formatMessage({
                    id: 'social.blockchain.signed',
                  })}
                </div>
                <div className={style.value}>
                  <TextArea
                    size='large'
                    rows={4}
                    value={signed}
                    onChange={(e) => { setSigned(e.target.value) }}
                  />
                </div>
              </div>
              <div className={style.field}>
                <div className={style.title}>
                  {intl.formatMessage({
                    id: 'social.blockchain.address',
                  })}
                </div>
                <div className={style.value}>
                  <Input
                    size='large'
                    onChange={(e) => { setAddress(e.target.value) }}
                  />
                </div>
              </div>
              <div className={style.field}>
                <Button
                  block
                  size='large'
                  type='primary'
                  shape='round'
                  onClick={() => {
                    setPassphrase('');
                    setSecModal(true);
                  }}
                  disabled={!address || !signed}
                >
                  {intl.formatMessage({
                    id: 'common.submit',
                  })}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Spin>
      <SecurityModal
        visable={secModal}
        setVisable={setSecModal}
        passphrase={passphrase}
        setPassphrase={setPassphrase}
        func={handleSubmit}
      />
    </>
  )
}

export default BindModal;
