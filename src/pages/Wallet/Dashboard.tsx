/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useState } from 'react';
import { Button, Card } from 'antd';
import classNames from 'classnames';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import Balance from './Dashboard/Balance';
import Record from './Dashboard/Record';
import BigModal from '@/components/ParamiModal/BigModal';
import Guide from './Dashboard/Guide';
import Tags from './Dashboard/Tags';
import NFTs from './Dashboard/NFTs';

const Dashboard: React.FC = () => {
  const [tab, setTab] = useState<string>('balance');
  const [guide, setGuide] = useState<boolean>(false);

  const intl = useIntl();

  return (
    <>
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
                <>
                  <NFTs />
                </>
              )}
            </Card>
          </div>
          <div className={style.right}>
            <Tags />
            <Card
              className={style.sideCard}
              bodyStyle={{
                width: '100%',
              }}
            >
              <Record />
            </Card>
          </div>
        </div>
      </div>
      <BigModal
        visable={guide}
        title={intl.formatMessage({
          id: 'wallet.guide.welcome',
        })}
        content={<Guide />}
        close={() => { setGuide(false) }}
        footer={
          <Button
            block
            shape="round"
            size="large"
            className={style.button}
            onClick={() => { setGuide(false) }}
          >
            {intl.formatMessage({
              id: 'common.close',
            })}
          </Button>
        }
      />
    </>
  );
};

export default Dashboard;
