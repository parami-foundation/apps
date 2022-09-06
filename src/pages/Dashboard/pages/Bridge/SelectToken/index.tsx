import React, { useEffect, useState } from 'react';
import style from './style.less';
import { useIntl, useModel } from 'umi';
import { Image } from 'antd';
import BigModal from '@/components/ParamiModal/BigModal';
import Token from '@/components/Token/Token';
import { ChainBridgeToken } from '@/models/chainbridge';
import { getTokenBalanceOnEth, getTokenBalanceOnParami } from '@/services/parami/xAssets';

const defaultTokenIconSrc = "/images/logo-round-core.svg";

const SelectToken: React.FC<{
  chain: string;
  onClose: () => void;
  onSelectToken: (token: ChainBridgeToken) => void;
}> = ({ chain, onClose, onSelectToken }) => {
  const apiWs = useModel('apiWs');
  const {
    Account,
    ChainName,
    Signer,
  } = useModel('web3');
  const { dashboard } = useModel('currentUser');

  const { tokens } = useModel('chainbridge');

  const [tokenBalance, setTokenBalance] = useState<{ [tokenName: string]: string }>({});

  const intl = useIntl();

  const getTokenBalanceMapFromArray = (balances) => {
    return balances.reduce((pre, cur) => {
      return {
        ...pre,
        ...cur
      }
    }, {});
  }

  useEffect(() => {
    if (tokens?.length > 0 && Account && Signer && chain === 'ethereum') {
      Promise.all(tokens.map(async token => {
        const balance = await getTokenBalanceOnEth(token, Signer, Account);
        return {
          [token.name]: balance
        };
      })).then(balances => {
        setTokenBalance(getTokenBalanceMapFromArray(balances));
      });
    }
  }, [tokens, Account, Signer]);

  useEffect(() => {
    if (tokens?.length > 0 && apiWs && dashboard && chain !== 'ethereum') {
      Promise.all(tokens.map(async token => {
        const balance = await getTokenBalanceOnParami(token, dashboard.account);
        return {
          [token.name]: balance.free
        };
      })).then(balances => {
        setTokenBalance(getTokenBalanceMapFromArray(balances));
      });
    }
  }, [tokens, apiWs, dashboard]);

  return (
    <BigModal
      title={undefined}
      visable
      content={
        <div className={style.selectContainer}>
          <div className={style.selectHeader}>
            <div className={style.selectHeaderSectionTitle}>
              {intl.formatMessage({
                id: 'dashboard.bridge.selectToken',
                defaultMessage: 'Select a token from {chain}',
              }, {
                chain: chain === 'ethereum' ? (
                  <div className={style.fromNetwork}>
                    <Image
                      src='/images/crypto/ethereum-eth-logo.svg'
                      preview={false}
                      className={style.fromNetworkIcon}
                    />
                    <span className={style.chainDetailsChainName}>{ChainName}</span>
                  </div>
                ) : (
                  <div className={style.fromNetwork}>
                    <Image
                      src='/images/logo-core-colored-fit-into-round.svg'
                      preview={false}
                      className={style.fromNetworkIcon}
                    />
                    <span className={style.chainDetailsChainName}>Parami chain</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className={style.selectWrapper}>
            <div className={style.tokenListTitle}>
              <span>Name</span>
              <span>Available Balance</span>
            </div>
            {tokens?.length > 0 && <>
              {tokens.map(token => {
                return <>
                  <div
                    className={style.field}
                    key={token.resourceId}
                    onClick={() => onSelectToken(token)}
                  >
                    <span className={style.title}>
                      <Image
                        className={style.icon}
                        src={token.icon ?? defaultTokenIconSrc}
                        preview={false}
                      />
                      <span className={style.name}>
                        {token.name}
                      </span>
                    </span>
                    <span className={style.value}>
                      {/* todo: get balance of token */}
                      <Token value={tokenBalance[token.name] ?? '0'} symbol={token.symbol} />
                    </span>
                  </div>
                </>
              })}
            </>}
          </div>
        </div>
      }
      footer={false}
      close={() => {
        onClose();
      }}
      bodyStyle={{
        padding: 0,
      }}
    />
  )
}

export default SelectToken;
