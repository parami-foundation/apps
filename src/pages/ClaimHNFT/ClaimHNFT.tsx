import TwitterLoginButton from '@/components/TwitterLoginButton/TwitterLoginButton';
import { parseUrlParams } from '@/utils/url.util';
import React, { useEffect } from 'react';
import style from './ClaimHNFT.less';

export interface ClaimHNFTProps {}

function ClaimHNFT({ }: ClaimHNFTProps) {

    const claimHnft = async (code: string) => {
        console.log('claiming...', code);
    }

    useEffect(() => {
        const params = parseUrlParams() as {code: string};
        if (params.code) {
            claimHnft(params.code)
        }
    }, []);

    return <div className={style.claimContainer}>
        <TwitterLoginButton state='claimHnft' buttonText='Authorize and claim'></TwitterLoginButton>
    </div>;
};

export default ClaimHNFT;
