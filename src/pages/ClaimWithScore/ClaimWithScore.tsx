import { POST_MESSAGE_PREFIX } from '@/config/constant';
import React from 'react';
import { useParams } from 'umi';
import ClaimModal from '../Creator/Explorer/components/ClaimModal/ClaimModal';

function ClaimWithScore() {
    const {
        adId,
        nftId
    } = useParams() as { adId: string, nftId: string };

    return <>
        {adId && nftId && <ClaimModal
            adId={adId}
            nftId={nftId}
            onClaim={() => {
                window.opener.postMessage(`${POST_MESSAGE_PREFIX.AD_CLAIMED}:${adId}`, '*');
                window.close();
            }}
            onClose={() => {
                window.close();
            }}
        />}
    </>;
};

export default ClaimWithScore;
