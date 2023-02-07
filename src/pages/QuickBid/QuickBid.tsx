import BigModal from '@/components/ParamiModal/BigModal';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { POST_MESSAGE_PREFIX } from '@/config/constant';
import { UserBidSlotWithAd3 } from '@/services/parami/Advertisement';
import { parseAmount } from '@/utils/common';
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
            // todo: default adId
            const price = Number(amount) > 0 ? amount : parseAmount('1');
            const info: any = await UserBidSlotWithAd3('0x0ec3c7ad65614705ca4b5c2cfdc375b06fb40b41e8490b9459087dfc2842671f', nftId, price, passphrase, wallet?.keystore, preTx, account);

            if (preTx && account) {
                return info;
            }

            notification.success({
                message: 'bid success!'
            })
            if (window.opener) {
                window.opener.postMessage(POST_MESSAGE_PREFIX.AD_BID);
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
