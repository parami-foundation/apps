import { POST_MESSAGE_PREFIX } from '@/config/constant';
import { parseUrlParams } from '@/utils/url.util';
import React, { useEffect, useState } from 'react';
import { useParams } from 'umi';
import ClaimModal from '../Creator/Explorer/components/ClaimModal/ClaimModal';

export interface ClaimProps { }

function Claim({ }: ClaimProps) {
    const {
        adId,
        nftId
    } = useParams() as { adId: string, nftId: string };
    const [redirect, setRedirect] = useState<string>();

    useEffect(() => {
        const { redirect } = parseUrlParams() as { redirect: string };
        if (redirect) {
            setRedirect(redirect);
        }
    }, []);

    return <>
        {adId && nftId && <ClaimModal
            adId={adId}
            nftId={nftId}
            onClaim={() => {
                window.opener.postMessage(`${POST_MESSAGE_PREFIX.AD_CLAIMED}:${adId}`, '*');
                if (redirect) {
                    window.open(redirect);
                }
                window.close();
            }}
            onClose={() => {
                window.close();
            }}
        />}
    </>;
};

export default Claim;
