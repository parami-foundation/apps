import React, { useState } from 'react';
import { Card, Typography } from 'antd';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import InputAmount from './InputAmount';
import InputAddress from './InputAddress';
import Confirm from './Confirm';
import SelectAsset from './SelectAsset';

const { Title } = Typography;

const Send: React.FC = () => {
  const [step, setStep] = useState<string>('InputAddress');
  const [number, setNumber] = useState<string>('0');
  const [token, setToken] = useState<any>({});
  const [address, setAddress] = useState<string>();

  const intl = useIntl();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.pageContainer}>
        <Card className={styles.card}>
          <img src={'/images/icon/send.svg'} className={style.topIcon} />
          <Title
            level={2}
            style={{
              fontWeight: 'bold',
            }}
            className={style.title}
          >
            {intl.formatMessage({
              id: 'wallet.send.title',
            })}
          </Title>
          {step === 'InputAmount' && (
            <InputAmount
              setStep={setStep}
              number={number}
              setNumber={setNumber}
              token={token}
              setToken={setToken}
            />
          )}
          {step === 'InputAddress' && (
            <InputAddress
              setStep={setStep}
              address={address}
              setAddress={setAddress}
            />
          )}
          {step === 'Confirm' && (
            <Confirm
              setStep={setStep}
              number={number}
              token={token}
              address={address as string}
            />
          )}

          {step === 'SelectAsset' && <SelectAsset setStep={setStep} setToken={setToken} />}
        </Card>
      </div>
    </div>
  );
};

export default Send;
