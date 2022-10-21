import React, { useCallback, useEffect, useState } from 'react';
import './AdvertisementPreview.less';

const AdvertisementPreview: React.FC<{
	ad: any;
}> = ({ ad }) => {

	const [showInstructions, setShowInstructions] = useState<boolean>(false);
	const [closePopoverTimeout, setClosePopoverTimeout] = useState<any>();
	const [claimText, setClaimText] = useState<string>('Not interested, claim it now');

	const tags = (ad?.instructions ?? []).map((instruction: any) => instruction.tag).filter(Boolean);

	const openInstructionPopover = useCallback(() => {
		// clear timeout
		if (closePopoverTimeout) {
			clearTimeout(closePopoverTimeout);
			setClosePopoverTimeout(null);
		}
		// open popover
		setShowInstructions(true);
	}, [closePopoverTimeout]);

	const delayCloseInstructionPopover = () => {
		const timeout = setTimeout(() => {
			setShowInstructions(false);
		}, 200);
		setClosePopoverTimeout(timeout);
	}

	return (
		<>
			<div className='advertisementContainer'>
				<div className='ownerInfo'>
					<span>📢 This hNFT is reserved.</span>
					<a className='claimLink' href="" target='_blank'>I am the owner</a>
				</div>
				<div className='sponsorInfo'>
					{ad?.icon && <img referrerPolicy='no-referrer' className='sponsorIcon' src={ad?.icon}></img>}
					<span className='sponsorText'><span className='sponsorName'>{`${(ad?.sponsorName ?? 'Parami').slice(0, 30)}`}</span>is sponsoring this hNFT</span>
					<div className='bidBtn' onClick={() => { }}>BID</div>
				</div>
				{ad?.poster && <img
					src={ad?.poster}
					referrerPolicy='no-referrer'
					className='adMediaImg'
				/>}
				{!ad?.poster && <div className='posterPlaceHolder'>Your poster goes here</div>}

				<div className='adDescription'>
					<span className='descriptionText'>{ad?.content ?? 'View Ads. Get Paid.'}</span>
					{tags?.length > 0 && <span className='tags'>
						{tags.map((tag: string, index: number) => <span className='tag' key={index}>#{tag}</span>)}
					</span>}
				</div>

				<div className='claimSection'>
					<div className='infoText'>Due to your Preference Score you are rewarded:</div>
					<div className='rewardRow'>
						<div className='rewardInfo'>
							<img referrerPolicy='no-referrer' className='kolIcon' src={'/images/logo-round-core.svg'}></img>
							<span className='rewardAmount'>
								<span className='rewardNumber'>{'300.00'}</span>
								<span className='rewardToken'>{ad?.assetName} NFT Power</span>
							</span>
						</div>
						<div className='buttons'>
							<>
								<div className='claimBtn actionBtn' onMouseEnter={openInstructionPopover} onMouseLeave={delayCloseInstructionPopover}>Claim</div>
								<div className='instructionsBtn actionBtn' onClick={() => { }}>Buy more</div>
							</>
						</div>
					</div>
				</div>

				{showInstructions && <div className='instructions' onMouseEnter={openInstructionPopover} onMouseLeave={delayCloseInstructionPopover}>
					<div className='popoverArrow'></div>
					<div className='popoverContent'>
						<div className='instructionTitle'>Follow the tips below if you are interested</div>
						{ad?.instructions?.length > 0 && <>
							{ad.instructions.map((instruction: any, index: number) => {
								return (
									<div className='instruction' onClick={() => {
										setClaimText('Claim');
									}}>
										<span className='instructionText'>{instruction.text}</span>
										<span className='instructionTag'>#{instruction.tag}</span>
										<span className='instructionScore'>+{instruction.score}</span>
									</div>
								);
							})}
						</>}
						<div className='instructionClaimBtnContainer'>
							<div className='instructionClaimBtn actionBtn' onClick={() => { }}>{claimText}</div>
						</div>
					</div>
				</div>}
			</div>
		</>
	)
};

export default AdvertisementPreview;
