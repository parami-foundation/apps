import React from 'react';
import { Card, Typography } from 'antd';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import Exchange from './Exchange';

const { Title } = Typography;

const Buy: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.pageContainer}>
        <Card className={styles.card}>
          <img
            src={'/images/icon/tag.svg'}
            className={style.topIcon}
          />
          <Title
            level={2}
            style={{
              fontWeight: 'bold',
            }}
            className={style.title}
          >
            {intl.formatMessage({
              id: 'wallet.buy.title',
            })}
          </Title>
          <Exchange />
        </Card>
      </div>
    </div>
  )
}

export default Buy;