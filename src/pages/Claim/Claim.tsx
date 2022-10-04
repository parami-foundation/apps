import React from 'react';
import { useParams } from 'umi';
import ClaimModal from '../Creator/Explorer/components/ClaimModal/ClaimModal';

export interface ClaimProps { }

function Claim({ }: ClaimProps) {
    const {
        adId,
        nftId
    } = useParams() as { adId: string, nftId: string };

    return <>
        {adId && nftId && <ClaimModal
            adId={adId}
            nftId={nftId}
            onClaim={() => window.close()}
            onClose={() => window.close()}
        />}
    </>;
};

export default Claim;
