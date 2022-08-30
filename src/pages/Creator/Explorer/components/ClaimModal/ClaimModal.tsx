import React, { useEffect, useState } from 'react';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Spin } from 'antd';
import style from './ClaimModal.less';
import { GetCurrentScoresOfAd } from '@/services/parami/HTTP';
import { AdScore } from '@/services/parami/typings';

const ClaimModal: React.FC<{
    adId: string;
    nftId: string;
    did: string;
    onClose: () => void;
}> = ({ onClose, adId, nftId, did }) => {
    const [adScores, setAdScores] = useState<AdScore[]>();

    const fetchClaimInfo = async () => {
        // mock api
        setAdScores([
            { tag: 'Telegram', score: '+5' },
            { tag: 'Twitter', score: '-2' },
        ]);
        // try {
        //     const adScores = await GetCurrentScoresOfAd(adId, nftId, did);
        //     setAdScores(adScores);
        // } catch (e) {
        //     console.log(e);
        //     setAdScores([]);
        // }
    }

    useEffect(() => {
        fetchClaimInfo();
    }, []);

    return <>
        <BigModal
            visable
            title="Claim your token"
            content={
                <div className={style.claimInfoContainer}>
                    <Spin spinning={!adScores}>
                        {adScores?.length === 0 && <>
                            The advertiser hasn't assign you any scores. You could still claim your token.
                        </>}

                        {adScores && adScores?.length > 0 && <>
                            <p>Claim now and receive the following scores from the advertiser:</p>
                            {adScores.map(adScore => {
                                return <p>{`${adScore.score} on ${adScore.tag}`}</p>
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
                    disabled={!adScores}
                >Claim</Button>
            </>}
            close={() => onClose()}
        />
    </>;
};

export default ClaimModal;
