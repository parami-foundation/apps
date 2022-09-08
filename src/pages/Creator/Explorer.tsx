import React, { useEffect, useState } from 'react';
import Advertisement from './Explorer/Advertisement';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { history, useAccess, useIntl, useParams, useModel } from 'umi';
import { hexToDid, didToHex } from '@/utils/common';
import { GetNFTMetaData, GetPreferredNFT } from '@/services/parami/NFT';
import { Image, notification, Button, Divider } from 'antd';
import config from '@/config/config';
import Support from './Explorer/Supoort';
import { GetSlotAdOf } from '@/services/parami/Advertisement';
import BigModal from '@/components/ParamiModal/BigModal';
import { GetAssetInfo } from '@/services/parami/Assets';
import { GetSimpleUserInfo } from '@/services/parami/RPC';
import { deleteComma } from '@/utils/format';
import Footer from '@/components/Footer';

const Explorer: React.FC = () => {
  const apiWs = useModel('apiWs');
  const { wallet } = useModel('currentUser');
  const { bodyHeight } = useModel('bodyChange');
  const [loading, setLoading] = useState<boolean>(true);
  const [avatar, setAvatar] = useState<string>('');
  const [KOL, setKOL] = useState<boolean>(true);
  const [user, setUser] = useState<any>();
  const [nft, setNft] = useState<any>();
  const [asset, setAsset] = useState<any>();
  const [notAccess, setNotAccess] = useState<boolean>(false);
  const [adSlot, setAdSlot] = useState<any>();
  const [adData, setAdData] = useState<any>();
  const [ad, setAd] = useState<Type.AdInfo>(null);

  const intl = useIntl();
  const access = useAccess();

  const avatarTop = document.getElementById('avatar')?.offsetTop;
  const avatarLeft = document.getElementById('avatar')?.offsetLeft;
  const windowWidth = document.body.clientWidth;

  const params: {
    kol: string;
    nftID: string;
  } = useParams();

  // Get Referrer
  const { query } = history.location;
  const { referrer } = query as { referrer: string };

  // Get DID
  const did = !!params?.kol ? 'did' + params?.kol : hexToDid(wallet.did!);
  const didHex = didToHex(did);

  const errorHandler = (e) => {
    notification.error({
      message: e.message,
      duration: null,
    });
  }

  const queryAdSlot = async () => {
    const slot = await GetSlotAdOf(params.nftID);
    if (!slot) {
      history.replace(`${window.location.pathname}/dao`);
      return;
    }
    setAdSlot(slot);
  }

  const queryAdJson = async (data) => {
    if (data?.metadata?.indexOf('ipfs://') < 0) return;

    const hash = data?.metadata?.substring(7);

    const res = await fetch(config.ipfs.endpoint + hash);
    const adJson: Type.AdInfo = await res.json();

    if (!adJson) return;

    setAd(adJson);
  }

  useEffect(() => {
    if (adSlot) {
      try {
        const adData = adSlot.ad;
        if (!adData?.metadata) return;
        setAdData(adData);
        queryAdJson(adData);
      } catch (e) {
        errorHandler(e);
      }
    }
  }, [adSlot])

  const queryPreferred = async () => {
    try {
      const nftID = await GetPreferredNFT(didHex);
      if (nftID.isEmpty) {
        setKOL(false);
        return;
      }
      window.location.href = `${window.location.origin}/${did}/${nftID}`;
    } catch (e: any) {
      notification.error({
        message: e.message,
        duration: null,
      });
      return;
    }
  };

  const queryUser = async () => {
    const userData = await GetSimpleUserInfo(didHex);
    if (!userData) {
      notification.error({
        message: intl.formatMessage({
          id: 'error.identity.notFound',
        }),
        duration: null,
      });
      history.goBack();
      return;
    };
    setUser(userData);
  }

  const queryAvatar = async () => {
    // todo: query nft image
    setLoading(false);
    return;

    // // Query user avatar
    // if (user?.avatar.indexOf('ipfs://') > -1) {
    //   const hash = user?.avatar?.substring(7);
    //   const { response, data } = await GetAvatar(config.ipfs.endpoint + hash);

    //   // Network exception
    //   if (!response) {
    //     notification.error({
    //       key: 'networkException',
    //       message: 'Network exception',
    //       description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
    //       duration: null,
    //     });
    //     setLoading(false);
    //   }

    //   if (response?.status === 200) {
    //     setAvatar(window.URL.createObjectURL(data));
    //   }
    // };
  }

  useEffect(() => {
    if (user) {
      // Set page title
      document.title = `${user?.nickname.toString() || did} - Para Metaverse Identity`;
      queryAvatar().catch(errorHandler);
    }
  }, [user]);

  const queryNftMetaData = async () => {
    const nftInfoData = await GetNFTMetaData(params?.nftID);

    // If don't have any nft
    if (!nftInfoData) {
      notification.error({
        message: intl.formatMessage({
          id: 'error.nft.notFound',
        }),
        duration: null,
      })
      history.goBack();
      return;
    }

    if (nftInfoData?.owner !== didHex) {
      notification.error({
        message: intl.formatMessage({
          id: 'error.nft.notFound',
        }),
        duration: null,
      })
      history.goBack();
      return;
    }

    setNft(nftInfoData);
  }

  useEffect(() => {
    const queryAssetInfo = async () => {
      const assetData = await GetAssetInfo(nft?.tokenAssetId as string);
      // If don't mint any nft
      if (assetData.isEmpty) {
        setKOL(false);
        return;
      }

      const assetInfo = assetData.toHuman() as any;
      setAsset(assetInfo);
    }

    if (nft) {
      try {
        queryAssetInfo();
      } catch (e) {
        errorHandler(e);
      }
    }
  }, [nft]);

  useEffect(() => {
    if (asset) {
      queryAdSlot().catch(errorHandler);
    }
  }, [asset])

  useEffect(() => {
    if (apiWs && !params?.nftID) {
      queryPreferred();
    };

    if (!access.canWalletUser) {
      localStorage.setItem('parami:wallet:redirect', window.location.href);
      setNotAccess(true);
    };

    if (apiWs) {
      try {
        queryNftMetaData();
        queryUser();
      } catch (e) {
        errorHandler(e);
      }
    };
  }, [apiWs]);

  return (
    <>
      <div
        className={style.explorerContainer}
      >
        {KOL && (
          <>
            <Image
              src={avatar || '/images/default-avatar.svg'}
              fallback='/images/default-avatar.svg'
              className={style.avatar}
              style={{
                top: loading ? (bodyHeight - 400) / 2 : avatarTop,
                left: loading ? (windowWidth - 200) / 2 : avatarLeft,
                width: loading ? 200 : 30,
                height: loading ? 200 : 30,
                animation: loading ? 1 : 0,
                position: loading ? 'fixed' : 'absolute',
                display: loading || (adData && Object.keys(adData).length) ? 'flex' : 'none',
              }}
              preview={false}
            />
            <div
              className={style.loading}
              style={{
                opacity: loading ? 1 : 0,
                zIndex: loading ? 15 : -1,
                height: bodyHeight,
                minHeight: '100vh',
              }}
            >
              <span className={style.loadingTip}>
                {intl.formatMessage({
                  id: 'creator.explorer.loading.tip',
                  defaultMessage: 'Let\'s find out more about the NFT.{br} Surprise awaits...',
                }, {
                  br: <br />
                })}
              </span>
            </div>
          </>
        )}
        {!KOL && access.canWalletUser && nft && (
          <div
            className={styles.pageContainer}
            style={{
              paddingTop: 50,
              maxWidth: 1920,
            }}
          >
            <Support
              nft={nft}
            />
          </div>
        )}
        {(KOL && adData && Object.keys(adData).length > 0) && (
          <div
            className={styles.pageContainer}
            style={{
              paddingTop: 50,
              maxWidth: '100%'
            }}
          >
            <Advertisement
              ad={ad}
              nftId={params?.nftID}
              referrer={referrer}
              asset={asset}
              avatar={avatar}
              did={did}
              adData={adData}
              adImageOnLoad={() => {
                setLoading(false)
              }}
            />
          </div>
        )}

        <Footer />
      </div>

      <BigModal
        visable={notAccess}
        title={intl.formatMessage({
          id: 'error.identity.notUser',
        })}
        content={
          <div className={style.notUser}>
            <div className={style.buttons}>
              <Button
                block
                size='large'
                type='primary'
                shape='round'
                className={style.button}
                onClick={() => {
                  history.push(config.page.createPage);
                }}
              >
                <div className={style.title}>
                  {intl.formatMessage({
                    id: 'index.createAccount',
                  })}
                </div>
                <span className={style.desc}>
                  {intl.formatMessage({
                    id: 'index.createAccount.desc',
                  })}
                </span>
              </Button>
              <Divider>
                {intl.formatMessage({
                  id: 'index.or',
                })}
              </Divider>
              <Button
                block
                ghost
                size='large'
                type='link'
                shape='round'
                className={`${style.button} ${style.buttonImport}`}
                onClick={() => {
                  history.push(config.page.recoverPage);
                }}
              >
                <div className={style.title}>
                  {intl.formatMessage({
                    id: 'index.importAccount',
                  })}
                </div>
                <span className={style.desc}>
                  {intl.formatMessage({
                    id: 'index.importAccount.desc',
                  })}
                </span>
              </Button>
            </div>
          </div>
        }
        close={undefined}
        footer={false}
      />
    </>
  )
};

export default Explorer;
