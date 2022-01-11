/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Image, Button, Input } from 'antd';
import { useIntl, history, useModel } from 'umi';
import styles from '../style.less';
import { RightOutlined } from '@ant-design/icons';
import { GetUserBalance } from '@/services/parami/wallet';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';
import Token from '@/components/Token/Token';

const InputAmount: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<string>>;
  number: string;
  setNumber: React.Dispatch<React.SetStateAction<string>>;
  token: any;
  setToken: React.Dispatch<React.SetStateAction<any>>;
  stashUserAddress: string;
}> = ({ setStep, number, setNumber, token, stashUserAddress }) => {
  const apiWs = useModel('apiWs');
  const [submitting, setSubmitting] = useState(false);
  const [freeBalance, setFreeBalance] = useState<string>('0');
  const intl = useIntl();

  const getBalance = async () => {
    if (!Object.keys(token).length) {
      const { freeBalance: _freeBalance }: any = await GetUserBalance(
        stashUserAddress as string,
      );
      setFreeBalance(`${_freeBalance}`);
    } else {
      const { balance }: any = await window.apiWs.query.assets.account(token?.id, stashUserAddress);
      if (!!balance) {
        setFreeBalance(`${balance}`);
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setStep('InputAddress');
  };

  useEffect(() => {
    if (apiWs) {
      getBalance();
    }
  }, [apiWs]);

  return (
    <>
      <Input
        autoFocus
        size="large"
        placeholder="0"
        bordered={false}
        className={`${styles.input} bigInput`}
        onChange={(e) => {
          setNumber(e.target.value);
        }}
        disabled={submitting}
        type="number"
        value={number}
      />
      <Button
        size='large'
        type='primary'
        shape='round'
        onClick={() => {
          setNumber(BigIntToFloatString(freeBalance, 18))
        }}
      >
        {intl.formatMessage({
          id: 'miner.all',
        })}
      </Button>
      <div className={styles.selectAssets} onClick={() => setStep('SelectAsset')}>
        <div className={styles.title}>
          {intl.formatMessage({
            id: 'wallet.send.selectAssets',
          })}
        </div>
        <div className={styles.token}>
          <Image
            className={styles.icon}
            src={token?.icon || "/images/logo-round-core.svg"}
            fallback="/images/logo-round-core.svg"
            preview={false}
          />
          <span className={styles.name}>
            {Object.keys(token).length ? token.token : 'AD3'}
          </span>
          <RightOutlined
            style={{
              color: '#ff5b00',
            }}
          />
        </div>
      </div>
      <div className={styles.availableBalance}>
        <div className={styles.title}>
          {intl.formatMessage({
            id: 'wallet.send.availableBalance',
          })}
        </div>
        <div className={styles.balance}>
          <span className={styles.token}>
            <Token value={freeBalance} symbol={Object.keys(token).length ? token.symbol : 'AD3'} />
          </span>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          block
          type="primary"
          shape="round"
          size="large"
          className={styles.button}
          loading={submitting}
          disabled={FloatStringToBigInt(number, 18) <= BigInt(0) || FloatStringToBigInt(number, 18) > BigInt(freeBalance)}
          onClick={() => handleSubmit()}
        >
          {intl.formatMessage({
            id: 'common.continue',
          })}
        </Button>
        <Button
          block
          type="text"
          shape="round"
          size="large"
          className={styles.button}
          onClick={() => history.goBack()}
        >
          {intl.formatMessage({
            id: 'common.cancel',
          })}
        </Button>
      </div>
    </>
  );
};

export default InputAmount;
