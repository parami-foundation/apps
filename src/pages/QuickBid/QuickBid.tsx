import BigModal from '@/components/ParamiModal/BigModal';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { UserBidSlotWithAd3 } from '@/services/parami/Advertisement';
import { notification, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel, useParams } from 'umi';
import style from './QuickBid.less';

export interface QuickBidProps { }

function QuickBid({ }: QuickBidProps) {
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const { wallet } = useModel('currentUser');
    const apiWs = useModel('apiWs');
    const { nftId, amount } = useParams() as { nftId: string, amount: string };

    const handleBidAd = async (preTx?: boolean, account?: string) => {
        try {
            // todo: adId?
            const info: any = await UserBidSlotWithAd3('default_adid', nftId, amount, passphrase, wallet?.keystore, preTx, account);

            if (preTx && account) {
                return info;
            }

            // todo: notify influence mining page and close window
            notification.success({
                message: 'bid success!'
            })
            if (window.opener) {
                window.opener.postMessage('ParamiWallet::BidSuccess'); // todo: enum
            }
            window.close();
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
        }
    }

    useEffect(() => {
        if (apiWs) {
            setSecModal(true);
        }
    }, [apiWs])

    return <>
        <BigModal
            visable
            title="Bid"
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
            func={handleBidAd}
        ></SecurityModal>
    </>;
};

export default QuickBid;
