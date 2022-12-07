import { AD_DATA_TYPE } from '@/config/constant';
import { Tooltip } from 'antd';
import React from 'react';
import AdBubble from '../AdBubble/AdBubble';
import './AdvertisementPreview.less';

const AdvertisementPreview: React.FC<{
	ad: any;
	kolIcon?: string;
}> = ({ ad, kolIcon }) => {
	const adBubble = {
		...ad,
		kolIcon: ad.kolIcon ?? kolIcon,
		tag: ad.tag ?? (ad?.instructions && ad?.instructions[0] && ad?.instructions[0].tag),
		poster: ad.poster ?? ad.media
	}

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
							{ad.type === AD_DATA_TYPE.AD && <>
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
							</>}

							{ad.type === AD_DATA_TYPE.CLOCK_IN && <>
								<span>{ad?.assetName} NFT Power </span>
							</>}
							<a className='bidLink' href={`/bid/${ad.nftId}`} target="_blank">Bid on this ad space</a>
						</span>
					</div>

					<AdBubble ad={adBubble} preview></AdBubble>
				</>
			</div>
		</>
	)
};

export default AdvertisementPreview;
