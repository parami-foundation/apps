import { Button, Result } from 'antd';
import React from 'react';
import { useIntl, history } from 'umi';

const UnAccessible: React.FC = () => {
  const intl = useIntl();

  return (
    <Result
      status="403"
      title={intl.formatMessage({
        id: 'error.account.notUser',
      })}
      subTitle={intl.formatMessage({
        id: 'error.unAccessible.subTitle',
      })}
      extra={
        <Button
          type='primary'
          size='large'
          shape='round'
          onClick={() => history.push('/')}
        >
          {intl.formatMessage({
            id: 'common.goHome',
          })}
        </Button>
      }
    />
  )
};

export default UnAccessible;
