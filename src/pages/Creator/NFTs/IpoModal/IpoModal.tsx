import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Input, notification } from 'antd';
import style from './IpoModal.less';
import React, { useState } from 'react';
import { useModel } from 'umi';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { IDO, StartICO } from '@/services/parami/NFT';
import { parseAmount } from '@/utils/common';

export interface IdoModalProps {
    nftId: string;
    onClose: () => void;
    onIPO: () => void;
}

function IpoModal({ nftId, onClose, onIPO }: IdoModalProps) {
    const { wallet } = useModel('currentUser');
    const [passphrase, setPassphrase] = useState<string>('');
    const [secModal, setSecModal] = useState<boolean>(false);
    const [tokenAmount, setTokenAmount] = useState<string>();
    const [ad3Amount, setAd3Amount] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleIPO = async (preTx?: boolean, account?: string) => {
        setLoading(true);
        try {
            const info = await StartICO(nftId, parseAmount(ad3Amount!), parseAmount(tokenAmount!), passphrase, wallet?.keystore, preTx, account);
            if (preTx && account) {
                return info
            }
            setLoading(false);
            onIPO();
        } catch (e: any) {
            notification.error({
                message: e.message,
                duration: null,
            });
            setLoading(false);
        }
    }

    return <>
        <BigModal
            visable
            title={'Initial NFT Power Offering'}
            content={<>
                <div className={style.form}>
                    <div className={style.field}>
                        <div className={style.title}>
                            NFT Power Amount
                        </div>
                        <div className={style.value}>
                            <Input
                                className={style.input}
                                onChange={(a) => { setTokenAmount(a.target.value) }}
                            />
                        </div>
                    </div>

                    <div className={style.field}>
                        <div className={style.title}>
                            AD3 Amount
                        </div>
                        <div className={style.value}>
                            <Input
                                className={style.input}
                                onChange={(a) => { setAd3Amount(a.target.value) }}
                            />
                        </div>
                    </div>
                </div>
            </>}
            footer={<>
                <Button
                    block
                    type="primary"
                    shape="round"
                    size="large"
                    loading={loading}
                    disabled={!tokenAmount || !ad3Amount}
                    onClick={() => {
                        setSecModal(true);
                    }}
                >
                    Start IPO
                </Button>
            </>}
            close={() => onClose()}
        ></BigModal>

        <SecurityModal
            visable={secModal}
            setVisable={setSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={handleIPO}
        />
    </>;
};

export default IpoModal;
