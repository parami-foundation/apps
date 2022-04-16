import React, { useEffect, useRef, useState } from 'react';
import style from './style.less';
import { useIntl } from 'umi';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, notification } from 'antd';
import { PortNFT } from '@/services/parami/nft';
import { contractAddresses } from '../config';
import { useModel } from "@@/plugin-model/useModel";
import type { BigNumber } from "ethers";
import { ethers } from "ethers";
import WrapperABI from "../abi/ParamiHyperlink.json";
import type { JsonRpcSigner } from "@ethersproject/providers";
import Skeleton from '@/components/Skeleton';

const ImportNFTModal: React.FC<{
  setImportModal: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
}> = ({ setImportModal, password }) => {
  const apiWs = useModel('apiWs');
  const { wallet } = useModel('currentUser');
  const { getNFTs } = useModel('nft');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [tokenData, setTokenData] = useState<Erc721[]>([]);
  const [coverWidth, setCoverWidth] = useState<number>(0);
  const {
    Account,
    Signer,
    Provider,
    ChainId,
  } = useModel("web3");

  const intl = useIntl();

  const coverRef: any = useRef();

  const getNfts = async (signer: JsonRpcSigner) => {
    const wrapContract = new ethers.Contract(contractAddresses.wrap[1], WrapperABI.abi, signer);
    const balanceKinds: BigNumber = await wrapContract.balanceOf(Account);

    if (!balanceKinds) {
      setLoading(false);
      return [];
    }

    const tokenIndexArray: number[] = [];
    for (let i = 0; i < balanceKinds.toNumber(); i++) {
      tokenIndexArray.push(i);
    }

    const tokenIdPromises = tokenIndexArray.map(async (i) => {
      const tokenId = await wrapContract?.tokenOfOwnerByIndex(Account, i);

      if (parseInt(tokenId) == NaN) {
        return -1;
      }
      return tokenId;
    });

    const tokenIds = await Promise.all(tokenIdPromises);

    const positionPromises = tokenIds.map(async (tokenId) => {
      const name = await wrapContract?.getOriginalName(tokenId);
      const tokenURI = await wrapContract?.tokenURI(tokenId);
      const token = {
        tokenId,
        name,
        tokenURI,
      }
      return token;
    });
    const data = await Promise.all(positionPromises);
    setLoading(false);
    return data;
  };

  const importNft = async (tokenID: string) => {
    if (!!wallet && !!wallet.keystore) {
      setSubmitLoading(true);
      try {
        await PortNFT(password, wallet?.keystore, 'Ethereum', contractAddresses.wrap[1], tokenID);
        setSubmitLoading(false);
        setImportModal(false);
        getNFTs();
      } catch (e: any) {
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
      if (ChainId !== 1 && ChainId !== 4) {
        return;
      }
      if (!Provider || !Signer) {
        return;
      }
      getNfts(Signer).then(r => setTokenData(r));
    }
  }, [Account, Provider, Signer, ChainId]);

  useEffect(() => {
    if (tokenData.length) {
      setCoverWidth(coverRef.current.clientWidth)
    }
  }, [coverRef]);

  return (
    <div className={style.importContainer}>
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
              {tokenData.map((item: any) => {
                const json = Buffer.from(item.tokenURI.substring(29), 'base64').toString('utf8');
                const result = JSON.parse(json);
                return (
                  <div className={style.nftItem}>
                    <div className={style.card}>
                      <div className={style.cardWrapper}>
                        <div className={style.cardBox}>
                          <div
                            className={style.cover}
                            ref={coverRef}
                            style={{
                              backgroundImage: `url(${result?.image})`,
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
                                onClick={async () => {
                                  await importNft(item?.tokenID)
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
    </div>
  )
};

const Import: React.FC<{
  importModal: boolean;
  setImportModal: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
}> = ({ importModal, setImportModal, password }) => {
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
          password={password}
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
