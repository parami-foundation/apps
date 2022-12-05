import React, { useEffect, useState } from 'react';
import style from './Advertisement.less';
import { message, notification, Spin, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import config from '@/config/config';
import copy from 'copy-to-clipboard';

const Advertisement: React.FC<{
	ad: any;
	claimed: boolean;
	userDid?: string;
}> = ({ ad, userDid, claimed }) => {
	const [claiming, setClaiming] = useState<boolean>(false);
	const [adClaimed, setAdClaimed] = useState<boolean>(claimed);

	const tags = (ad?.instructions ?? []).map((instruction: any) => instruction.tag).filter(Boolean);

	const claim = async (redirect: boolean) => {
		setClaiming(true);
		try {
			const instruction = ad.instructions[0];
			if (redirect && instruction) {
				window.open(decodeURIComponent(instruction.link));
			}

			const body = {
				adId: ad.adId,
				nftId: ad.nftId,
				did: userDid,
				score: {
					tag: instruction?.tag,
					score: redirect ? instruction?.score : -5
				}
			};

			const res = await fetch(`${config.main.weeklySite}api/pay`, {
				"headers": {
					"content-type": "application/json",
				},
				"body": JSON.stringify(body),
				"method": "POST",
			});

			setClaiming(false);

			if (res.ok) {
				setAdClaimed(true);
			} else {
				message.error({
					content: 'Network Error. Please try again later.'
				})
			}
		} catch (e) {
			console.log('HNFT extension claiming error', e);
			setClaiming(false);
			message.error({
				content: 'Network Error. Please try again later.'
			})
		}
	}

	return (
		<>
			<div className={style.advertisementContainer}>
				<div className={style.bidSection}>
					<div className={style.daoInfo}>
						<img referrerPolicy='no-referrer' className={style.kolIcon} src={ad.kolIcon}></img>
						<div className={style.daoInfoText}>
							<div className={style.daoToken} onClick={() => {
								history.push(`/dao/?nftId=${ad.nftId}`)
							}}>
								{ad?.assetName} NFT Power
							</div>
							<div className={style.daoHolderNumber}>
								{ad?.numHolders} holders
							</div>
						</div>

						<div className={style.bidSectionBtnContainer}>
							<div className={`${style.actionBtn}`} onClick={async () => {
								history.push(`/bid/${ad.nftId}`);
							}}>Place an Ad</div>
						</div>
					</div>
				</div>

				{!!ad?.adId && <>
					<div className={style.adSection}>
						<div className={`${style.adSectionArrow} ${style.front}`}></div>
						<div className={`${style.adSectionArrow} ${style.back}`}></div>
						<div className={style.adContent}>
							<div className={style.adDescription}>
								<span className={style.descriptionText}>{ad?.content ?? ad?.description ?? 'View Ads. Get Paid.'}</span>
								{tags?.length > 0 && <span className={style.tags}>
									{tags.map((tag: string, index: number) => <span className='tag' key={index}>#{tag}</span>)}
								</span>}
							</div>
							{ad?.media && <>
								<Spin spinning={claiming} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Claiming...">
									<div className={style.posterSection}>
										<img
											src={ad?.media}
											referrerPolicy='no-referrer'
											className={style.adMediaImg}
										/>

										<div className={`${style.mask} ${adClaimed ? style.pinned : ''}`}>
											<div className={style.infoText}>
												{!adClaimed ? 'You will be rewarded' : 'You have claimed'}
												<Tooltip title="Rewards are calculated based on your DID preference score">
													<span className={style.rewardInfoMark}><i className="fa-solid fa-circle-exclamation"></i></span>
												</Tooltip>
											</div>

											<div className={`${style.rewardRow} ${adClaimed ? style.claimed : ''}`}>
												<div className={`${style.rewardInfo}`} >
													<img referrerPolicy='no-referrer' className={style.kolIcon} src={ad.kolIcon}></img>
													<span className={style.rewardAmount}>
														{/* <span className={style.rewardNumber}>{'300.00'}</span> */}
														<span className={style.rewardToken}>{ad?.assetName} NFT Power</span>
													</span>
												</div>

												{adClaimed && <>
													<div className={style.claimedIcon}>
														<i className="fa-solid fa-circle-check"></i>
													</div>
												</>}
											</div>

											<div className={style.btnContainer}>
												{<>
													{adClaimed && <>
														<div className={`${style.actionBtn} ${style.left}`} onClick={() => {
															history.push(`/swap/${ad.nftId}`);
														}}>Buy more</div>
														<div className={`${style.actionBtn} ${style.right}`} onClick={async () => {
															copy(`${window.location.origin}/ad/?nftId=${ad.nftId}&referrer=${userDid}`)
															notification.success({
																message: 'Referral link copied!'
															})
														}}>Share & Earn more</div>
													</>}

													{!adClaimed && <>
														<>
															<div className={`${style.actionBtn} ${style.left}`} onClick={() => {
																claim(false);
															}}>Claim</div>
															<div className={`${style.actionBtn} ${style.right}`} onClick={() => {
																claim(true);
															}}>Claim & Learn more</div>
														</>
													</>}
												</>}
											</div>
										</div>

										{!(adClaimed) && <>
											<div className={style.hoverHint}>
												<div className={style.hintIcon}>
													<i className="fa-solid fa-arrow-up-right-from-square"></i>
												</div>
											</div>
										</>}
									</div>
								</Spin>

							</>}
						</div>
					</div>
				</>}
			</div>
		</>
	)
};

export default Advertisement;
