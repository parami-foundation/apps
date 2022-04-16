import React from 'react';
import { useState } from 'react';
import { Card } from 'antd';
import classNames from 'classnames';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import Balance from './Balance';
import Record from './Record';
import Tags from './Tags';
import NFTs from './NFTs';

const Wallet: React.FC = () => {
  const [tab, setTab] = useState<string>('balance');

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
                className={classNames(styles.tabItem, tab === 'balance' ? '' : styles.inactive)}
                onClick={() => setTab('balance')}
              >
                {intl.formatMessage({
                  id: 'wallet.dashboard.balance',
                })}
              </div>
              <div
                className={classNames(
                  styles.tabItem,
                  tab === 'nfts' ? '' : styles.inactive,
                )}
                onClick={() => setTab('nfts')}
              >
                {intl.formatMessage({
                  id: 'wallet.dashboard.nfts',
                })}
              </div>
            </div>
            {tab === 'balance' && (
              <Balance />
            )}
            {tab === 'nfts' && (
              <NFTs />
            )}
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
