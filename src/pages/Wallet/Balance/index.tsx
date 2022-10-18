import {
  ArrowDownOutlined,
  InfoCircleOutlined,
  SendOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Button, Divider, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useIntl, history, useModel } from 'umi';
import config from '@/config/config';
import styles from './style.less';
import SmallModal from '@/components/ParamiModal/SmallModal';
import AD3 from '@/components/Token/AD3';
import Assets from '../Assets';

const Balance: React.FC = () => {
  const [tipModal, setTipModal] = useState<boolean>(false);
  const { balance } = useModel('balance');

  const intl = useIntl();

  return (
    <>
      <div className={styles.balanceCard}>
        <div className={styles.totalBalance}>
          <div className={styles.amount}>
            <AD3 value={balance?.total} />
          </div>
          <div className={styles.availableBalance}>
            {intl.formatMessage({
              id: 'wallet.balance.availableBalance',
            })}
            : <AD3 value={balance?.free} />
            <InfoCircleOutlined
              style={{
                marginLeft: 10,
              }}
              onClick={() => { setTipModal(true) }}
            />
          </div>
        </div>
        <div className={styles.buttons}>
          <div
            className={styles.button}
            onClick={() => {
              history.push(config.page.sendPage);
            }}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              size="large"
              className={styles.buttonContent}
            />
            <small>
              {intl.formatMessage({
                id: 'wallet.balance.send',
              })}
            </small>
          </div>
          <div
            className={styles.button}
            onClick={() => {
              history.push(config.page.receivePage);
            }}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<ArrowDownOutlined />}
              size="large"
              className={styles.buttonContent}
            />
            <small>
              {intl.formatMessage({
                id: 'wallet.balance.receive',
              })}
            </small>
          </div>
          <div
            className={styles.button}
            // onClick={() => {
            //   history.push(config.page.buyPage);
            // }}
          >
            <Tooltip title="Coming Soon">
              <Button
                type="primary"
                shape="circle"
                icon={<TagOutlined />}
                size="large"
                disabled
                className={styles.buttonContent}
              />
              <small>
                {intl.formatMessage({
                  id: 'wallet.balance.buy',
                })}
              </small>
            </Tooltip>
          </div>
        </div>
        <Divider />
        <Assets />
      </div>

      <SmallModal
        visable={tipModal}
        content={intl.formatMessage({
          id: 'wallet.balance.availableBalance.tip',
        })}
        footer={
          <Button
            block
            size='large'
            shape='round'
            onClick={() => { setTipModal(false) }}
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

export default Balance;
