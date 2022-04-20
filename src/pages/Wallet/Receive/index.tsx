import React, { useEffect, useState } from 'react';
import { Card, notification, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import FromQRCode from './FromQRCode';
import { GetUserBalance } from '@/services/parami/wallet';
import { hexToDid } from '@/utils/common';

const { Title } = Typography;

const Receive: React.FC = () => {
  const apiWs = useModel('apiWs');
  const { wallet } = useModel('currentUser');
  const [FreeBalance, setFreeBalance] = useState<any>(null);

  const intl = useIntl();

  const did = hexToDid(wallet.did!);

  const getBalance = async () => {
    if (!!wallet && !!wallet.account) {
      try {
        const { freeBalance }: any = await GetUserBalance(wallet?.account);
        setFreeBalance(`${freeBalance}`);
      } catch (e: any) {
        notification.error({
          key: 'unknownError',
          message: e.message || e,
          duration: null,
        });
      }
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      });
    }
  };

  useEffect(() => {
    if (apiWs) {
      getBalance();
    }
  }, [apiWs]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.pageContainer}>
        <Card className={styles.card}>
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
          />
        </Card>
      </div>
    </div>
  );
};

export default Receive;
