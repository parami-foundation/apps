import React from 'react';
import style from './style.less';
import { useIntl, useModel } from 'umi';
import { Image } from 'antd';
import BigModal from '@/components/ParamiModal/BigModal';

const SelectToken: React.FC<{
  selectModal: boolean;
  setSelectModal: React.Dispatch<React.SetStateAction<boolean>>;
  chain: string;
}> = ({ selectModal, setSelectModal, chain }) => {
  const {
    ChainName,
  } = useModel('web3');

  const intl = useIntl();

  return (
    <BigModal
      title={undefined}
      visable={selectModal}
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
            <div className={style.selectItem}>
              <div className={style.itemInfo}>
                <Image
                  src='/images/crypto/usdt-circle.svg'
                  preview={false}
                  className={style.itemInfoIcon}
                />
                <div className={style.itemNameSymbol}>
                  <div className={style.itemName}>
                    USDT
                  </div>
                  <div className={style.itemSymbol}>
                    Tether USD
                  </div>
                </div>
              </div>
              <div className={style.itemBalance}>
                0
              </div>
            </div>
          </div>
        </div>
      }
      footer={false}
      close={() => {
        setSelectModal(false);
      }}
      bodyStyle={{
        padding: 0,
      }}
    />
  )
}

export default SelectToken;
