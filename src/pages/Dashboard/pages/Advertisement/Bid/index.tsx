import React, { useEffect, useState } from 'react';
import { Image } from 'antd';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { useIntl, useModel } from 'umi';
import { Alert, Button, Divider, Input, notification } from 'antd';
import { formatBalance } from '@polkadot/util';
import Marquee from 'react-fast-marquee';
import { didToHex, parseAmount } from '@/utils/common';
import { GetNFTMetaData, GetPreferredNFT } from '@/services/parami/NFT';
import { BigIntToFloatString, deleteComma } from '@/utils/format';
import { BidSlot, GetSlotOfNft } from '@/services/parami/Advertisement';
import { GetAssetInfo, GetBalanceOfBudgetPot } from '@/services/parami/Assets';
import { DownOutlined } from '@ant-design/icons';
import SelectToken from './SelectToken';
import FormErrorMsg from '@/components/FormErrorMsg';
import FormFieldTitle from '@/components/FormFieldTitle';

const Bid: React.FC<{
  adItem: any;
  setBidModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ adItem, setBidModal }) => {
  const { dashboard } = useModel('currentUser');
  const [submiting, setSubmiting] = useState<boolean>(false);
  const [did, setDid] = useState<string>();
  const [didErrorMsg, setDidErrorMsg] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [nftId, setNftId] = useState<string>('');
  const [nftIdErrorMsg, setNftIdErrorMsg] = useState<string>('');
  const [price, setPrice] = useState<number>();
  const [priceErrorMsg, setPriceErrorMsg] = useState<string>();
  const [selectModal, setSelectModal] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [tokenSelect, setTokenSelect] = useState<any>();

  const intl = useIntl();

  const minPrice = Math.max(Number(BigIntToFloatString(deleteComma(currentPrice), 18)) * 1.2, 1);

  const handleSubmit = async () => {
    if (!!dashboard && !!dashboard?.accountMeta) {
      setSubmiting(true);
      try {
        await BidSlot(adItem.id, nftId, parseAmount((price as number).toString()), tokenSelect, parseAmount(tokenAmount), JSON.parse(dashboard?.accountMeta));
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

  useEffect(() => {
    const queryDid = async () => {
      const didHexString = didToHex(did!);
      const nftID = await GetPreferredNFT(didHexString);
      if (nftID.isEmpty) {
        setDidErrorMsg(intl.formatMessage({
          id: 'error.identity.notFound',
        }));
        setNftId('');
        return;
      };
      setNftId(nftID.toString());
    };

    setDidErrorMsg('');
    if (did) {
      queryDid().catch(e => {
        notification.error({
          message: e.message || e,
          duration: null,
        });
      });
    }
  }, [did])

  useEffect(() => {
    const getCurrentPrice = async () => {
      const nftMetadataRaw = await GetNFTMetaData(nftId);
      const nftMetadata: any = nftMetadataRaw?.toHuman();
      if (nftMetadataRaw.isEmpty || !nftMetadata?.minted) {
        return;
      };
      const assetDataRaw = await GetAssetInfo(nftMetadata?.tokenAssetId);
      if (assetDataRaw.isEmpty) {
        return;
      }

      const slot = await GetSlotOfNft(nftId);
      if (!slot) {
        return '0';
      }
      const balance = await GetBalanceOfBudgetPot(slot.budgetPot, slot.fractionId);
      if (!balance) {
        return;
      }

      return balance.balance;
    }
    
    setDidErrorMsg('');
    setCurrentPrice('');
    if (nftId) {
      getCurrentPrice().then(price => {
        if (price === undefined) {
          setNftIdErrorMsg(intl.formatMessage({
            id: 'error.nft.invalid',
          }));
          return;
        }
        setNftIdErrorMsg('');
        setCurrentPrice(price);
      }).catch((e) => {
        notification.error({
          message: e.message || e,
          duration: null,
        });
      });
    }
  }, [nftId]);

  useEffect(() => {
    setPriceErrorMsg('');
    if (price !== undefined && price < minPrice) {
      setPriceErrorMsg('price too low');
    }

    // todo: validate max amount
  }, [price]);

  return (
    <>
      <div className={styles.modalBody}>
        <Divider>Find NFT ID from DID</Divider>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={intl.formatMessage({
              id: 'dashboard.ads.launch.did',
            })} required />
          </div>
          <div className={styles.value}>
            <Input
              size='large'
              className={`${didErrorMsg ? style.inputError : ''}`}
              onChange={(e) => {
                setDid(e.target.value);
              }}
              placeholder={'did:ad3:......'}
              value={did}
            />
            {didErrorMsg && <FormErrorMsg msg={didErrorMsg} />}
          </div>
        </div>
        <Divider />
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={intl.formatMessage({
              id: 'dashboard.ads.launch.nftID',
            })} required />
          </div>
          <div className={styles.value}>
            <Input
              size='large'
              className={`${nftIdErrorMsg ? style.inputError : ''}`}
              onChange={(e) => {
                setNftId(e.target.value);
              }}
              value={nftId}
            />
            {nftIdErrorMsg && <FormErrorMsg msg={nftIdErrorMsg} />}
          </div>
        </div>
        {!!currentPrice.length && (
          <div className={styles.field}>
            <div className={styles.title}>
              <FormFieldTitle title={intl.formatMessage({
                id: 'dashboard.ads.launch.currentPrice',
              })} required />
            </div>
            <div className={styles.value}>
              <Input
                readOnly
                disabled
                size='large'
                value={`${formatBalance(deleteComma(currentPrice), { decimals: 18 })}`}
              />
            </div>
          </div>
        )}
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={intl.formatMessage({
              id: 'dashboard.ads.launch.offer',
            })} required />
            <br />
            <small>
              {`The bid must be higher than ${minPrice} (20% higher than the current price)`}
            </small>
          </div>
          <div className={styles.value}>
            <Input
              value={price}
              className={`${styles.withAfterInput} ${priceErrorMsg ? style.inputError : ''}`}
              size='large'
              type='number'
              min={minPrice ? minPrice : 0}
              onChange={(e) => {
                setPrice(Number(e.target.value));
              }}
            />
            {priceErrorMsg && <FormErrorMsg msg={priceErrorMsg} />}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.title}>
            <FormFieldTitle title={intl.formatMessage({
              id: 'dashboard.ads.launch.token',
            })} />
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

        <div className={styles.field}>
          <Button
            block
            type="primary"
            shape="round"
            size="large"
            className={styles.button}
            disabled={!nftId || !currentPrice.length || !price || !!nftIdErrorMsg || !!priceErrorMsg}
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
