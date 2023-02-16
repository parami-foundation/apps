import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Input, notification } from 'antd';
import style from './IdoModal.less';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import Token from '@/components/Token/Token';
import AD3 from '@/components/Token/AD3';
import { parseAmount } from '@/utils/common';
import { AddLiquidity, CreateSwap } from '@/services/parami/Swap';

export interface IdoModalProps {
    nftId: string;
    onClose: () => void;
    onIDO: () => void;
    symbol: string;
    swapMetadata?: any;
}

function IdoModal({ nftId, onClose, onIDO, symbol, swapMetadata }: IdoModalProps) {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const { balance } = useModel('balance');
    const [passphrase, setPassphrase] = useState<string>('');
    const [createSwapSecModal, setCreateSwapSecModal] = useState<boolean>(false);
    const [addLiquiditySecModal, setAddLiquiditySecModal] = useState<boolean>(false);
    const [tokenAmount, setTokenAmount] = useState<string>();
    const [ad3Amount, setAd3Amount] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [tokenBalance, setTokenBalance] = useState<string>('');

    const queryTokenBalance = async (nftId: string, account: string) => {
        const res = await apiWs?.query.assets.account(nftId, account) as any;
        const { balance = '' } = res.toHuman() ?? {};
        setTokenBalance(balance);
    }

    useEffect(() => {
        if (nftId && wallet && apiWs) {
            queryTokenBalance(nftId, wallet.account)
        }
    }, [nftId, wallet, apiWs])

    const handleAddLiquidity = async (preTx?: boolean, account?: string) => {
        setLoading(true);
        try {
            const info = await AddLiquidity(nftId, parseAmount(ad3Amount!), parseAmount(ad3Amount!), parseAmount(tokenAmount!), passphrase, wallet?.keystore, preTx, account)
            if (preTx && account) {
                return info;
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

    const handleCreateSwap = async (preTx?: boolean, account?: string) => {
        setLoading(true);
        try {
            const info = await CreateSwap(nftId, passphrase, wallet?.keystore, preTx, account);
            if (preTx && account) {
                return info;
            }
            setAddLiquiditySecModal(true)
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
            title={'Add Liquidity'}
            content={<>
                <div className={style.form}>
                    <div className={style.field}>
                        <div className={style.label}>
                            <span>SIT Amount</span>
                            <span>
                                available: <Token value={tokenBalance} symbol={symbol}></Token>
                            </span>
                        </div>
                        <div className={style.value}>
                            <Input
                                className={style.input}
                                onChange={(a) => { setTokenAmount(a.target.value) }}
                            />
                        </div>
                    </div>

                    <div className={style.field}>
                        <div className={style.label}>
                            <span>AD3 Amount</span>
                            <span>
                                available: <AD3 value={balance?.free}></AD3>
                            </span>
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
                        swapMetadata ? setAddLiquiditySecModal(true) : setCreateSwapSecModal(true);
                    }}
                >
                    Add Liquidity
                </Button>
            </>}
            close={() => onClose()}
        ></BigModal>

        <SecurityModal
            visable={addLiquiditySecModal}
            setVisable={setAddLiquiditySecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={handleAddLiquidity}
        />

        <SecurityModal
            visable={createSwapSecModal}
            setVisable={setCreateSwapSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={handleCreateSwap}
        />
    </>;
};

export default IdoModal;
