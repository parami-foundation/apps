import { Button, Card, Divider, Spin, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, history, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../../../style.less';
import config from '@/config/config';
import DiscordLoginButton from '@/components/Discord/DiscordLoginButton';
import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import CustomTelegramLoginButton from '@/components/Telegram/CustomTelegramLoginButton';
import './QuickSign.less';

const MockTicket = JSON.parse('{"ticket":{"id":5573444153,"first_name":"Kai","last_name":"Kang","username":"kaikangeth","photo_url":"https://t.me/i/userpic/320/bfHsri02p76Kp11vrXz90rXYmoZ-z3pF21HNlCBlqZ1wDFOrDPdZ5_5cyhOJ9Gi9.jpg","auth_date":1660645030,"hash":"a53ca48b2bf15de8c05c5f383864cccecf25d46f716abe99225d66dd07a86f6e","bot":"parami_staging_bot"},"site":"Telegram","wallet":"5FniEcA5be4y6AyqygtDHzjc6WXybac8ZKjdq8oY3aAe5Xtb"}').ticket;

const QuickSign: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setQuickSign: React.Dispatch<React.SetStateAction<{ platform: string; ticket: any } | undefined>>
}> = ({ setStep, setQuickSign }) => {
  const apiWs = useModel('apiWs');
  const [loading, setLoading] = useState<boolean>(true);

  const intl = useIntl();
  const { Title } = Typography;

  const handleMockSign = () => {
    setQuickSign({
      platform: 'Telegram',
      ticket: MockTicket
    });
    setStep(3);
  }

  const handleQuickCreate = async (response, platform) => {
    setQuickSign({
      platform,
      ticket: response
    });
    setStep(3);
  };

  useEffect(() => {
    if (apiWs) {
      setLoading(false);
    }
  }, [apiWs]);

  return (
    <Card className={styles.card}>
      <Spin
        size='large'
        tip={intl.formatMessage({
          id: 'common.loading',
        })}
        spinning={loading}
        style={{
          display: 'flex',
          maxHeight: '100%',
        }}
      >
        <img src={'/images/icon/option.svg'} className={style.topIcon} />
        <Title
          className={style.title}
        >
          {intl.formatMessage({
            id: 'identity.quicksign.title',
          })}
        </Title>
        <p className={style.description}>
          {intl.formatMessage({
            id: 'identity.quicksign.description1',
          })}
        </p>
        <p className={style.description}>
          {intl.formatMessage({
            id: 'identity.quicksign.description2',
          })}
        </p>
        <Button
          type='link'
          size='large'
          className={style.link}
          icon={<ArrowRightOutlined />}
          onClick={() => {
            window.open('http://parami.io', '_blank');
          }}
        >
          {intl.formatMessage({
            id: 'identity.quicksign.learnMore',
          })}
        </Button>
        <Divider>
          {intl.formatMessage({
            id: 'identity.beforeStart.faucet',
          })}
        </Divider>
        <Spin
          spinning={!apiWs}
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        >
          <Tooltip title="Comming soon">
            <span className='twitter-login-btn' onClick={handleMockSign}>
              <img
                src="/images/sns/twitter-white.svg"
                className='twitter-icon'
              />
              Create by Twitter
            </span>
          </Tooltip>

          <CustomTelegramLoginButton
            dataOnauth={(response) => {
              response.bot = config.airdropService.telegram.botName;
              handleQuickCreate(response, 'Telegram');
            }}
            botName={config.airdropService.telegram.botName}
          ></CustomTelegramLoginButton>
          <DiscordLoginButton
            dataOauth={(response) => { handleQuickCreate(response, 'Discord') }}
            clientId={config.airdropService.discord.clientId}
            redirectUri={window.location.origin + config.airdropService.discord.redirectUri}
          />
        </Spin>
        <Divider>
          {intl.formatMessage({
            id: 'index.or',
          })}
        </Divider>
        <div className={style.buttons}>
          <Button
            block
            type="primary"
            shape="round"
            size="large"
            className={style.button}
            style={{ maxWidth: '240px' }}
            loading={!apiWs}
            onClick={() => setStep(3)}
          >
            {intl.formatMessage({
              id: 'identity.quicksign.manual',
            })}
          </Button>
          <Button
            block
            type="link"
            size="large"
            onClick={() => history.push(config.page.homePage)}
          >
            {intl.formatMessage({
              id: 'common.cancel',
            })}
          </Button>
          <small
            style={{
              textAlign: 'center',
              marginTop: 20,
              color: 'rgb(114, 114, 122)',
            }}
          >
            {intl.formatMessage({
              id: 'identity.beforeStart.licDesc',
            })}
          </small>
        </div>
      </Spin>
    </Card>
  )
}

export default QuickSign;
