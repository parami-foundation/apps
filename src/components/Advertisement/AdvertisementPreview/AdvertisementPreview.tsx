import { Tooltip } from 'antd';
import React, { useState } from 'react';
import './AdvertisementPreview.less';

const AdvertisementPreview: React.FC<{
	ad: any;
	kolIcon?: string;
}> = ({ ad, kolIcon }) => {
	const tags = (ad?.instructions ?? []).map((instruction: any) => instruction.tag).filter(Boolean);

	const sponsorName = ad?.sponsorName ?? 'Parami';
	const abbreviation = sponsorName.length > 15 ? `${sponsorName.slice(0, 6)}...${sponsorName.slice(-6)}` : null;

	const hNFT = (ad?.contractAddress && ad?.tokenId ? <a href={`https://opensea.io/assets/ethereum/${ad.contractAddress}/${ad.tokenId}`} target="_blank">hNFT</a> : 'hNFT');

	const claimInfoMark = (<>
		<div className='ownerInfo'>
			<Tooltip title={<>
				<span>📢 This {hNFT} is reserved.</span>
				<a className='claimLink' href={`/claimHnft/${ad.nftId}`} target='_blank'>I am the owner</a>
			</>}>
				<span className='claimInfoMark'><i className="fa-solid fa-circle-exclamation"></i></span>
			</Tooltip>
		</div>
	</>)

	return (
		<>
			<div className='advertisementContainer'>
				<>
					{claimInfoMark}
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
							<span>is sponsoring this {hNFT}. </span>
							<a className='bidLink' href={`/bid/${ad.nftId}`} target="_blank">Bid on this ad space</a>
						</span>
					</div>

					<div className='adSection'>
						<div className='adSectionArrow front'></div>
						<div className='adSectionArrow back'></div>
						<div className='adContent'>
							<div className='adDescription'>
								<span className='descriptionText'>{ad?.content ?? ad?.description ?? 'View Ads. Get Paid.'}</span>
								{tags?.length > 0 && <span className='tags'>
									{tags.map((tag: string, index: number) => <span className='tag' key={index}>#{tag}</span>)}
								</span>}
							</div>
							{!ad?.poster && <>
								<div className='posterSection'>
									<div className='posterPlaceHolder'>
										please upload your poster
									</div>
								</div>
							</>}

							{ad?.poster && <>
								<div className='posterSection'>
									<img
										src={ad?.poster}
										referrerPolicy='no-referrer'
										className='adMediaImg'
									/>

									<div className={`mask`}>
										<div className='infoText'>
											You will be rewarded
											<Tooltip title="Rewards are calculated based on your DID preference score">
												<span className='rewardInfoMark'><i className="fa-solid fa-circle-exclamation"></i></span>
											</Tooltip>
										</div>

										<div className='rewardRow'>
											<div className={`rewardInfo`}>
												<img referrerPolicy='no-referrer' className='kolIcon' src={kolIcon}></img>
												<span className='rewardAmount'>
													<span className='rewardNumber'>{'300.00'}</span>
													<span className='rewardToken'>{ad?.assetName} NFT Power</span>
												</span>
											</div>
										</div>

										<div className='btnContainer'>
											{<>
												<div className='actionBtn left' onClick={() => {
												}}>Claim</div>
												<div className='actionBtn right' onClick={() => {
												}}>Claim & Learn more</div>
											</>}
										</div>
									</div>

									{<>
										<div className='hoverHint'>
											<div className='hintIcon'>
												<i className="fa-solid fa-arrow-up-right-from-square"></i>
											</div>
										</div>
									</>}
								</div>
							</>}
						</div>
					</div>
				</>

			</div>
		</>
	)
};

export default AdvertisementPreview;
