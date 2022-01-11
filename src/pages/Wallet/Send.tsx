/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Alert, Card, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import InputAmount from './Send/InputAmount';
import InputAddress from './Send/InputAddress';
import Confirm from './Send/Confirm';
import SelectAsset from './Send/SelectAsset';
import { GetUserBalance } from '@/services/parami/wallet';

const { Title } = Typography;

const Send: React.FC = () => {
  const apiWs = useModel('apiWs');
  const [step, setStep] = useState<string>('InputAmount');
  const [number, setNumber] = useState<string>('0');
  const [token, setToken] = useState<any>({});
  const [address, setAddress] = useState<string>();
  const [TotalBalance, setTotalBalance] = useState<any>(null);
  const [FreeBalance, setFreeBalance] = useState<any>(null);
  const [Reserved, setReserved] = useState<any>(null);
  const [Nonce, setNonce] = useState<any>(null);
  const [errorState, setErrorState] = useState<API.Error>({});

  const stashUserAddress = localStorage.getItem('stashUserAddress');
  const controllerKeystore = localStorage.getItem('controllerKeystore');



  const intl = useIntl();

  const getBalance = async () => {
    try {
      const { freeBalance, reserved, totalBalance, nonce }: any = await GetUserBalance(
        stashUserAddress as string,
      );
      setFreeBalance(`${freeBalance}`);
      setReserved(`${reserved}`);
      setTotalBalance(`${totalBalance}`);
      setNonce(`${nonce}`);
    } catch (e: any) {
      setErrorState({
        Type: 'chain error',
        Message: e.message,
      });
    }
  };

  useEffect(() => {
    if (apiWs) {
      getBalance();
    }
  }, [apiWs]);

  const Message: React.FC<{
    content: string;
  }> = ({ content }) => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  return (
    <>
      {errorState.Message && <Message content={errorState.Message} />}
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
                stashUserAddress={stashUserAddress as string}
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
                userAddress={stashUserAddress as string}
                keystore={controllerKeystore as string}
              />
            )}

            {step === 'SelectAsset' && <SelectAsset setStep={setStep} setToken={setToken} AD3Balance={FreeBalance} />}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Send;
