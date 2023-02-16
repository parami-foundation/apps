import BigModal from '@/components/ParamiModal/BigModal';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { POST_MESSAGE_PREFIX } from '@/config/constant';
import { UserBidSlot, UserBidSlotWithAd3 } from '@/services/parami/Advertisement';
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
    const [nftMinted, setNftMinted] = useState<boolean>();

    const handleBidAd = async (preTx?: boolean, account?: string) => {
        try {
            // todo: default adId and never expire
            const price = Number(amount) > 0 ? amount : parseAmount('1');

            const info: any = nftMinted
                ? await UserBidSlot('0x9ed392c64a7a5b7e2316633d1b57631adbea4f8349310c341302487f41382c33', nftId, price, passphrase, wallet?.keystore, preTx, account)
                : await UserBidSlotWithAd3('0x9ed392c64a7a5b7e2316633d1b57631adbea4f8349310c341302487f41382c33', nftId, price, passphrase, wallet?.keystore, preTx, account);

            if (preTx && account) {
                return info;
            }

            notification.success({
                message: 'bid success!'
            })
            if (window.opener) {
                window.opener.postMessage(POST_MESSAGE_PREFIX.AD_BID, '*');
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

            (async () => {
                const nftMetaRes = await apiWs.query.nft.metadata(nftId);
                const nft = nftMetaRes.toHuman() as any;
                setNftMinted(nft.minted);
            })();
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
