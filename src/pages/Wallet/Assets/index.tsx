import { OwnerDidOfNft } from '@/services/subquery/subquery';
import { Badge, Image } from 'antd';
import React from 'react';
import { useIntl, history, useModel } from 'umi';
import style from './style.less';
import { hexToDid } from '@/utils/common';
import AD3 from '@/components/Token/AD3';
import Token from '@/components/Token/Token';
import Skeleton from '@/components/Skeleton';

const Assets: React.FC = () => {
  const apiWs = useModel('apiWs');
  const { assetsArr } = useModel('assets');

  const intl = useIntl();

  const jumpKOLPage = async (assetID: string) => {
    const res = await OwnerDidOfNft(assetID);
    history.push(`/${hexToDid(res)}`);
  };

  return (
    <div className={style.assetsList}>
      <Skeleton
        loading={!apiWs}
        height={70}
        children={
          <>
            {assetsArr.length === 0 && (
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
            {assetsArr.map((item) => {
              return (
                <Badge
                  count={intl.formatMessage({
                    id: 'wallet.assets.earnMore',
                  })}
                  offset={[-20, 0]}
                >
                  <div
                    className={style.field}
                    onClick={() => {
                      jumpKOLPage(item?.id);
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
                        {item?.token}#{item?.id}
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
                            marginBottom: 10,
                          }}
                        >
                          <Token value={item?.balance} symbol={item?.symbol} />
                        </span>
                        <small><AD3 value={item?.ad3} /></small>
                      </span>
                    </div>
                  </div>
                </Badge>
              );
            })
            }
          </>
        }
      />
    </div>
  )
}

export default Assets;