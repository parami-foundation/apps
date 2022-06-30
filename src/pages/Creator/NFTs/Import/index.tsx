import React, { useEffect, useRef, useState } from 'react';
import style from './style.less';
import { useIntl } from 'umi';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, notification, Alert } from 'antd';
import { PortNFT } from '@/services/parami/NFT';
import { registryAddresses } from '../config';
import { useModel } from '@@/plugin-model/useModel';
import type { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import RegistryABI from '../abi/ERC721WRegistry.json';
import WContractABI from '../abi/ERC721WContract.json';
import type { JsonRpcSigner } from '@ethersproject/providers';
import Skeleton from '@/components/Skeleton';
import { fetchErc721TokenURIMetaData, normalizeToHttp } from "@/utils/erc721";
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import ethNet from '@/config/ethNet';

const ImportNFTModal: React.FC<{
  setImportModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setImportModal }) => {
  const apiWs = useModel('apiWs');
  const { wallet } = useModel('currentUser');
  const { getNFTs } = useModel('nft');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [tokenData, setTokenData] = useState<Erc721[]>([]);
  const [coverWidth, setCoverWidth] = useState<number>(0);
  const [secModal, setSecModal] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [mintItem, setMintItem] = useState<Erc721>();
  const [chainWarning, setChainWarning] = useState<string>('');
  const {
    Account,
    Signer,
    Provider,
    ChainId,
    ChainName
  } = useModel("web3");

  const intl = useIntl();

  const coverRef: any = useRef();

  const getNftsOfSigner = async (signer: JsonRpcSigner): Promise<Erc721[]> => {
    const registry = new ethers.Contract(registryAddresses, RegistryABI.abi, signer);
    const wrappedContracts: string[] = await registry.getWrappedContracts();
    const wContracts: string[] = await Promise.all(wrappedContracts.map(addr => registry.getERC721wAddressFor(addr)));
    console.debug('wrapped contracts', wContracts);

    // TODO: (ruibin) if we have a lots of wrapped contracts, performance coule be degraded.
    const results: Erc721[][] = await Promise.all(
      wContracts.map(async (address) => {
        const wContract = new ethers.Contract(address, WContractABI.abi, signer);
        const [balance, name]: [BigNumber, string] = await Promise.all([
          wContract.balanceOf(signer.getAddress()),
          wContract.name(),
        ]);
        console.debug('balance, name', balance, name);

        const tokenInfo: Promise<Erc721>[] = [];
        for (let i = 0; i < balance.toNumber(); i++) {
          tokenInfo.push(
            (async () => {
              const tokenId: string = await wContract.tokenByIndex(i);
              const tokenUri: string = await wContract.tokenURI(tokenId);
              const metadata = await fetchErc721TokenURIMetaData(tokenUri);
              return {
                contract: address,
                tokenId: tokenId,
                imageUrl: normalizeToHttp(metadata.image),
                name: name,
              };
            })(),
          );
        }
        return await Promise.all(tokenInfo);
      }),
    );

    return results.flatMap((r) => r);
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
        getNFTs();
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
      if (ChainId !== 4) {
        return;
      }
      if (!Provider || !Signer) {
        return;
      }
      getNftsOfSigner(Signer).then((r) => {
        console.debug("nfts of signer", r);
        setTokenData(r);
        setLoading(false);
      });
    }
  }, [Account, Provider, Signer, ChainId]);

  useEffect(() => {
    if (tokenData.length) {
      setCoverWidth(coverRef.current.clientWidth)
    }
  }, [coverRef]);

  useEffect(() => {
		if (ChainId && ChainName && ChainId !== 4) {
			if (ChainId !== 4) {
				setChainWarning(`Your wallet is connected to the ${ChainName}. To import NFT, please switch to ${ethNet[4]}.`);
			} else {
				setChainWarning('');
			}
		}
	}, [ChainId, ChainName]);

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
