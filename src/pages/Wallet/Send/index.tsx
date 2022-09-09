import React, { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import InputAmount from './InputAmount';
import InputAddress from './InputAddress';
import Confirm from './Confirm';
import SelectAsset from './SelectAsset';

const { Title } = Typography;

export type TokenType = {
  icon: string;
  symbol: string;
  balance: string;
  decimals: number;
  assetId: string;
}

const Send: React.FC = () => {
  const [step, setStep] = useState<string>('InputAddress');
  const [number, setNumber] = useState<string>('0');
  const { balance } = useModel('balance');
  const { assetsArr } = useModel('assets');
  const [tokens, setTokens] = useState<TokenType[]>([]);
  const [token, setToken] = useState<TokenType | undefined>();
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    const tokens = [{
      icon: '/images/logo-round-core.svg',
      symbol: 'AD3',
      balance: balance.free,
      decimals: 18,
      assetId: ''
    }];

    assetsArr?.forEach(asset => {
      tokens.push({
        icon: asset.icon,
        symbol: asset.symbol,
        balance: asset.balance,
        decimals: asset.decimals,
        assetId: asset.id
      })
    });

    setTokens(tokens);
    setToken(tokens[0]);
  }, [assetsArr, balance]);

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
              number={number}
              token={token}
              address={address as string}
            />
          )}

          {step === 'SelectAsset' && <SelectAsset setStep={setStep} setToken={setToken} tokens={tokens} />}
        </Card>
      </div>
    </div>
  );
};

export default Send;
