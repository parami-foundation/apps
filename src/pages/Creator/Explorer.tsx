import React, { useEffect, useState } from 'react';
import Advertisement from './Explorer/Advertisement';
import Stat from './Explorer/Stat';
import User from './Explorer/User';
import styles from '@/pages/wallet.less';
import style from './style.less';
import Trade from './Explorer/Trade';
import { history, useAccess, useIntl, useParams, useModel } from 'umi';
import { hexToDid, didToHex, parseAmount } from '@/utils/common';
import { GetAssetDetail, GetAssetInfo, GetAssetsHolders, GetNFTMetaData, GetPreferedNFT, GetValueOf } from '@/services/parami/nft';
import { Image, notification, Button } from 'antd';
import config from '@/config/config';
import Support from './Explorer/Supoort';
import { GetSlotAdOf } from '@/services/parami/ads';
import { getAdvertisementRefererCounts, getAdViewerCounts } from '@/services/subquery/subquery';
import BigModal from '@/components/ParamiModal/BigModal';
import { GetAdRemain } from '../../services/parami/nft';
import { GetAvatar } from '@/services/parami/api';
import { GetUserInfo } from '@/services/parami/Info';

const Explorer: React.FC = () => {
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');
	const { bodyHeight } = useModel('bodyChange');
	const [loading, setLoading] = useState<boolean>(true);
	const [avatar, setAvatar] = useState<string>('');
	const [KOL, setKOL] = useState<boolean>(true);
	const [user, setUser] = useState<any>();
	const [asset, setAsset] = useState<any>();
	const [assetPrice, setAssetPrice] = useState<string>('');
	const [totalSupply, setTotalSupply] = useState<bigint>(BigInt(0));
	const [notAccess, setNotAccess] = useState<boolean>(false);
	const [adData, setAdData] = useState<any>({});
	const [ad, setAd] = useState<Type.AdInfo>(null);
	const [viewer, setViewer] = useState<any>();
	const [referer, setRefererr] = useState<any>();
	const [member, setMember] = useState<any>();
	const [remain, setRemain] = useState<any>();

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

	// Get Advertisement Info
	const GetADInfo = async () => {
		try {
			const slot = await GetSlotAdOf(didHex);
			if (!slot) return;
			const data = slot.ad;
			if (!data?.metadata) return;
			setAdData(data);

			if (data?.metadata?.indexOf('ipfs://') < 0) return;

			const hash = data?.metadata?.substring(7);

			const viewers = await getAdViewerCounts(data?.id);
			setViewer(viewers);

			const referers = await getAdvertisementRefererCounts(data?.id);
			setRefererr(referers);

			const res = await fetch(config.ipfs.endpoint + hash);
			const adJson: Type.AdInfo = await res.json();

			if (!adJson) return;

			adJson.link = adJson.link + '?kol=' + didToHex(did);
			if (!!referrer) {
				adJson.link += '&referrer=' + referrer;
			};

			setAd(adJson);

			const remainData = await GetAdRemain(slot);
			setRemain(remainData);

		} catch (e: any) {
			notification.error({
				message: e.message,
				duration: null,
			});
			return;
		}
	};

	// Query user info and asset info
	const QueryUserAndAsset = async () => {
		setLoading(true);
		try {
			const userData = await GetUserInfo(didHex);
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

			// Query user avatar
			if (userData?.avatar.indexOf('ipfs://') > -1) {
				const hash = userData?.avatar?.substring(7);
				const { response, data } = await GetAvatar(config.ipfs.endpoint + hash);

				// Network exception
				if (!response) {
					notification.error({
						key: 'networkException',
						message: 'Network exception',
						description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
						duration: null,
					});
					return;
				}

				if (response?.status === 200) {
					setAvatar(window.URL.createObjectURL(data));
				}
			};

			// Set page title
			document.title = `${userData?.nickname.toString() || did} - Para Metaverse Identity`;

			const nftInfoData = await GetNFTMetaData(params?.nftID);

			// If don't have any nft
			if (nftInfoData?.isEmpty) {
				notification.error({
					message: intl.formatMessage({
						id: 'error.nft.notFound',
					}),
					duration: null,
				})
				history.goBack();
				return;
			}

			const nftInfo: any = nftInfoData?.toHuman();

			if (nftInfo?.owner !== didHex) {
				notification.error({
					message: intl.formatMessage({
						id: 'error.nft.notFound',
					}),
					duration: null,
				})
				history.goBack();
				return;
			}

			const assetData = await GetAssetInfo(nftInfo?.tokenAssetId as string);
			// If don't mint any nft
			if (assetData.isEmpty) {
				setKOL(false);
				return;
			}

			const assetInfo = assetData.toHuman() as any;
			setAsset(assetInfo);

			const value = await GetValueOf(nftInfo?.tokenAssetId, parseAmount('1'));
			setAssetPrice(value.toString());

			const assetDetail = await GetAssetDetail(nftInfo?.tokenAssetId);

			const supply: string = assetDetail.unwrap().supply.toString();
			setTotalSupply(BigInt(supply));

			const members = await GetAssetsHolders(nftInfo?.tokenAssetId);
			setMember(members);

			await GetADInfo();

			setTimeout(() => {
				setLoading(false);
			}, 2000);
		} catch (e: any) {
			notification.error({
				message: e.message,
				duration: null,
			});
			return;
		}
	};

	const QueryPreferred = async () => {
		try {
			const nftID = await GetPreferedNFT(didHex);
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

	useEffect(() => {
		if (apiWs && !params?.nftID) {
			QueryPreferred();
		};

		if (!access.canWalletUser) {
			localStorage.setItem('redirect', window.location.href);
			setNotAccess(true);
		};

		if (apiWs) {
			QueryUserAndAsset();
		};
	}, [apiWs]);

	return (
		<>
			<div
				className={styles.mainTopContainer}
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
								display: loading || Object.keys(adData).length ? 'flex' : 'none',
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
				{!KOL && access.canWalletUser && did !== hexToDid(wallet.did!) && (
					<div
						className={styles.pageContainer}
						style={{
							paddingTop: 50,
							maxWidth: 1920,
						}}
					>
						<Support
							did={did}
						/>
					</div>
				)}
				{(KOL && Object.keys(adData).length > 0) && (
					<div
						className={styles.pageContainer}
						style={{
							paddingTop: 50,
							maxWidth: '100%',
							backgroundColor: 'rgba(244,245,246,1)',
						}}
					>
						<Advertisement
							ad={ad}
							viewer={viewer}
							referer={referer}
							asset={asset}
							avatar={avatar}
							did={did}
							adData={adData}
							remain={remain}
							loading={loading}
						/>
					</div>
				)}
				<div
					className={styles.pageContainer}
					style={{
						paddingTop: 50,
						maxWidth: 1920,
					}}
				>
					<User
						avatar={avatar}
						did={did}
						user={user}
						nftID={params?.nftID}
						asset={asset}
					/>
				</div>
				<div
					className={styles.pageContainer}
					style={{
						paddingTop: 50,
						maxWidth: 1920,
					}}
				>
					{KOL && access.canWalletUser && (
						<>
							<Stat
								asset={asset}
								assetPrice={assetPrice}
								totalSupply={totalSupply}
								viewer={viewer}
								member={member}
							/>
							<Trade
								avatar={avatar}
								asset={asset}
								user={user}
								assetPrice={assetPrice}
							/>
						</>
					)}
				</div>
			</div>

			<BigModal
				visable={notAccess}
				title={intl.formatMessage({
					id: 'error.identity.notUser',
				})}
				content={
					<Button
						block
						type='primary'
						shape='round'
						size='large'
						onClick={() => {
							history.push(config.page.createPage);
						}}
					>
						{intl.formatMessage({
							id: 'error.identity.notUser.button',
							defaultMessage: 'Create a new identity',
						})}
					</Button>
				}
				close={undefined}
				footer={false}
			/>
		</>
	)
};

export default Explorer;
