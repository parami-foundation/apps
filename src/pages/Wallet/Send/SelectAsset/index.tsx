import { Button, Input, Image } from 'antd';
import React, { useEffect } from 'react';
import { useIntl } from 'umi';
import styles from '../../style.less';
import { useState } from 'react';
import Token from '@/components/Token/Token';
import { TokenType } from '..';

const SelectAsset: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<string>>,
  setToken: React.Dispatch<React.SetStateAction<TokenType | undefined>>,
  tokens: any[]
}> = ({ setStep, setToken, tokens }) => {
  const [keyword, setKeyword] = useState<string>('');
  const [filteredTokens, setFilteredTokens] = useState<any[]>([]);

  const intl = useIntl();

  const handleSelect = async (symbol: any) => {
    setToken(symbol);
    setStep('InputAmount');
  };

  useEffect(() => {
    if (keyword?.length > 0) {
      setFilteredTokens(tokens.filter(token => token.symbol.toLowerCase().includes(keyword.toLowerCase())))
    } else {
      setFilteredTokens(tokens);
    }
  }, [keyword, tokens]);

  return (
    <>
      <div className={styles.searchBar}>
        <Input
          autoFocus
          size="large"
          className={styles.searchInput}
          onChange={(e) => (setKeyword(e.target.value))}
          placeholder={intl.formatMessage({
            id: 'wallet.send.searchAsset',
          })}
        />
      </div>
      <div className={styles.assetsList}>
        <div className={styles.title}>
          <span>
            {intl.formatMessage({
              id: 'wallet.send.name',
            })}
          </span>
          <span>
            {intl.formatMessage({
              id: 'wallet.send.availableBalance',
            })}
          </span>
        </div>
        {
          filteredTokens.map((item: any) => {
            return (
              <div
                className={styles.field}
                key={item.symbol}
                onClick={() => {
                  handleSelect(item)
                }}
              >
                <span className={styles.title}>
                  <Image
                    className={styles.icon}
                    src={item?.icon || "/images/logo-round-core.svg"}
                    fallback='/images/logo-round-core.svg'
                    preview={false}
                  />
                  <span className={styles.name}>
                    {item?.symbol}
                  </span>
                </span>
                <span className={styles.value}>
                  <Token value={item?.balance} symbol={item?.symbol} decimals={item?.decimals} />
                </span>
              </div>
            );
          })
        }
      </div>
      <Button
        block
        type="default"
        shape="round"
        size="large"
        className={styles.button}
        onClick={() => setStep('InputAmount')}
        style={{
          marginTop: 20,
        }}
      >
        {intl.formatMessage({
          id: 'common.cancel',
        })}
      </Button>
    </>
  )
}

export default SelectAsset;