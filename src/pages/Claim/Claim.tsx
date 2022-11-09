import BigModal from '@/components/ParamiModal/BigModal';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import config from '@/config/config';
import { POST_MESSAGE_PREFIX } from '@/config/constant';
import { ClaimAdTokenWithoutSignature } from '@/services/parami/Advertisement';
import { RateScore } from '@/services/parami/HTTP';
import { parseUrlParams } from '@/utils/url.util';
import { notification, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, useModel, useParams } from 'umi';
import style from './Claim.less';

export interface ClaimProps { }

function Claim({ }: ClaimProps) {
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const { wallet } = useModel('currentUser');
    const apiWs = useModel('apiWs');
    const intl = useIntl();
    const {
        adId,
        nftId
    } = useParams() as { adId: string, nftId: string };
    const [adInstruction, setAdInstruction] = useState<{ tag?: string, score?: number, link?: string }>();
    const [redirect, setRedirect] = useState<string>();
    const [adClaimed, setAdClaimed] = useState<boolean>(false);

    const close = () => {
        window.opener.postMessage(`${POST_MESSAGE_PREFIX.AD_CLAIMED}:${adId}`, '*');
        window.close();
    }

    useEffect(() => {
        if (adClaimed) {
            if (!redirect) {
                close();
            } else if (adInstruction) {
                adInstruction.tag && adInstruction.score && RateScore(adId, wallet.did, { tag: adInstruction.tag, score: adInstruction.score });
                adInstruction.link && window.open(decodeURIComponent(adInstruction.link));
                close();
            }
        }
    }, [adClaimed, redirect, adInstruction]);

    const queryAd = async (adId: string) => {
        try {
            const adMetadata = (await apiWs?.query.ad.metadata(adId))?.toHuman() as any;
            const hash = adMetadata?.metadata?.substring(7);
            const res = await fetch(config.ipfs.endpoint + hash);
            const adJson = await res.json();

            setAdInstruction(adJson.instructions[0]);
        } catch (_e) {
            setAdInstruction({});
        }
    }

    useEffect(() => {
        if (adId && apiWs) {
            queryAd(adId);
        }
    }, [adId, apiWs]);

    useEffect(() => {
        const { redirect } = parseUrlParams() as { redirect: string };
        if (redirect) {
            setRedirect(redirect);
        }
    }, []);

    useEffect(() => {
        if (apiWs && wallet) {
            setSecModal(true);
        }
    }, [apiWs, wallet]);

    const claim = async (preTx?: boolean, account?: string) => {
        if (!wallet?.keystore) {
            notification.error({
                key: 'accessDenied',
                message: intl.formatMessage({
                    id: 'error.accessDenied',
                }),
                duration: null,
            });
            return;
        }

        try {
            await ClaimAdTokenWithoutSignature(adId, nftId, null, null, passphrase, wallet.keystore, preTx, account);

            notification.success({
                message: 'Claim Token Success'
            });

            setAdClaimed(true);
        } catch (e) {
            console.log(e);
            notification.error({
                message: 'Claim Ad Token Error',
                description: `${e}`,
            });
        }
    }

    return <>
        <BigModal
            visable
            title="Claim your token"
            content={
                <div className={style.container}>
                    <Spin></Spin>
                </div>
            }
            footer={null}
            close={() => {
                window.close();
            }}
        ></BigModal>

        <SecurityModal
            visable={secModal}
            setVisable={setSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            directSubmit={true}
            func={claim}
        ></SecurityModal>
    </>;
};

export default Claim;
