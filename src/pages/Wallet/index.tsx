import React from 'react';
import { Card } from 'antd';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import Balance from './Balance';
import Record from './Record';
import Tags from './Tags';

const Wallet: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.mainTopContainer}>
      <div className={style.indexContainer}>
        <div className={style.left}>
          <Card
            className={styles.card}
            bodyStyle={{
              padding: 0,
              width: '100%',
            }}
          >
            <div className={styles.tabSelector}>
              <div
                className={styles.tabItem}
              >
                {intl.formatMessage({
                  id: 'wallet.dashboard.balance',
                })}
              </div>
            </div>
            <Balance />
          </Card>
        </div>
        <div className={style.right}>
          <Tags />
          <Record />
        </div>
      </div>
    </div>
  );
};

export default Wallet;
