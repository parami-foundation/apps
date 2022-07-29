import { Button, Input, Image } from 'antd';
import React from 'react';
import { useIntl, useModel } from 'umi';
import styles from '../../style.less';
import { useState } from 'react';
import AD3 from '@/components/Token/AD3';
import Token from '@/components/Token/Token';

const SelectAsset: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<string>>,
  setToken: React.Dispatch<React.SetStateAction<Record<string, number>>>,
}> = ({ setStep, setToken }) => {
  const { balance } = useModel('balance');
  const { assetsArr } = useModel('assets');
  const [keyword, setKeyword] = useState<string>();//TODO: fixit

  const intl = useIntl();

  const handleSelect = async (symbol: any) => {
    setToken(symbol);
    setStep('InputAmount');
  };

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
        <div
          className={styles.field}
          key="ad3"
          onClick={() => handleSelect({})}
        >
          <span className={styles.title}>
            <Image
              className={styles.icon}
              src={"/images/logo-round-core.svg"}
              preview={false}
            />
            <span className={styles.name}>
              AD3
            </span>
          </span>
          <span className={styles.value}>
            <AD3 value={balance.free} />
          </span>
        </div>
        {
          (assetsArr ?? []).map((item: any) => {
            return (
              <div
                className={styles.field}
                key={item?.assetsID}
                onClick={() => {
                  const tmp: Record<string, number> = {};
                  tmp[item.symbol] = item?.id;
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
                    {item?.token}
                  </span>
                </span>
                <span className={styles.value}>
                  <Token value={item?.balance} symbol={item?.symbol} />
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