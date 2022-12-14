import { Button, Card, Divider, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, history, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../../../style.less';
import config from '@/config/config';
import DiscordLoginButton from '@/components/Discord/DiscordLoginButton';
import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import CustomTelegramLoginButton from '@/components/Telegram/CustomTelegramLoginButton';
import './QuickSign.less';
import TwitterLoginButton from '@/components/TwitterLoginButton/TwitterLoginButton';
import { parseUrlParams } from '@/utils/url.util';

const QuickSign: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setQuickSign: React.Dispatch<React.SetStateAction<{ platform: string; ticket: any } | undefined>>
}> = ({ setStep, setQuickSign }) => {
  const apiWs = useModel('apiWs');
  const [loading, setLoading] = useState<boolean>(true);

  const intl = useIntl();
  const { Title } = Typography;

  useEffect(() => {
    const params = parseUrlParams();
    if (params.platform) {
      setQuickSign({
        platform: `${params.platform}`,
        ticket: params
      });
      setStep(3);
    }
  }, []);

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
          <TwitterLoginButton></TwitterLoginButton>
          <CustomTelegramLoginButton
            dataOnauth={(response) => {
              response.bot = config.airdropService.telegram.botName;
              handleQuickCreate(response, 'Telegram');
            }}
            botName={config.airdropService.telegram.botName}
          ></CustomTelegramLoginButton>
          <DiscordLoginButton
            clientId={config.airdropService.discord.clientId}
            redirectUri={window.location.origin + '/oauth/discord'}
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
