import React from 'react';
import style from './style.less';
import { useIntl } from 'umi';
import { Image } from 'antd';
import BigModal from '@/components/ParamiModal/BigModal';

const SelectToken: React.FC<{
  selectModal: boolean;
  setSelectModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ selectModal, setSelectModal }) => {

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
                id: 'dashboard.ads.selectToken',
                defaultMessage: 'Select a token',
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
