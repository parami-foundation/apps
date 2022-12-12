import { Button, Card, Image, message, Tooltip } from 'antd';
import React, { useState } from 'react';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { history, useIntl, useModel } from 'umi';
import { ShareAltOutlined, MoneyCollectOutlined, WalletOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import ClaimModal from './components/ClaimModal/ClaimModal';
import ParamiScoreTag from './components/ParamiScoreTag/ParamiScoreTag';
import ParamiScore from './components/ParamiScore/ParamiScore';
import config from '@/config/config';

const Advertisement: React.FC<{
	referrer?: string;
	adData: any;
}> = ({ referrer, adData }) => {
	const { wallet } = useModel('currentUser');
	const [claimModal, setClaimModal] = useState<boolean>(false);
	const [adClaimed, setAdClaimed] = useState<boolean>(adData.claimed);

	const intl = useIntl();

	const link = !!wallet?.did ? `${window.location.origin}/ad/?nftId=${adData.nftId}&referrer=${wallet?.did}` : `${window.location.origin}/ad/?nftId=${adData.nftId}`;

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
								src={adData?.kolIcon || '/images/logo-round-core.svg'}
								className={style.avatar}
								preview={false}
								id='avatar'
								fallback='/images/logo-round-core.svg'
							/>
							<span>
								{`is sponsored by ${adData.sponsorName}`}
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
						{!!adData?.poster && <>
							<div className={style.adMedia}>
								<Image
									src={adData.poster}
									placeholder={true}
									preview={false}
									className={style.adMediaImg}
								/>
							</div>
						</>}

						{<>
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
								<div className={`${style.instruction} ${style.withLink}`} onClick={() => {
									window.open(`${config.main.weeklySite}?redirect=${adData?.link}&nftId=${adData?.nftId}&did=${wallet?.did}&ad=${adData?.adId}&referrer=${referrer}&tag=${adData?.tag}&score=${adData?.score}`);
								}}>
									<span className={style.instructionText}>{adData?.instructionText}</span>
									{!!adData?.tag && <ParamiScoreTag tag={adData?.tag} />}
									{!!adData?.score && <ParamiScore score={parseInt(adData?.score, 10)} />}
								</div>
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
										token: `$${adData?.symbol}`
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
							}, { token: `$${adData?.symbol}` })}
						</Button>

						{gotoWalletButton('Check your reward and score')}
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
							{`Claim your $${adData?.symbol}`}
						</Button>
					</>}
				</div>

				{claimModal && <ClaimModal
					adId={adData?.adId}
					nftId={adData?.nftId}
					referrer={referrer}
					onClose={() => setClaimModal(false)}
					onClaim={() => {
						setClaimModal(false);
						setAdClaimed(true);
					}}
				></ClaimModal>}
			</div>
		</>
	)
};

export default Advertisement;
