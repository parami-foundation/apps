import { Badge, Button, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, history, useModel } from 'umi';
import style from './style.less';
import AD3 from '@/components/Token/AD3';
import Token from '@/components/Token/Token';
import Skeleton from '@/components/Skeleton';

const Assets: React.FC = () => {
  const { wallet } = useModel('currentUser');
  const { assetsArr, totalCount, loading, getAssets } = useModel('assetList');
  const intl = useIntl();
  const [assetListCount, setAssetListCount] = useState<number>(10);

  useEffect(() => {
    if (wallet && getAssets) {
      getAssets(wallet.account, assetListCount);
    }
  }, [wallet, assetListCount, getAssets]);

  const jumpKOLPage = async (assetID: string) => {
    history.push(`/ad/?nftId=${assetID}`);
  };

  return (
    <div className={style.assetsList}>
      <Skeleton
        loading={!assetsArr}
        height={70}
        children={
          <>
            {assetsArr && assetsArr.length > 0 && assetsArr.map((item) => {
              return (
                <Badge
                  count={item.isNftToken ? intl.formatMessage({
                    id: 'wallet.assets.earnMore',
                  }) : null}
                  offset={[-20, 0]}
                >
                  <div
                    className={`${style.field} ${item.isNftToken ? style.nftToken : ''}`}
                    onClick={() => {
                      item.isNftToken && jumpKOLPage(item?.id);
                    }}
                  >
                    <div className={style.title}>
                      <span
                        className={style.name}
                      >
                        <Image
                          className={style.icon}
                          src={item?.icon || "/images/logo-round-core.svg"}
                          fallback='/images/logo-round-core.svg'
                          preview={false}
                        />
                        {item?.symbol}
                      </span>
                      <span
                        className={style.price}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'end',
                          justifyContent: 'center',
                          textAlign: 'right',
                        }}
                      >
                        <span
                          style={{
                            marginBottom: item.isNftToken ? 10 : 0,
                          }}
                        >
                          <Token value={item?.balance} symbol={item?.symbol} decimals={item?.decimals} />
                        </span>
                        {item.isNftToken && <small><AD3 value={item?.ad3} /></small>}
                      </span>
                    </div>
                  </div>
                </Badge>
              );
            })
            }
            {
              assetsArr && assetsArr.length > 0 && totalCount && totalCount > assetsArr.length && <>
                {!loading && <>
                  <Button
                    size='large'
                    shape='round'
                    type='primary'
                    onClick={() => {
                      setAssetListCount(assetListCount + 10);
                    }}>Load more</Button>
                </>}

                {loading && <>
                <Skeleton loading height={70} children={null}></Skeleton>
                </>}
              </>
            }
            {!!assetsArr && assetsArr.length === 0 && (
              <div className={style.noAssets}>
                <img
                  src={'/images/icon/query.svg'}
                  className={style.topImage}
                />
                <span>
                  {intl.formatMessage({
                    id: 'wallet.assets.empty',
                  })}
                </span>
              </div>
            )}
          </>
        }
      />
    </div>
  )
}

export default Assets;