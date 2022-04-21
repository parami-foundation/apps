import React from 'react';
import { Card, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import FromQRCode from './FromQRCode';
import { hexToDid } from '@/utils/common';

const { Title } = Typography;

const Receive: React.FC = () => {
  const { balance } = useModel('balance');
  const { wallet } = useModel('currentUser');

  const intl = useIntl();

  const did = hexToDid(wallet.did!);

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
            freeBalance={balance?.free}
          />
        </Card>
      </div>
    </div>
  );
};

export default Receive;
