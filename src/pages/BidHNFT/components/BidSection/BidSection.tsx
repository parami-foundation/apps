import FormErrorMsg from '@/components/FormErrorMsg';
import FormFieldTitle from '@/components/FormFieldTitle';
import Token from '@/components/Token/Token';
import { Asset } from '@/services/parami/typings';
import { stringToBigInt } from '@/utils/common';
import { Button, InputNumber, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import style from './BidSection.less';
import { BigIntToFloatString, deleteComma, FloatStringToBigInt } from '@/utils/format';
import { useModel } from 'umi';
import { GetSlotOfNft } from '@/services/parami/Advertisement';
import { GetBalanceOfBudgetPot } from '@/services/parami/Assets';
import { VoidFn } from '@polkadot/api/types';
import SwapAsset from '@/components/SwapAsset/SwapAsset';

export interface BidSectionProps {
    asset?: Asset;
    formValid: boolean;
    onBid: (price: number) => void
}

function BidSection({ asset, onBid, formValid }: BidSectionProps) {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const [currentPrice, setCurrentPrice] = useState<string>('');
    const [price, setPrice] = useState<number>();
    const [priceErrorMsg, setPriceErrorMsg] = useState<{ type: string; msg: string } | undefined>();
    const [minPrice, setMinPrice] = useState<number>();
    const [assetBalance, setAssetBalance] = useState<string>('');
    const [assetBalanceUnsub, setAssetBalanceUnsub] = useState<VoidFn>();
    const [swapTokenModal, setSwapTokenModal] = useState<boolean>();

    useEffect(() => {
        return assetBalanceUnsub;
    }, [assetBalanceUnsub]);

    const getCurrentBudgetBalance = async (nftId: string) => {
        const slot = await GetSlotOfNft(nftId);

        if (!slot) {
            return '0';
        }

        const budget = await GetBalanceOfBudgetPot(slot.budgetPot, slot.fractionId);
        if (!budget) {
            return '0';
        }

        return deleteComma(budget.balance);
    }

    const queryAdBudget = async () => {
        const budgetBalance = await getCurrentBudgetBalance(asset!.id);
        setCurrentPrice(budgetBalance); // todo: refresh current price after bid

        const minPrice = Math.ceil(Math.max(Number(BigIntToFloatString(deleteComma(budgetBalance), 18)) * 1.2, 1));
        setMinPrice(minPrice);
        setPrice(minPrice);

        subscribeAssetBalance(asset!.id);
    }

    const subscribeAssetBalance = async (assetId: string) => {
        const unsub = await apiWs!.query.assets.account(Number(assetId), wallet.account, (res) => {
            const { balance } = res.toHuman() ?? { balance: '' };
            setAssetBalance(deleteComma(balance));
        });
        setAssetBalanceUnsub(() => unsub);
    }

    useEffect(() => {
        if (asset && apiWs) {
            queryAdBudget();
        }
    }, [asset, apiWs])

    useEffect(() => {
        setPriceErrorMsg(undefined);
        if (price !== undefined) {
            if (minPrice && price < minPrice) {
                setPriceErrorMsg({ type: 'price', msg: 'price too low' });
            } else if (FloatStringToBigInt(`${price}`, 18) > stringToBigInt(assetBalance)) {
                setPriceErrorMsg({ type: 'balance', msg: 'Insufficient Balance, please swap more token' });
            }
        }
    }, [price, assetBalance, minPrice]);

    return <>
        <div className={style.bidSectionContainer}>
            <div className={style.currentPrice}>
                <div className={style.currentPriceTitle}>
                    <FormFieldTitle title={'Current Price'} />
                </div>
                <div className={style.currentPriceValue}>
                    <Token value={currentPrice ?? ''} symbol={asset?.symbol} />
                </div>
            </div>

            <div className={style.priceField}>
                <div className={style.priceFieldTitle}>
                    Offer a price
                </div>
                <small>
                    {`≥ ${minPrice}`}
                </small>
                <div className={style.value}>
                    <InputNumber
                        value={price}
                        className={`${style.withAfterInput} ${priceErrorMsg ? style.inputError : ''}`}
                        size='large'
                        type='number'
                        placeholder='Price'
                        onChange={(value) => {
                            setPrice(value);
                        }}
                    />
                    {priceErrorMsg?.type === 'price' && <FormErrorMsg msg={priceErrorMsg.msg} />}
                    {priceErrorMsg?.type === 'balance' && <>
                        <span className={style.balanceError}>Insufficient Balance, please <a target="_blank" onClick={() => {
                            setSwapTokenModal(true);
                        }}>swap more token</a></span>
                    </>}
                </div>
                <div className={style.tokenBalance}>
                    <span>balance: <Token value={assetBalance ?? ''} symbol={asset?.symbol} /></span>
                </div>
            </div>

            <div
                className={style.bidBtnContainer}
            >
                <Button
                    block
                    size='large'
                    shape='round'
                    type='primary'
                    disabled={!!priceErrorMsg || !formValid}
                    loading={false}
                    onClick={() => {
                        onBid(price!);
                    }}
                >
                    bid
                </Button>
            </div>
        </div>

        {swapTokenModal && <>
            <Modal
                title="Swap token"
                visible
                footer={null}
                onCancel={() => setSwapTokenModal(false)}
            >
                <SwapAsset assetId={asset?.id} canSelectAsset={false} onSwapped={() => {
                    setSwapTokenModal(false);
                }} initTokenNumber={BigIntToFloatString(FloatStringToBigInt(`${price}`, 18) - stringToBigInt(assetBalance), 18)}></SwapAsset>
            </Modal>
        </>}
    </>;
};

export default BidSection;
