import React, { useEffect, useRef, useState } from 'react';
import style from './style.less';
import { useIntl } from 'umi';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, notification, Alert } from 'antd';
import { PortNFT } from '@/services/parami/NFT';
import { HCollectionAddress, registryAddresses } from '../config';
import { useModel } from '@@/plugin-model/useModel';
import { BigNumber, ethers } from 'ethers';
import RegistryABI from '../abi/ERC721WRegistry.json';
import type { JsonRpcSigner } from '@ethersproject/providers';
import Skeleton from '@/components/Skeleton';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import ethNet from '@/config/ethNet';
import { VoidFn } from '@polkadot/api/types';

const ImportNFTModal: React.FC<{
  setImportModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setImportModal }) => {
  const apiWs = useModel('apiWs');
  const { wallet } = useModel('currentUser');
  const { nftList } = useModel('nft');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [tokenData, setTokenData] = useState<Erc721[]>([]);
  const [coverWidth, setCoverWidth] = useState<number>(0);
  const [secModal, setSecModal] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [mintItem, setMintItem] = useState<Erc721>();
  const [chainWarning, setChainWarning] = useState<string>('');
  const { Events, SubParamiEvents } = useModel('paramiEvents');
  const [eventsUnsub, setEventsUnsub] = useState<(VoidFn)>();
  const {
    Account,
    Signer,
    Provider,
    ChainId,
    ChainName
  } = useModel("web3");
  const { retrieveAssets } = useModel('openseaApi');

  const intl = useIntl();

  const coverRef: any = useRef();

  const getNftsOfSigner = async (signer: JsonRpcSigner, chainId: 1 | 4) => {
    const registry = new ethers.Contract(registryAddresses[chainId], RegistryABI.abi, signer);
    const wrappedContracts: string[] = await registry.getWrappedContracts();
    const wContracts: string[] = await Promise.all(wrappedContracts.map(addr => registry.getERC721wAddressFor(addr)));

    const assets = await retrieveAssets({contractAddresses: [...wContracts, HCollectionAddress[chainId]]});
    return (assets ?? []).map(asset => ({
      contract: asset.asset_contract?.address,
      tokenId: BigNumber.from(asset.token_id),
      imageUrl: asset.image_url,
      name: asset.name
    } as Erc721));
  };

  const importNft = async (preTx?: boolean, account?: string) => {
    if (!!wallet && !!wallet.keystore && !!mintItem) {
      setSubmitLoading(true);
      try {
        const info: any = await PortNFT(
          passphrase,
          wallet?.keystore,
          'Ethereum',
          mintItem.contract,
          mintItem.tokenId,
          preTx,
          account,
        );
        setSubmitLoading(false);
        setImportModal(false);
        if (preTx && account) {
          return info
        }

        notification.info({
          key: 'importNFTprocessing',
          message: `Importing NFT...`,
          description: 'This might take up to a minute',
          duration: null
        });

        const unsub = await SubParamiEvents();
        setEventsUnsub(() => unsub);
      } catch (e: any) {
        console.log(e);
        notification.error({
          message: intl.formatMessage({ id: e }),
          duration: null,
        });
        setSubmitLoading(false);
      }
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      });
    }
  };

  useEffect(() => {
    if (!!Account) {
      if (ChainId !== 4 && ChainId !== 1) {
        return;
      }
      if (!Provider || !Signer) {
        return;
      }
      getNftsOfSigner(Signer, ChainId).then((r) => {
        setTokenData(r.filter(nft => {
          return !(nftList ?? []).find(importedNft => {
            return importedNft.namespace === nft.contract && importedNft.token === nft.tokenId?.toHexString();
          });
        }));
        setLoading(false);
      });
    }
  }, [Account, Provider, Signer, ChainId, retrieveAssets]);

  useEffect(() => {
    if (tokenData.length) {
      setCoverWidth(coverRef.current.clientWidth)
    }
  }, [coverRef]);

  useEffect(() => {
    if (ChainId && ChainName) {
      if (ChainId !== 4 && ChainId !== 1) {
        setChainWarning(`Your wallet is connected to the ${ChainName}. To import NFT, please switch to ${ethNet[1]} or ${ethNet[4]}.`);
      } else {
        setChainWarning('');
      }
    }
  }, [ChainId, ChainName]);

  useEffect(() => {
    if (Events?.length) {
      Events.forEach(record => {
        const { event } = record;
        if (`${event?.section}:${event?.method}` === 'nft:Created') {
          if (event?.data[0].toString() === wallet?.did) {
            notification.success({
              key: 'importNFTsuccess',
              message: `Import NFT success!`,
              description: 'Reloading your NFTs...',
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
      })
    }
  }, [Events])

  useEffect(() => {
    return () => eventsUnsub && eventsUnsub();
  }, [eventsUnsub])

  return (
    <div className={style.importContainer}>
      {chainWarning && <Alert className={style.chainWarning} message={chainWarning} type="warning" showIcon />}
      <Skeleton
        loading={!apiWs || loading}
        height={200}
        children={
          !tokenData.length ? (
            <div className={style.noNFTs}>
              <img
                src={'/images/icon/query.svg'}
                className={style.topImage}
              />
              <div className={style.description}>
                {intl.formatMessage({
                  id: 'wallet.nfts.empty',
                })}
              </div>
            </div>
          ) : (
            <div className={style.nftsList}>
              {tokenData.map((item: Erc721) => {
                return (
                  <div className={style.nftItem} key={item.contract + item.tokenId}>
                    <div className={style.card}>
                      <div className={style.cardWrapper}>
                        <div className={style.cardBox}>
                          <div
                            className={style.cover}
                            ref={coverRef}
                            style={{
                              backgroundImage: `url(${item.imageUrl})`,
                              height: coverWidth,
                              minHeight: '20vh',
                            }}
                          >
                            <div className={style.nftID}>
                              #{item?.tokenId?.toString()}
                            </div>
                          </div>
                          <div
                            className={style.filterImage}
                          />
                          <div className={style.cardDetail}>
                            <h3 className={style.text}>
                              {item?.name}
                            </h3>
                            <div className={style.action}>
                              <Button
                                block
                                type='primary'
                                shape='round'
                                size='middle'
                                loading={submitLoading}
                                onClick={() => {
                                  setMintItem(item);
                                  setSecModal(true);
                                }}
                              >
                                {intl.formatMessage({
                                  id: 'wallet.nfts.import',
                                })}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
      />
      <SecurityModal
        visable={secModal}
        setVisable={setSecModal}
        passphrase={passphrase}
        setPassphrase={setPassphrase}
        func={importNft}
      />
    </div>
  )
};

const Import: React.FC<{
  importModal: boolean;
  setImportModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ importModal, setImportModal }) => {
  const intl = useIntl();

  return (
    <BigModal
      visable={importModal}
      title={intl.formatMessage({
        id: 'wallet.nfts.import',
      })}
      content={
        <ImportNFTModal
          setImportModal={setImportModal}
        />
      }
      footer={false}
      close={() => {
        setImportModal(false)
      }}
    />
  )
};

export default Import;
