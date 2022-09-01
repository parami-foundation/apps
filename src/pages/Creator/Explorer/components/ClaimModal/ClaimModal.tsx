import React, { useEffect, useState } from 'react';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, notification, Spin } from 'antd';
import style from './ClaimModal.less';
import { GetCurrentScoresOfAd } from '@/services/parami/HTTP';
import { AdScoreInfo } from '@/services/parami/typings';
import { didToHex } from '@/utils/common';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { ClaimAdToken } from '@/services/parami/Advertisement';
import { useIntl, useModel } from 'umi';

const ClaimModal: React.FC<{
    adId: string;
    nftId: string;
    onClose: () => void;
    onClaim: () => void;
}> = ({ onClose, adId, nftId, onClaim }) => {
    const [adScore, setAdScore] = useState<AdScoreInfo>();
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const { wallet } = useModel('currentUser');

    const intl = useIntl();

    const fetchClaimInfo = async () => {
        try {
            const { response, data } = await GetCurrentScoresOfAd(adId, nftId, wallet?.did);
            if (response.ok) {
                setAdScore(data as AdScoreInfo);
            } else {
                setAdScore({} as AdScoreInfo);
            }
        } catch (e) {
            console.log(e);
            setAdScore({} as AdScoreInfo);
        }
    }

    useEffect(() => {
        fetchClaimInfo();
    }, []);

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
            const scores = (adScore!.scores ?? []).map(score => [score.tag, score.score]);
            console.log('scores', scores);
            const info: any = await ClaimAdToken(adId, nftId, wallet?.did, scores, adScore!.referer, adScore!.signature, adScore!.signer_account, passphrase, wallet.keystore, preTx, account);

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
                        {adScore && !adScore?.scores && <>
                            The advertiser hasn't assign you any scores. You could still claim your token.
                        </>}

                        {adScore && adScore.scores && adScore.scores.length > 0 && <>
                            <p>Claim now and receive the following scores from the advertiser:</p>
                            {adScore.scores.map(score => {
                                return <p>{`${score.score} on ${score.tag}`}</p>
                            })}
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
                    disabled={!adScore?.signature}
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
