import React, { useEffect, useState } from 'react';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, notification, Spin } from 'antd';
import style from './ClaimModal.less';
import { GetCurrentScoresOfAd } from '@/services/parami/HTTP';
import { AdScoreInfo } from '@/services/parami/typings';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { ClaimAdToken, ClaimAdTokenWithoutSignature } from '@/services/parami/Advertisement';
import { useIntl, useModel } from 'umi';
import { GetTagsOfAd } from '@/services/parami/Tag';
import ParamiScoreTag from '../ParamiScoreTag/ParamiScoreTag';
import ParamiScore from '../ParamiScore/ParamiScore';

const ClaimModal: React.FC<{
    adId: string;
    nftId: string;
    referrer?: string;
    onClose: () => void;
    onClaim: () => void;
}> = ({ onClose, adId, nftId, referrer = null, onClaim }) => {
    const [adScore, setAdScore] = useState<AdScoreInfo>();
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const { wallet } = useModel('currentUser');
    const apiWs = useModel('apiWs');

    const intl = useIntl();

    const setDefaultScores = async () => {
        const tags = await GetTagsOfAd(adId);

        setAdScore({
            scores: (tags ?? []).map(tag => ({
                tag: tag.name,
                score: -5
            }))
        } as AdScoreInfo);
    }

    const fetchClaimInfo = async () => {
        try {
            const { response, data } = await GetCurrentScoresOfAd(adId, nftId, wallet?.did);
            if (response.ok) {
                setAdScore(data as AdScoreInfo);
            } else {
                setDefaultScores();
            }
        } catch (e) {
            console.log(e);
            setDefaultScores();
        }
    }

    useEffect(() => {
        if (apiWs) {
            fetchClaimInfo();
        }
    }, [apiWs]);

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
            let info: any;
            const scores = (adScore!.scores ?? []).map(score => [score.tag, score.score]);

            if (adScore && adScore.signature) {
                info = await ClaimAdToken(adId, nftId, wallet?.did, scores, adScore!.referer, adScore!.signature, adScore!.signer_account, passphrase, wallet.keystore, preTx, account);
            } else {
                info = await ClaimAdTokenWithoutSignature(adId, nftId, scores, referrer, passphrase, wallet.keystore, preTx, account);
            }

            if (preTx && account) {
                return info;
            }

            notification.success({
                message: 'Claim Token Success'
            });

            onClaim();
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
                <div className={style.claimInfoContainer}>
                    <Spin spinning={!adScore}>
                        {adScore && adScore.scores && adScore.scores.length > 0 && <>
                            <p>Claim now and have your score updated:</p>
                            {adScore.scores.map(score => {
                                return <div className={style.scoreChange}>
                                    <ParamiScoreTag tag={score.tag} />
                                    <ParamiScore score={parseInt(score.score, 10)} />
                                </div>
                            })}
                            {!adScore.signature && <p>
                                Not happy with the reward? Follow the instructions before claiming.
                            </p>}
                        </>}
                    </Spin>
                </div>
            }
            footer={<>
                <Button
                    block
                    type='primary'
                    shape='round'
                    size='large'
                    disabled={!adScore}
                    onClick={() => setSecModal(true)}
                >Claim</Button>
            </>}
            close={() => onClose()}
        />

        <SecurityModal
            visable={secModal}
            setVisable={setSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={claim}
        ></SecurityModal>
    </>;
};

export default ClaimModal;
