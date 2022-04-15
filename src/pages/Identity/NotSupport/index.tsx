import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import { Card, Result, Image } from 'antd';

const userAgent = window.navigator.userAgent.toLowerCase();
const ios = /iphone|ipod|ipad/.test(userAgent);
const android = /android|adr/.test(userAgent);

const NotSupport: React.FC = () => {
  const intl = useIntl();

  return (
    <Card
      className={styles.card}
    >
      <Result
        icon={
          <>
            {ios && (
              <Image
                src="/images/icon/safari_logo.svg"
                preview={false}
                style={{
                  width: 120,
                  height: 120,
                }}
              />
            )}
            {android && (
              <Image
                src="/images/icon/chrome_logo.svg"
                preview={false}
                style={{
                  width: 120,
                  height: 120,
                }}
              />
            )}
          </>
        }
        title="Not Supported"
        subTitle={intl.formatMessage({
          id: 'error.broswer.notSupport'
        })}
      />
    </Card>
  )
}

export default NotSupport;
