import TwitterLoginButton from '@/components/TwitterLoginButton/TwitterLoginButton';
import { ApplyClaimHNFT } from '@/services/parami/HTTP';
import { parseUrlParams } from '@/utils/url.util';
import { notification, Result, Typography, Image } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import style from './ClaimHNFT.less';

const { Title } = Typography;

export interface ClaimHNFTProps { }

function ClaimHNFT({ }: ClaimHNFTProps) {

    const { wallet } = useModel('currentUser');
    const [claimResult, setClaimResult] = useState<{status: ResultStatusType; title: string; subTitle?: string, canRetry: boolean}>();

    const claimHnft = async (code: string) => {
        notification.info({
            message: 'Claiming your HNFT...'
        })
        const { data, response } = await ApplyClaimHNFT({ ticket: { code: code }, did: wallet.did, site: 'Twitter' });
        if (response.status === 401) {
            setClaimResult({
                status: 'error',
                title: 'Claim Error',
                subTitle: data,
                canRetry: true
            });
            return;
        }

        if (response.status === 202) {
            setClaimResult({
                status: 'info',
                title: data,
                canRetry: false
            });
            return;
        }

        if (response.status === 200) {
            setClaimResult({
                status: 'success',
                title: data,
                subTitle: 'Your request for claiming HNFT has been submitted and we will process your request ASAP.',
                canRetry: false
            });
            return;
        }

        setClaimResult({
            status: 'error',
            title: 'Unknown Error',
            subTitle: 'Please retry later.',
            canRetry: true
        });
    }

    useEffect(() => {
        const params = parseUrlParams() as { code: string };
        if (params.code) {
            claimHnft(params.code)
        }
    }, []);

    return <div className={style.claimContainer}>
        <div className={style.content}>
            <div className={style.titleContainer}>
                <Title
                    level={1}
                    className={style.sectionTitle}
                >
                    <Image
                        src='/images/icon/diamond.svg'
                        className={style.sectionIcon}
                        preview={false}
                    />
                    Claim Your HNFT
                </Title>
            </div>
            <div className={style.subtitle}>
                Signin Twitter and claim your HNFT
            </div>
            {claimResult && <>
                <Result
                    status={claimResult.status}
                    title={claimResult.title}
                    subTitle={claimResult.subTitle}
                ></Result>
            </>}
            {(!claimResult || claimResult.canRetry) && <>
                <div className={style.btnContainer}>
                    <TwitterLoginButton state='claimHnft' buttonText='Authorize and claim'></TwitterLoginButton>
                </div>
            </>}
        </div>
    </div>;
};

export default ClaimHNFT;
