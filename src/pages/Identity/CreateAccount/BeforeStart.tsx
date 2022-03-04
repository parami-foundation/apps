import React from 'react';
import { Button, Card, Divider, Typography } from 'antd';
import { useIntl, history } from 'umi';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { useEffect } from 'react';

const { Title } = Typography;

const BeforeStart: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>;
  minimal?: boolean;
}> = ({ setStep, minimal }) => {
  const intl = useIntl();

  const { query } = history.location;
  const { iab } = query as { iab: string | null | undefined };

  const handleMessage = (event: MessageEvent) => {
    setStep(event?.data);
  };

  const onClick = () => {
    window.open(`${window.location.href}?iab=true`, 'iabCheck');
    window.addEventListener('message', handleMessage, { once: true });
  }

  useEffect(() => {
    if (iab && history.length > 1) {
      window.opener.postMessage(-1);
      alert(window.history.length)
      window.close();
      return;
    }
    if (iab && history.length < 2) {
      window.opener.postMessage(1);
      alert(window.history.length)
      window.close();
      return;
    }
  }, []);

  return (
    <>
      {!minimal ? (
        <Card className={styles.card}>
          <img src={'/images/icon/tip.svg'} className={style.topIcon} />
          <Title
            level={2}
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
            }}
            className={style.title}
          >
            {intl.formatMessage({
              id: 'identity.beforeStart.title',
            })}
          </Title>
          <p className={style.description}>
            {intl.formatMessage({
              id: 'identity.beforeStart.description',
            })}
          </p>
          <Divider />
          <div className={style.buttons}>
            <Button
              block
              type="primary"
              shape="round"
              size="large"
              className={style.button}
              onClick={() => { onClick() }}
            >
              {intl.formatMessage({
                id: 'identity.beforeStart.agree',
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
        </Card>
      ) : (
        <>
          <div className={style.buttons}>
            <Button
              block
              type="primary"
              shape="round"
              size="large"
              className={style.button}
              onClick={() => { onClick() }}
            >
              {intl.formatMessage({
                id: 'identity.beforeStart.agree',
              })}
            </Button>
          </div>
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
        </>
      )}
    </>
  );
};

export default BeforeStart;
