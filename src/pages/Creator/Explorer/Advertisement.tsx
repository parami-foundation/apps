import { Button, Card, Image, message, Tooltip } from 'antd';
import React, { useState } from 'react';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { history, useIntl, useModel } from 'umi';
import { ShareAltOutlined, MoneyCollectOutlined, WalletOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { hexToDid } from '@/utils/common';
import copy from 'copy-to-clipboard';
import { useEffect } from 'react';
import ClaimModal from './components/ClaimModal/ClaimModal';
import ParamiScoreTag from './components/ParamiScoreTag/ParamiScoreTag';
import ParamiScore from './components/ParamiScore/ParamiScore';
import config from '@/config/config';
import { deleteComma } from '@/utils/format';
import BigModal from '@/components/ParamiModal/BigModal';

const Advertisement: React.FC<{
	ad: Type.AdInfo;
	nftId: string;
	referrer?: string;
	asset: any;
	avatar: string;
	did: string;
	adData: any;
	balance: string;
	notAccess: boolean;
	adImageOnLoad: () => void
}> = ({ ad, nftId, referrer, asset, avatar, did, adData, balance, notAccess, adImageOnLoad = () => { } }) => {
	const { wallet } = useModel('currentUser');
	const [claimModal, setClaimModal] = useState<boolean>(false);
	const [adClaimed, setAdClaimed] = useState<boolean>(false);
	const [oopsModal, setOopsModal] = useState<boolean>(false);

	const apiWs = useModel('apiWs');

	const intl = useIntl();

	const link = !!wallet?.did ? `${window.location.origin}/${did}/${nftId}?referrer=${wallet?.did}` : `${window.location.origin}/${did}/${nftId}`;

	const sponsoredBy = hexToDid(adData?.creator).substring(8);

	const insufficientBalance = balance && adData.payoutMin && BigInt(balance) < BigInt(deleteComma(adData.payoutMin));

	useEffect(() => {
		if (insufficientBalance && !notAccess && adClaimed) {
			setOopsModal(true);
		}
	}, [insufficientBalance, notAccess, adClaimed])

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

	const gotoWalletButton = (btnText: string) => {
		return <Button
			block
			type='primary'
			shape='round'
			size='large'
			className={style.actionBtn}
			icon={<WalletOutlined />}
			onClick={() => {
				history.push('/wallet');
			}}
		>
			{btnText}
		</Button>
	}

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
								onLoad={adImageOnLoad}
							/>
						</div>
						{ad?.instructions && ad?.instructions?.length > 0 && <>
							<div className={style.instructions}>
								<div className={style.instructionTitle}>
									Follow the instructions to improve your DID reputation score
									<Tooltip
										placement="top"
										title={'Your DID reputation score is a number attached to your DID that can be increased by performing tasks. The higher your DID reputation score, the higher the reward.'}
									>
										<ExclamationCircleOutlined style={{ marginLeft: '5px' }} />
									</Tooltip>
								</div>
								{ad.instructions.map((instruction, index) => {
									return (
										<div className={`${style.instruction} ${instruction.link ? style.withLink : ''}`} key={index} onClick={() => {
											!!instruction.link && window.open(`${config.main.weeklySite}?redirect=${instruction.link}&nftId=${nftId}&did=${wallet?.did}&ad=${adData?.id}&referrer=${referrer}&tag=${instruction.tag}&score=${instruction.score}`);
										}}>
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
							className={style.actionBtn}
							icon={<ShareAltOutlined />}
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
						
						{gotoWalletButton('Check your reward and score')}
					</>}

					{!adClaimed && <>
						{insufficientBalance && gotoWalletButton('Check your wallet and score')}
						{!insufficientBalance &&
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
						}
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

				{oopsModal && <BigModal
					visable
					content={<div>
						<p>Oops, all rewards have been claimed for this Ad. However the next Ad is coming soon, come back later or follow our twitter to get informed.</p>
					</div>}
					footer={<>
						<Button
							block
							type='primary'
							shape='round'
							size='large'
							onClick={() => setOopsModal(false)}
						>OK</Button>
					</>}
				></BigModal>}
			</div>
		</>
	)
};

export default Advertisement;
