import { Tooltip } from 'antd';
import React, { useState } from 'react';
import './AdvertisementPreview.less';
import bubble from './bubble.svg';

const AdvertisementPreview: React.FC<{
	ad: any;
	kolIcon?: string;
}> = ({ ad, kolIcon }) => {
	const [claimText, setClaimText] = useState<string>('Not interested, claim it now');
	const [claimed, setClaimed] = useState<boolean>(false);

	const tags = (ad?.instructions ?? []).map((instruction: any) => instruction.tag).filter(Boolean);

	const sponsorName = ad?.sponsorName ?? 'Parami';
	const abbreviation = sponsorName.length > 15 ? `${sponsorName.slice(0, 6)}...${sponsorName.slice(-6)}` : null;

	return (
		<>
			<div className='advertisementContainer'>
				<>
					<div className='ownerInfo'>
						<span>📢 This hNFT is reserved.</span>
						<a className='claimLink' href={``} target='_blank'>I am the owner</a>
					</div>
					<div className='sponsorInfo'>
						{ad?.icon && <img referrerPolicy='no-referrer' className='sponsorIcon' src={ad?.icon}></img>}
						<span className='sponsorText'>
							{!!abbreviation && <>
								<Tooltip title={sponsorName}>
									<span className='sponsorName'>
										{abbreviation}
									</span>
								</Tooltip>
							</>}
							{!abbreviation && <>
								<span className='sponsorName'>
									{sponsorName}
								</span>
							</>}
							<span>is sponsoring this hNFT. </span>
							<a className='bidLink' href={``} target="_blank">Bid on this ad space</a>
						</span>
					</div>
					<div className='adSection'>
						<img className='adBubble' src={bubble}></img>
						<div className='adContent'>
							<div className='adDescription'>
								<span className='descriptionText'>{ad?.content ?? 'View Ads. Get Paid.'}</span>
								{tags?.length > 0 && <span className='tags'>
									{tags.map((tag: string, index: number) => <span className='tag' key={index}>#{tag}</span>)}
								</span>}
							</div>
							{!!ad?.poster && <>
								<img
									src={ad?.poster}
									referrerPolicy='no-referrer'
									className='adMediaImg'
								/>
							</>}
							{!ad?.poster && <div className='posterPlaceHolder'>Your poster goes here</div>}
						</div>
					</div>

					<div className='divider'></div>

					{<div className='claimSection'>
						<div className='infoText'>{
							'Due to your Preference Score you are rewarded:'
						}</div>

						<div className='rewardRow'>
							<div className='rewardInfo'>
								<img referrerPolicy='no-referrer' className='kolIcon' src={kolIcon ?? '/images/logo-round-core.svg'}></img>
								<span className='rewardAmount'>
									<span className='rewardNumber'>{'300.00'}</span>
									<span className='rewardToken'>{ad?.assetName} NFT Power</span>
								</span>
							</div>
						</div>

						{claimed && <>
							<div className='btnContainer'>
								<div className='actionBtnBig left' onClick={async () => {
									window.open(`https://twitter.com/intent/tweet?text=Hundreds of Celebrity NFT Powers awaits you to FREE claim! Install and GemHunt on Twitter HERE ❤️ @ParamiProtocol&url=https://chrome.google.com/webstore/detail/parami-hyperlink-nft-exte/gilmlbeecofjmogfkaocnjmbiblmifad`);
								}}>Share</div>
								<div className='actionBtnBig right' onClick={() => window.open(`/swap/${ad.nftId}`)}>Sponsor this influencer</div>
							</div>
						</>}

						{!claimed && <>
							{ad?.instructions?.length > 0 && <>
								<div className='instructionSection'>
									<div className='instructionTitle'>Follow the tips below if you are interested</div>
									{ad.instructions.map((instruction: any, index: number) => {
										return (
											<div className='instruction' onClick={() => {
												!!instruction.link && window.open(`https://weekly.parami.io?redirect=${instruction.link}&nftId=${ad.nftId}`);
												setClaimText('Claim');
											}} key={index}>
												<span className='instructionText'>{instruction.text}</span>
												<span className='instructionTag'>#{instruction.tag}</span>
												<span className='instructionScore'>+{instruction.score}</span>
											</div>
										);
									})}
								</div>
							</>}

							<div className='btnContainer'>
								<div className='actionBtnBig' onClick={() => {
									setClaimed(true);
								}}>{claimText}</div>
							</div>
						</>}
					</div>}
				</>

			</div>
		</>
	)
};

export default AdvertisementPreview;
