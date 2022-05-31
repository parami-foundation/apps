import React, { useState } from 'react';
import { Image } from 'antd';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { useIntl, useModel } from 'umi';
import { Alert, Button, Divider, Input, message, notification } from 'antd';
import { formatBalance } from '@polkadot/util';
import Marquee from 'react-fast-marquee';
import { didToHex, parseAmount } from '@/utils/common';
import { GetNFTMetaData, GetPreferredNFT } from '@/services/parami/NFT';
import { BigIntToFloatString, deleteComma } from '@/utils/format';
import { BidSlot, GetSlotAdOfByAssetID } from '@/services/parami/Advertisement';
import { GetAssetInfo } from '@/services/parami/Assets';
import { DownOutlined } from '@ant-design/icons';
import SelectToken from './SelectToken';

const Bid: React.FC<{
  adItem: any;
  setBidModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ adItem, setBidModal }) => {
  const { dashboard } = useModel('currentUser');
  const [submiting, setSubmiting] = useState<boolean>(false);
  const [did, setDid] = useState<string>();
  const [nftInfo, setNftInfo] = useState<any>({});
  const [currentAd, setCurrentAd] = useState<any>({});
  const [assetId, setAssetId] = useState<string>('');
  const [price, setPrice] = useState<number>();
  const [confirmNFT, setConfirmNFT] = useState<boolean>(false);
  const [selectModal, setSelectModal] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [tokenSelect, setTokenSelect] = useState<any>();

  const intl = useIntl();
  const { Search } = Input;

  const queryDid = async () => {
    const didHexString = didToHex(did!);

    const nftID = await GetPreferredNFT(didHexString);
    if (nftID.isEmpty) {
      notification.error({
        key: 'userNotFound',
        message: intl.formatMessage({
          id: 'error.identity.notFound',
        }),
        duration: null,
      });
      return;
    };
    const nftMetadataRaw = await GetNFTMetaData(nftID.toString());
    const nftMetadata: any = nftMetadataRaw?.toHuman();
    if (nftMetadataRaw.isEmpty || !nftMetadata?.minted) {
      notification.error({
        message: intl.formatMessage({
          id: 'error.nft.notFound',
        }),
        duration: null,
      });
      return;
    };
    const assetDataRaw = await GetAssetInfo(nftMetadata?.tokenAssetId);
    if (assetDataRaw.isEmpty) {
      notification.error({
        message: intl.formatMessage({
          id: 'error.nft.notFound',
        }),
        duration: null,
      });
      return;
    }
    setAssetId(nftID.toString());
    setNftInfo(nftMetadata);
  };

  const getSlotAdOf = async () => {
    try {
      const ad = await GetSlotAdOfByAssetID(assetId);
      if (ad?.ad) {
        setCurrentAd(ad);
      } else {
        setCurrentAd({});
      }
      setConfirmNFT(true);
    } catch (e: any) {
      notification.error({
        message: e.message || e,
        duration: null,
      });
      return;
    }
  };

  const handleSubmit = async () => {
    if (!!dashboard && !!dashboard?.accountMeta) {
      setSubmiting(true);
      try {
        await BidSlot(adItem.id, assetId, parseAmount((price as number).toString()), JSON.parse(dashboard?.accountMeta));
        setBidModal(false);
        setSubmiting(false);
        window.location.reload();
      } catch (e: any) {
        notification.error({
          message: e.message || e,
          duration: null,
        });
        setSubmiting(false);
        return;
      }
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      })
    }
  };

  return (
    <>
      <div className={styles.modalBody}>
        <Divider>Find NFT ID from DID</Divider>
        <div className={styles.field}>
          <div className={styles.title}>
            {intl.formatMessage({
              id: 'dashboard.ads.launch.did',
            })}
          </div>
          <div className={styles.value}>
            <Search
              key={nftInfo?.id}
              size='large'
              className="tag-input"
              enterButton={intl.formatMessage({
                id: 'common.search',
              })}
              onChange={(e) => {
                setDid(e.target.value);
              }}
              onSearch={async () => {
                if (!did) {
                  message.error('Please Input DID');
                  return;
                }
                await queryDid();
              }}
              placeholder={'did:ad3:......'}
              value={did}
            />
          </div>
        </div>
        <Divider />
        <div className={styles.field}>
          <div className={styles.title}>
            {intl.formatMessage({
              id: 'dashboard.ads.launch.nftID',
            })}
          </div>
          <div className={styles.value}>
            <Search
              key={nftInfo?.id}
              size='large'
              className="tag-input"
              enterButton={intl.formatMessage({
                id: 'common.confirm',
              })}
              onChange={(e) => {
                setAssetId(e.target.value);
              }}
              onSearch={async () => {
                if (!assetId) {
                  message.error('Please Input NFT ID');
                  return;
                }
                await getSlotAdOf();
              }}
              value={assetId}
            />
          </div>
        </div>
        {!!Object.keys(currentAd).length && (
          <div className={styles.field}>
            <div className={styles.title}>
              {intl.formatMessage({
                id: 'dashboard.ads.launch.currentPrice',
              })}
            </div>
            <div className={styles.value}>
              <Input
                readOnly
                disabled
                size='large'
                value={`${formatBalance(deleteComma(currentAd?.remain), { withUnit: 'AD3' }, 18)}`}
              />
            </div>
          </div>
        )}
        <div className={styles.field}>
          <div className={styles.title}>
            {intl.formatMessage({
              id: 'dashboard.ads.launch.offer',
            })}
            <br />
            <small>
              {intl.formatMessage({
                id: 'dashboard.ads.launch.offer.tip',
              })}
            </small>
          </div>
          <div className={styles.value}>
            <Input
              value={price}
              className={styles.withAfterInput}
              placeholder={!!Object.keys(currentAd).length ? (Number(BigIntToFloatString(deleteComma(currentAd?.remain), 18)) * 1.2).toString() : ''}
              size='large'
              type='number'
              min={!!Object.keys(currentAd).length ? Number(BigIntToFloatString(deleteComma(currentAd?.remain), 18)) * 1.2 : 0}
              onChange={(e) => {
                setPrice(Number(e.target.value));
              }}
            />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            {intl.formatMessage({
              id: 'dashboard.ads.launch.token',
            })}
            <br />
            <small>
              {intl.formatMessage({
                id: 'dashboard.ads.launch.token.tip',
              })}
            </small>
          </div>
          <div className={styles.value}>
            <div className={style.tokenAndAmountDetails}>
              <div
                className={style.tokenDetails}
                onClick={() => {
                  setSelectModal(true);
                }}
              >
                <Image
                  src='/images/logo-round-core.svg'
                  preview={false}
                  className={style.chainIcon}
                />
                <span className={style.tokenDetailsTokenName}>AD3</span>
                <DownOutlined className={style.tokenDetailsArrow} />
              </div>
              <div className={style.amountDetails}>
                <Input
                  placeholder='0.00'
                  type='number'
                  size='large'
                  value={tokenAmount}
                  onChange={(e) => {
                    setTokenAmount(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.field}>
          <Alert
            banner
            message={
              <Marquee pauseOnHover gradient={false}>
                {intl.formatMessage({
                  id: 'dashboard.ads.launch.tip',
                })}
              </Marquee>
            }
          />
        </div>
        {confirmNFT && (
          <div className={styles.field}>
            <Button
              block
              type="primary"
              shape="round"
              size="large"
              className={styles.button}
              loading={submiting}
              onClick={() => {
                handleSubmit();
              }}
            >
              {intl.formatMessage({
                id: 'common.submit',
              })}
            </Button>
          </div>
        )}
      </div>

      <SelectToken
        selectModal={selectModal}
        setSelectModal={setSelectModal}
        setTokenSelect={setTokenSelect}
      />
    </>
  )
}

export default Bid;
