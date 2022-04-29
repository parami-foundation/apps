import React, { useState } from 'react';
import { useModel, useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import Skeleton from '@/components/Skeleton';
import { notification, Progress } from 'antd';
import { useEffect } from 'react';
import { GetNFTMetaData } from '@/services/parami/NFT';
import AD3 from '@/components/Token/AD3';
import { deleteComma, BigIntToFloatString } from '@/utils/format';
import { GetAssetInfo } from '@/services/parami/Assets';
import { GetSlotAdOfByAssetID, GetSlotsOf } from '@/services/parami/Advertisement';

const List: React.FC<{
  adItem: any;
}> = ({ adItem }) => {
  const apiWs = useModel('apiWs');
  const [loading, setLoading] = useState<boolean>(false);
  const [assetInfo, setAssetInfo] = useState<any>([]);

  const intl = useIntl();

  const getNftList = async () => {
    if (!apiWs) {
      return;
    };
    setLoading(true);
    try {
      const data: any = [];
      if (!!Object.keys(adItem).length) {
        const slotsRaw = await GetSlotsOf(adItem?.id);
        const slots = slotsRaw.toHuman();
        if (!!slots) {
          for (const slot of slots) {
            const nftInfoRaw = await GetNFTMetaData(slot);
            const nftInfo: any = nftInfoRaw.toHuman();
            const adInfo = await GetSlotAdOfByAssetID(nftInfo?.tokenAssetId);
            const assetRaw = await GetAssetInfo(nftInfo?.tokenAssetId);
            const asset = assetRaw.toHuman();
            data.push({
              ...nftInfo,
              ad: adInfo?.ad,
              budget: adInfo?.budget,
              created: adInfo?.created,
              remain: adInfo?.remain,
              tokens: nftInfo?.tokens,
              asset,
            });
          }
          setAssetInfo(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      };
    } catch (e: any) {
      notification.error({
        message: e.message || e,
        duration: null,
      });
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (apiWs) {
      getNftList();
    }
  }, [apiWs, adItem]);

  return (
    <div className={styles.modalBody}>
      <Skeleton
        loading={!apiWs || loading}
        height={200}
        children={
          !assetInfo.length ? (
            <div className={style.noNFTs}>
              <img
                src={'/images/icon/query.svg'}
                className={style.topImage}
              />
              <div className={style.description}>
                {intl.formatMessage({
                  id: 'dashboard.ads.nfts.empty',
                })}
              </div>
            </div>
          ) : (
            <div className={style.nftsList}>
              {assetInfo.map((item) => (
                <div className={style.nftItem}>
                  <div className={style.card}>
                    <div className={style.cardWrapper}>
                      <div className={style.cardBox}>
                        <div className={style.cardDetail}>
                          <h3 className={style.text}>
                            {item?.asset?.name} ({item?.asset?.symbol}) #{item?.tokenAssetId}
                          </h3>
                          <div className={style.status}>
                            <div className={style.label}>
                              {intl.formatMessage({
                                id: 'dashboard.ads.remain',
                                defaultMessage: 'Remain',
                              })}
                            </div>
                            <div className={style.value}>
                              <AD3 value={deleteComma(item?.remain)} />
                            </div>
                          </div>
                          <div className={style.action}>
                            <Progress
                              percent={
                                Number(BigIntToFloatString(deleteComma(item?.remain), 18)) / Number(BigIntToFloatString(deleteComma(item?.budget), 18))
                              }
                              strokeColor='#ff5b00'
                              className={style.progress}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      />
    </div>
  )
}

export default List;
