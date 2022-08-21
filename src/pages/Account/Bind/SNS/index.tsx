import React, { useEffect, useState } from 'react';
import { useIntl, useModel, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../../style.less';
import snsStyle from './sns.less';
import { LoadingOutlined } from '@ant-design/icons';
import { Typography, Image, Card, Button, Spin, notification } from 'antd';
import Skeleton from '@/components/Skeleton';
import config from '@/config/config';
import { parseUrlParams } from '@/utils/url.util';
import { BindSocialAccount } from '@/services/parami/HTTP';
import TelegramLoginButton from 'react-telegram-login';

const SNS: React.FC<{
  setBindModal: React.Dispatch<React.SetStateAction<boolean>>;
  setBindPlatform: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setBindModal, setBindPlatform }) => {
  const linkedInfo = useModel('sns');
  const { wallet } = useModel('currentUser');
  const [bindSocial, setBindSocial] = useState<{ platform: string; ticket }>();

  const intl = useIntl();

  const { Title } = Typography;

  const bindTwitter = () => {
    window.location.href = `${config.main.airdropServer}/twitterLogin?state=bind`;
  }

  const bindDiscord = () => {
    const redirectUri = window.location.origin + '/oauth/discord';
    window.location.href = `${config.airdropService.discord.oauthEndpoint}?response_type=token&state=bind&client_id=${config.airdropService.discord.clientId}&scope=identify&redirect_uri=${redirectUri}`
  }

  const handleTelegramResp = (resp) => {
    console.log(resp);
    resp.bot = config.airdropService.telegram.botName;
    setBindSocial({
      platform: 'Telegram',
      ticket: resp
    });
  }

  useEffect(() => {
    const params = parseUrlParams();
    if (params.platform) {
      console.log('[kai] set params');
      setBindSocial({
        platform: params.platform as string,
        ticket: params
      });
    }
  }, []);

  useEffect(() => {
    if (bindSocial?.platform) {
      bindSocialAccount(bindSocial.platform, bindSocial.ticket);
    }
  }, [bindSocial])

  const bindSocialAccount = async (site: string, ticket) => {
    if (wallet.did) {
      notification.info({
        message: `Binding ${site} account...`
      });
      const { response, data } = await BindSocialAccount({ did: wallet.did, site, ticket });

      if (!response) {
        notification.error({
          message: 'Network Error',
          description: 'Please try again later'
        });
        return;
      };

      if (response.status === 204) {
        notification.success({
          message: `Bind ${site} account success!`
        });
        history.push('/profile')
        return;
      }

      notification.error({
        message: `${data}`,
      });
    }

  }

  return (
    <>
      <Title
        level={3}
        className={style.sectionTitle}
      >
        <Image
          src='/images/icon/sns.svg'
          className={style.sectionIcon}
          preview={false}
        />
        {intl.formatMessage({
          id: 'account.sns.title',
        })}
      </Title>
      <Skeleton
        loading={!Object.keys(linkedInfo).length}
        height={400}
        children={
          <div className={style.bind}>
            <Card
              className={`${styles.card} ${style.bindCard}`}
              bodyStyle={{
                padding: 0,
                width: '100%',
              }}
            >
              <div className={style.field}>
                <div className={style.title}>
                  <Image
                    className={style.icon}
                    src="/images/sns/telegram.svg"
                    preview={false}
                  />
                  <span className={style.label}>Telegram</span>
                </div>
                <div className={style.button + (!linkedInfo.Telegram ? ` ${snsStyle.telegramBtnContainer}` : '')}>
                  <Spin
                    indicator={
                      <LoadingOutlined spin />
                    }
                    spinning={!Object.keys(linkedInfo).length}
                  >
                    {!linkedInfo.Telegram && <TelegramLoginButton
                      dataOnauth={handleTelegramResp}
                      botName={config.airdropService.telegram.botName}
                      className={snsStyle.telegramLoginBtn}
                    ></TelegramLoginButton>}

                    <Button
                      disabled={null !== linkedInfo.Telegram}
                      size='large'
                      shape='round'
                      type='primary'
                      className={snsStyle.loginBtnMock}
                    >
                      {!linkedInfo.Telegram &&
                        intl.formatMessage({
                          id: 'social.bind',
                        })
                      }
                      {linkedInfo.Telegram === 'linked' &&
                        intl.formatMessage({
                          id: 'social.binded',
                        })
                      }
                      {linkedInfo.Telegram === 'verifing' &&
                        intl.formatMessage({
                          id: 'social.verifing',
                        })
                      }
                    </Button>
                  </Spin>
                </div>
              </div>
              <div className={style.field}>
                <div className={style.title}>
                  <img className={style.icon} src="/images/sns/discord.svg" />
                  <span className={style.label}>Discord</span>
                </div>
                <div className={style.button}>
                  <Spin
                    indicator={
                      <LoadingOutlined spin />
                    }
                    spinning={!Object.keys(linkedInfo).length}
                  >
                    <Button
                      disabled={null !== linkedInfo.Discord}
                      size='large'
                      shape='round'
                      type='primary'
                      onClick={bindDiscord}
                    >
                      {!linkedInfo.Discord &&
                        intl.formatMessage({
                          id: 'social.bind',
                        })
                      }
                      {linkedInfo.Discord === 'linked' &&
                        intl.formatMessage({
                          id: 'social.binded',
                        })
                      }
                      {linkedInfo.Discord === 'verifing' &&
                        intl.formatMessage({
                          id: 'social.verifing',
                        })
                      }
                    </Button>
                  </Spin>
                </div>
              </div>
              <div className={style.field}>
                <div className={style.title}>
                  <img className={style.icon} src="/images/sns/twitter.svg" />
                  <span className={style.label}>Twitter</span>
                </div>
                <div className={style.button}>
                  <Button
                    disabled={null !== linkedInfo.Twitter}
                    size='large'
                    shape='round'
                    type='primary'
                    onClick={bindTwitter}
                  >
                    {!linkedInfo.Twitter &&
                      intl.formatMessage({
                        id: 'social.bind',
                      })
                    }
                    {linkedInfo.Twitter === 'linked' &&
                      intl.formatMessage({
                        id: 'social.binded',
                      })
                    }
                    {linkedInfo.Twitter === 'verifing' &&
                      intl.formatMessage({
                        id: 'social.verifing',
                      })
                    }
                  </Button>
                </div>
              </div>
              <div className={style.field}>
                <div className={style.title}>
                  <img className={style.icon} src="/images/sns/facebook.svg" />
                  <span className={style.label}>Facebook</span>
                </div>
                <div className={style.button}>
                  <Button
                    disabled
                    size='large'
                    shape='round'
                    type='primary'
                    onClick={() => {
                      setBindModal(true);
                      setBindPlatform('Facebook');
                    }}
                  >
                    {intl.formatMessage({
                      id: 'social.coming',
                    })}
                  </Button>
                </div>
              </div>
              <div className={style.field}>
                <div className={style.title}>
                  <img className={style.icon} src="/images/sns/mastodon.svg" />
                  <span className={style.label}>Mastodon</span>
                </div>
                <div className={style.button}>
                  <Button
                    disabled
                    size='large'
                    shape='round'
                    type='primary'
                    onClick={() => {
                      setBindModal(true);
                      setBindPlatform('Mastodon');
                    }}
                  >
                    {intl.formatMessage({
                      id: 'social.coming',
                    })}
                  </Button>
                </div>
              </div>
              <div className={style.field}>
                <div className={style.title}>
                  <img className={style.icon} src="/images/sns/github.svg" />
                  <span className={style.label}>Github</span>
                </div>
                <div className={style.button}>
                  <Button
                    disabled
                    size='large'
                    shape='round'
                    type='primary'
                    onClick={() => {
                      setBindModal(true);
                      setBindPlatform('Github');
                    }}
                  >
                    {intl.formatMessage({
                      id: 'social.coming',
                    })}
                  </Button>
                </div>
              </div>
              <div className={style.field}>
                <div className={style.title}>
                  <img className={style.icon} src="/images/sns/hacker-news.svg" />
                  <span className={style.label}>Hacker News</span>
                </div>
                <div className={style.button}>
                  <Button
                    disabled
                    size='large'
                    shape='round'
                    type='primary'
                    onClick={() => {
                      setBindModal(true);
                      setBindPlatform('Github');
                    }}
                  >
                    {intl.formatMessage({
                      id: 'social.coming',
                    })}
                  </Button>
                </div>
              </div>
              <div className={style.field}>
                <div className={style.title}>
                  <img className={style.icon} src="/images/sns/reddit.svg" />
                  <span className={style.label}>Reddit</span>
                </div>
                <div className={style.button}>
                  <Button
                    disabled
                    size='large'
                    shape='round'
                    type='primary'
                    onClick={() => {
                      setBindModal(true);
                      setBindPlatform('Reddit');
                    }}
                  >
                    {intl.formatMessage({
                      id: 'social.coming',
                    })}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        }
      />
    </>
  )
}

export default SNS;
