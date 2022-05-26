import React from 'react';
import style from './style.less';
import { useIntl, useModel } from 'umi';
import { Image } from 'antd';
import BigModal from '@/components/ParamiModal/BigModal';

const SelectToken: React.FC<{
  selectModal: boolean;
  setSelectModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenSelect: React.Dispatch<any>;
}> = ({ selectModal, setSelectModal, setTokenSelect }) => {

  const intl = useIntl();
  const { assetsArr } = useModel('dashboard.assets');

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
            {!!assetsArr && assetsArr.map((asset: any) => (
              <div
                className={style.selectItem}
                onClick={() => {
                  setTokenSelect(asset);
                  setSelectModal(false);
                }}
              >
                <div className={style.itemInfo}>
                  <Image
                    src={asset?.icon}
                    preview={false}
                    className={style.itemInfoIcon}
                  />
                  <div className={style.itemNameSymbol}>
                    <div className={style.itemName}>
                      {asset?.symbol}
                    </div>
                    <div className={style.itemSymbol}>
                      {asset?.token}
                    </div>
                  </div>
                </div>
                <div className={style.itemBalance}>
                  {asset?.balance}
                </div>
              </div>
            ))}
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
