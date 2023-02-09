import BigModal from '@/components/ParamiModal/BigModal';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { POST_MESSAGE_PREFIX } from '@/config/constant';
import { notification, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel, useParams } from 'umi';
import style from './QuickCreateIMPool.less';

export interface QuickCreateIMPoolProps { }

function QuickCreateIMPool({ }: QuickCreateIMPoolProps) {
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const { wallet } = useModel('currentUser');
    const apiWs = useModel('apiWs');
    const { nftId } = useParams() as { nftId: string };

    const handleCreateImPool = async (preTx?: boolean, account?: string) => {
        try {
            // const info: any = await UserBidSlotWithAd3('0x0ec3c7ad65614705ca4b5c2cfdc375b06fb40b41e8490b9459087dfc2842671f', nftId, price, passphrase, wallet?.keystore, preTx, account);

            if (preTx && account) {
                return { partialFee: '10000000000' };
            }

            notification.success({
                message: 'create im pool success!'
            })
            if (window.opener) {
                window.opener.postMessage(POST_MESSAGE_PREFIX.IM_POOL_CREATED, '*');
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
            title="Create Influence Mining Pool"
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
            func={handleCreateImPool}
        ></SecurityModal>
    </>;
};

export default QuickCreateIMPool;
