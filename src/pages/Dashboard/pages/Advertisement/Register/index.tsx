import { Alert, Button, notification } from 'antd';
import React, { useState } from 'react';
import { useModel, useIntl } from 'umi';
import style from './style.less';
import { FloatStringToBigInt } from '@/utils/format';
import { BecomeAdvertiser } from '@/services/parami/dashboard';
import { parseAmount } from '@/utils/common';

const Register: React.FC<{
  setIsAdvertisers: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsAdvertisers }) => {
  const { stash } = useModel('dashboard.balance');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const intl = useIntl();

  const currentAccount = localStorage.getItem('dashboardCurrentAccount') as string;

  const becomeAdvertiser = async () => {
    setSubmitLoading(true);
    try {
      await BecomeAdvertiser(parseAmount('1000'), JSON.parse(currentAccount));
      setIsAdvertisers(true);
      setSubmitLoading(false);
    } catch (e: any) {
      notification.error({
        message: e.message,
        duration: null,
      });
      setSubmitLoading(false);
    };
  };

  return (
    <div className={style.registerContainer}>
      <div className={style.field}>
        <div className={style.tip}>
          <Alert
            message={intl.formatMessage({
              id: 'dashboard.ads.register.description',
            })}
            type="warning"
            showIcon
          />
        </div>
      </div>
      <div className={style.field}>
        <Button
          block
          type='primary'
          size='large'
          shape='round'
          loading={submitLoading}
          disabled={stash?.free < FloatStringToBigInt('1000', 18)}
          onClick={() => {
            becomeAdvertiser();
          }}
        >
          {intl.formatMessage({
            id: 'common.submit',
          })}
        </Button>
      </div>
    </div>
  )
}

export default Register;
