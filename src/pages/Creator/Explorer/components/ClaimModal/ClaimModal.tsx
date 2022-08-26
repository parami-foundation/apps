import React, { useEffect, useState } from 'react';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Spin } from 'antd';
import style from './ClaimModal.less';

const ClaimModal: React.FC<{
    onClose: () => void
}> = ({ onClose }) => {

    const [claimInfo, setClaimInfo] = useState<any>();

    const fetchClaimInfo = async () => {
        setClaimInfo('Claim your token now and receive +3 parami score on Telegram tag.');
    }

    useEffect(() => {
        setTimeout(() => {
            fetchClaimInfo();
        }, 2000);
    }, []);

    return <>
        <BigModal
            visable
            title="Claim your token"
            content={
                <div className={style.claimInfoContainer}>
                    <Spin spinning={!claimInfo}>
                        {claimInfo}
                    </Spin>
                </div>
            }
            footer={<>
                <Button
                    block
                    type='primary'
                    shape='round'
                    size='large'
                    disabled={!claimInfo}
                >Claim</Button>
            </>}
            close={() => onClose()}
        />
    </>;
};

export default ClaimModal;
