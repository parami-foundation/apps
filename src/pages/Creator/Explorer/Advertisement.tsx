import { Button, Card, Image, message, notification } from 'antd';
import React, { useState } from 'react';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { useIntl, history, useModel } from 'umi';
import { ShareAltOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { hexToDid } from '@/utils/common';
import copy from 'copy-to-clipboard';
import { base64url } from '@/utils/format';
import Keyring from '@polkadot/keyring';
import { useEffect } from 'react';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { DecodeKeystoreWithPwd } from '@/services/parami/Crypto';
import ClaimModal from './components/ClaimModal/ClaimModal';
import ParamiScoreTag from './components/ParamiScoreTag/ParamiScoreTag';
import ParamiScore from './components/ParamiScore/ParamiScore';

const Advertisement: React.FC<{
	ad: Type.AdInfo;
	nftId: string;
	referrer?: string;
	asset: any;
	avatar: string;
	did: string;
	adData: any;
	adImageOnLoad: () => void
}> = ({ ad, nftId, referrer, asset, avatar, did, adData, adImageOnLoad = () => { } }) => {
	const { wallet } = useModel('currentUser');
	const [passphrase, setPassphrase] = useState<string>('');
	const [secModal, setSecModal] = useState<boolean>(false);
	const [stamp, setStamp] = useState<string>('');
	const [claimModal, setClaimModal] = useState<boolean>(false);
	const [adClaimed, setAdClaimed] = useState<boolean>(false);

	const apiWs = useModel('apiWs');

	const intl = useIntl();

	const link = !!wallet?.did ? `${window.location.origin}/${did}/${nftId}?referrer=${wallet?.did}` : `${window.location.origin}/${did}/${nftId}`;

	// Get audience and scope
	const { query } = history.location;
	const { audience, scope } = query as { audience: string, scope: string | null | undefined };
	const scopes = scope ?? '';
	const sign = scopes.indexOf('sign') > -1;

	const handleStamp = async () => {
		if (!!wallet && !!wallet?.keystore) {
			const timestamp = Date.now() / 1000 | 0;

			const header = JSON.stringify({
				alg: sign ? 'SrDSA' : 'none',
				typ: 'JWT'
			});

			const payload = JSON.stringify({
				iss: window.location.origin,
				sub: wallet?.account,
				aud: audience,
				iat: timestamp,
				exp: timestamp + 30
			});

			const plain = `${base64url(header)}.${base64url(payload)}`;

			if (!sign) {
				setStamp(`${plain}.`);
				return;
			}

			const instanceKeyring = new Keyring({ type: 'sr25519' });
			const decodedMnemonic = DecodeKeystoreWithPwd(wallet?.passphrase || passphrase, wallet?.keystore);
			if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
				message.error(
					intl.formatMessage({
						id: 'error.passphrase.error',
					})
				);
				return;
			}
			const keypair = instanceKeyring.createFromUri(decodedMnemonic);

			const signature = keypair.sign(plain);
			const ticket = `${plain}.${base64url(signature)}`;

			setStamp(ticket);
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

	const gotoAdPage = async (preTx?: boolean, account?: string) => {
		if (preTx && account) {
			return
		}

		window.open(`${ad?.link}&nftId=${nftId}&did=${wallet?.did}&ad=${adData?.id}&t=${Date.now()}&poster=${ad?.poster}`);
	};

	const sponsoredBy = hexToDid(adData?.creator).substring(8);

	useEffect(() => {
		if (!!wallet && !!wallet?.keystore) {
			handleStamp();
		}
	}, [wallet, wallet?.keystore]);

	const checkAdClaimStatus = async (apiWs, adId, did) => {
		const res = await apiWs.query.ad.payout(adId, did);
		if (res.isEmpty) {
			setAdClaimed(false);
		} else {
			setAdClaimed(true);
		}
		setAdClaimed(false);
	}

	useEffect(() => {
		if (apiWs && adData?.id && wallet?.did) {
			checkAdClaimStatus(apiWs, adData?.id, wallet?.did);
		}
	}, [apiWs, adData, wallet])

	return (
		<>
			<div className={style.advertisementContainer}>
				<div className={style.container}>
					<div className={style.topBar}>
						<div className={style.sponsored}>
							<Image
								src={avatar || '/images/logo-round-core.svg'}
								className={style.avatar}
								preview={false}
								id='avatar'
								fallback='/images/logo-round-core.svg'
							/>
							<span>
								{intl.formatMessage({
									id: 'creator.explorer.advertisement.sponsoredBy',
								}, { did: `${sponsoredBy}` })}
							</span>
						</div>
					</div>
				</div>
				<Card
					className={`${styles.card} ${style.adCard}`}
					style={{ maxWidth: '650px', border: 'none', marginBottom: '30px' }}
					bodyStyle={{
						padding: 0,
						width: '100%',
					}}
				>
					<div className={style.advertisement}>
						<div className={style.adMedia}>
							<Image
								src={ad?.media}
								placeholder={true}
								preview={false}
								className={style.adMediaImg}
								onClick={() => {
									if (sign) {
										setSecModal(true);
									} else {
										gotoAdPage();
									}
								}}
								onLoad={adImageOnLoad}
							/>
						</div>
						{ad?.instructions && ad?.instructions?.length > 0 && <>
							<div className={style.instructions}>
								<div className={style.instructionTitle}>Follow the instructions to improve your parami score</div>
								{ad.instructions.map(instruction => {
									return (
										<div className={style.instruction}>
											<span className={style.instructionText}>{instruction.text}</span>
											{!!instruction.tag && <ParamiScoreTag tag={instruction.tag} />}
											{!!instruction.score && <ParamiScore score={parseInt(instruction.score, 10)} />}
										</div>
									)
								})}
							</div>
						</>}
					</div>
				</Card>
				<div className={style.buttonContainer}>
					{adClaimed && <>
						<Button
							block
							type='primary'
							shape='round'
							size='large'
							icon={<ShareAltOutlined />}
							className={style.shareButton}
							onClick={async () => {
								const shareData = {
									title: 'Para Metaverse Identity',
									text: intl.formatMessage({
										id: 'creator.explorer.shareMessage',
									}),
									url: link,
								};
								if (navigator.canShare && navigator.canShare(shareData)) {
									try {
										await navigator.share(shareData);
									} catch (e) {
										console.log(e);
									}
								} else {
									copy(link + ` ${intl.formatMessage({
										id: 'creator.explorer.shareMessage',
									}, {
										token: `$${asset?.symbol}`
									})}`);
									message.success(
										intl.formatMessage({
											id: 'common.copied',
										}),
									);
								}
							}}
						>
							{intl.formatMessage({
								id: 'creator.explorer.advertisement.share',
							}, { token: `$${asset?.symbol}` })}
						</Button>
					</>}

					{!adClaimed && <>
						<Button
							block
							type='primary'
							shape='round'
							size='large'
							icon={<MoneyCollectOutlined />}
							className={style.claimBtn}
							onClick={() => setClaimModal(true)}
						>
							{`Claim your $${asset?.symbol}`}
						</Button>
					</>}
				</div>

				{claimModal && <ClaimModal
					adId={adData?.id}
					nftId={nftId}
					referrer={referrer}
					onClose={() => setClaimModal(false)}
					onClaim={() => {
						setClaimModal(false);
						setAdClaimed(true);
					}}
				></ClaimModal>}
				<SecurityModal
					visable={secModal}
					setVisable={setSecModal}
					passphrase={passphrase}
					setPassphrase={setPassphrase}
					func={gotoAdPage}
				/>
			</div>
		</>
	)
};

export default Advertisement;
