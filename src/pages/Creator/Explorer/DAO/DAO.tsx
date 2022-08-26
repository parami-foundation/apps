import React, { useEffect, useState } from 'react';
import { history, useIntl, useParams, useModel } from 'umi';
import style from './DAO.less';
import { didToHex, hexToDid, parseAmount } from '@/utils/common';
import User from '../User';
import Stat from '../Stat';
import { notification } from 'antd';
import { GetAssetDetail, GetAssetInfo, GetAssetsHolders } from '@/services/parami/Assets';
import { GetNFTMetaData } from '@/services/parami/NFT';
import { DrylySellToken, GetSimpleUserInfo } from '@/services/parami/RPC';

const DAO: React.FC = () => {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const [avatar, setAvatar] = useState<string>('');
    const [KOL, setKOL] = useState<boolean>(true);
    const [user, setUser] = useState<any>();
    const [asset, setAsset] = useState<any>();
    const [nft, setNft] = useState<any>();
    const [assetPrice, setAssetPrice] = useState<string>('');
    const [totalSupply, setTotalSupply] = useState<bigint>(BigInt(0));
    const [member, setMember] = useState<any>();

    const intl = useIntl();

    const errorHandler = (e) => {
        notification.error({
            message: e.message,
            duration: null,
        });
    }

    const params: {
        kol: string;
        nftID: string;
    } = useParams();

    const did = !!params?.kol ? 'did' + params?.kol : hexToDid(wallet.did!);
    const didHex = didToHex(did);

    const queryAvatar = async () => {
        // todo: query nft image
    }

    useEffect(() => {
        if (user) {
            // Set page title
            document.title = `${user?.nickname.toString() || did} - Para Metaverse Identity`;
            queryAvatar();
        }
    }, [user]);

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

    const queryNftMetaData = async () => {
        const nftInfoData = await GetNFTMetaData(params?.nftID);

        // If don't have any nft
        if (nftInfoData?.isEmpty) {
            notification.error({
                message: 'This KOL does not own any NFT',
                duration: null,
            })
            history.goBack();
            return;
        }

        const nftInfo: any = nftInfoData?.toHuman();

        if (nftInfo?.owner !== didHex) {
            notification.error({
                message: 'This KOL does not own any NFT',
                duration: null,
            })
            history.goBack();
            return;
        }

        setNft(nftInfo);
    }

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

    useEffect(() => {
        if (apiWs) {
            try {
                queryNftMetaData();
                queryUser();
            } catch (e) {
                errorHandler(e);
            }
        };
    }, [apiWs]);

    const queryAssetPrice = async () => {
        const value = await DrylySellToken(nft?.tokenAssetId, parseAmount('1'));
        setAssetPrice(value.toString());
    }

    const queryTotalSupply = async () => {
        const assetDetail = await GetAssetDetail(nft?.tokenAssetId);
        const supply: string = assetDetail.unwrap().supply.toString();
        setTotalSupply(BigInt(supply));
    }

    const queryMember = async () => {
        const members = await GetAssetsHolders(nft?.tokenAssetId);
        setMember(members);
    }

    useEffect(() => {
        if (nft && asset) {
            try {
                queryAssetPrice();
                queryTotalSupply();
                queryMember();
            } catch (e) {
                errorHandler(e);
            }
        }
    }, [nft, asset]);

    return <>
        <div className={style.pageContainer}>
            <User
                avatar={avatar}
                did={did}
                user={user}
                asset={asset}
                assetId={nft?.tokenAssetId}
            />
            {KOL && (
                <>
                    <Stat
                        asset={asset}
                        assetPrice={assetPrice}
                        totalSupply={totalSupply}
                        member={member}
                    />
                </>
            )}
        </div>
    </>;
};

export default DAO;
