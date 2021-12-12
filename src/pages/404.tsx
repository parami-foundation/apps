import { Button, Result } from 'antd';
import React from 'react';
import { useIntl, history } from 'umi';

const NoFoundPage: React.FC = () => {
  const intl = useIntl();

  return (
    <Result
      status="404"
      title="404"
      subTitle={intl.formatMessage({
        id: 'error.notfound.title',
      })}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {intl.formatMessage({
            id: 'common.goHome',
          })}
        </Button>
      }
    />
  )
};

export default NoFoundPage;
