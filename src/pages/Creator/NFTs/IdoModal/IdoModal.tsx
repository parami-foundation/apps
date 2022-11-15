import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Input, notification } from 'antd';
import style from './IdoModal.less';
import React, { useState } from 'react';
import { useModel } from 'umi';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { IDO } from '@/services/parami/NFT';

export interface IdoModalProps {
    nftId: string;
    onClose: () => void;
    onIDO: () => void;
}

function IdoModal({ nftId, onClose, onIDO }: IdoModalProps) {
    const { wallet } = useModel('currentUser');
    const [passphrase, setPassphrase] = useState<string>('');
    const [secModal, setSecModal] = useState<boolean>(false);
    const [tokenAmount, setTokenAmount] = useState<string>();
    const [ad3Amount, setAd3Amount] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleIDO = async (preTx?: boolean, account?: string) => {
        setLoading(true);
        try {
            const info = await IDO(nftId, tokenAmount!, ad3Amount!,  passphrase, wallet?.keystore, preTx, account);
            if (preTx && account) {
                return info
            }
            setLoading(false);
            onIDO();
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
            title={'IDO'}
            content={<>
                <div className={style.form}>
                    <div className={style.field}>
                        <div className={style.title}>
                            NFT Power Amount
                        </div>
                        <div className={style.value}>
                            <Input
                                autoFocus
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
                                autoFocus
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
                    Mint
                </Button>
            </>}
            close={() => onClose()}
        ></BigModal>

        <SecurityModal
            visable={secModal}
            setVisable={setSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={handleIDO}
        />
    </>;
};

export default IdoModal;
