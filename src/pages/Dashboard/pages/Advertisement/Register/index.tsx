import { Alert, Button, notification } from 'antd';
import React, { useState } from 'react';
import { useModel, useIntl } from 'umi';
import style from './style.less';
import { FloatStringToBigInt } from '@/utils/format';
import { parseAmount } from '@/utils/common';
import { BecomeAdvertiser } from '@/services/parami/Advertisement';

const Register: React.FC<{
  setIsAdvertisers: React.Dispatch<React.SetStateAction<boolean>>;
  setBecomeModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsAdvertisers, setBecomeModal }) => {
  const { balance } = useModel('dashboard.balance');
  const { dashboard } = useModel('currentUser');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const intl = useIntl();

  const becomeAdvertiser = async () => {
    if (!!dashboard && !!dashboard?.accountMeta) {
      setSubmitLoading(true);
      try {
        await BecomeAdvertiser(parseAmount('1000'), JSON.parse(dashboard?.accountMeta));
        setIsAdvertisers(true);
        setSubmitLoading(false);
        setBecomeModal(false);
      } catch (e: any) {
        notification.error({
          message: e.message,
          duration: null,
        });
        setSubmitLoading(false);
      };
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      })
    }
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
          disabled={balance?.free < FloatStringToBigInt('1000', 18)}
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
