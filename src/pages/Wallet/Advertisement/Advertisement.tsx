import React, { useEffect, useState } from 'react';
import style from './Advertisement.less';
import { history, useModel } from 'umi';
import AdBubble from '@/components/Advertisement/AdBubble/AdBubble';
import { GetBalanceOfAsset } from '@/services/parami/Assets';
import Token from '@/components/Token/Token';
import { AD_DATA_TYPE } from '@/config/constant';
import LotteryBubble from '@/components/Advertisement/LotteryBubble/LotteryBubble';

const Advertisement: React.FC<{
	ad: any;
	userDid?: string;
}> = ({ ad, userDid }) => {
	const { wallet } = useModel('currentUser');
	const [balance, setBalance] = useState<string>('');

	useEffect(() => {
		if (ad && wallet) {
			GetBalanceOfAsset(ad.nftId, wallet.account).then(res => setBalance(res));
		}
	}, [ad, wallet])

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

						<div className={style.tokenBalance}>
							<div className={style.balanceText}>
								<Token value={balance} symbol={ad.symbol}></Token>
							</div>

							<div className={style.bidBtn} onClick={async () => {
								history.push(`/bid/${ad.nftId}`);
							}}>
								Place an Ad
							</div>
						</div>
					</div>
				</div>

				{ad.type === AD_DATA_TYPE.AD && <>
					<AdBubble ad={ad} userDid={userDid}></AdBubble>
				</>}

				{ad.type === AD_DATA_TYPE.LOTTERY && <>
					<LotteryBubble ad={ad}></LotteryBubble>
				</>}
			</div>
		</>
	)
};

export default Advertisement;
