import React from 'react';
import { AdBubbleVO } from '../AdBubble/AdBubble';
import Bubble from '../Bubble/Bubble';
import style from './LotteryBubble.less'
import {history} from 'umi';

export interface LotteryBubbleProps {
    ad: AdBubbleVO;
}

function LotteryBubble({ ad }: LotteryBubbleProps) {
    return <>
        <Bubble>
            <div className={style.lotteryInfo}>
                <div className={style.description}>
                    You have a chance to win {ad.rewardAmount} {ad.assetName} NFT power!
                </div>
                <div className={style.btn} onClick={async () => {
                    history.push(`/lottery/?nftId=${ad.nftId}`);
                }}>Try it</div>
            </div>
        </Bubble>
    </>;
};

export default LotteryBubble;
