import React, { useEffect, useState } from 'react';
import { Alert, Card, Typography } from 'antd';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import FromQRCode from './Receive/FromQRCode';
import { GetUserBalance } from '@/services/parami/wallet';
import { hexToDid } from '@/utils/common';

const { Title } = Typography;

const Receive: React.FC = () => {
  const [FreeBalance, setFreeBalance] = useState<any>(null);
  const [errorState, setErrorState] = useState<API.Error>({});

  const intl = useIntl();

  const did = hexToDid(localStorage.getItem('did')) as string;
  const stashUserAddress = localStorage.getItem('stashUserAddress') as string;

  const getBalance = async () => {
    try {
      const { freeBalance }: any = await GetUserBalance(
        stashUserAddress as string
      );
      setFreeBalance(`${freeBalance}`);
    } catch (e: any) {
      setErrorState({
        Type: 'chain error',
        Message: e.message,
      });
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  const Message: React.FC<{
    content: string;
  }> = ({ content }) => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.pageContainer}>
          <Card className={styles.card}>
            {errorState.Message && <Message content={errorState.Message} />}
            <img src={'/images/icon/down.svg'} className={style.topIcon} />
            <Title
              level={2}
              style={{
                fontWeight: 'bold',
              }}
              className={style.title}
            >
              {intl.formatMessage({
                id: 'wallet.receive.title',
              })}
            </Title>
            <FromQRCode
              did={did}
              freeBalance={FreeBalance as string}
              stashUserAddress={stashUserAddress}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default Receive;
