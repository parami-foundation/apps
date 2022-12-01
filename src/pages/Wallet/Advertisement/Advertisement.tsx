import React, { useEffect, useState } from 'react';
import style from './Advertisement.less';
import { history } from 'umi';
import AdBubble from '@/components/Advertisement/AdBubble/AdBubble';

const Advertisement: React.FC<{
	ad: any;
	userDid?: string;
}> = ({ ad, userDid }) => {
	return (
		<>
			<div className={style.advertisementContainer}>
				<div className={style.bidSection}>
					<div className={style.daoInfo}>
						<img referrerPolicy='no-referrer' className={style.kolIcon} src={ad.kolIcon}></img>
						<div className={style.daoInfoText}>
							<div className={style.daoToken} onClick={() => {
								history.push(`/swap/${ad.nftId}`)
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
					<AdBubble ad={ad} userDid={userDid}></AdBubble>
				</>}
			</div>
		</>
	)
};

export default Advertisement;
