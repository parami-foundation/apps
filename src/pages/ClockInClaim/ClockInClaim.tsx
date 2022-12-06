import BigModal from '@/components/ParamiModal/BigModal';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { POST_MESSAGE_PREFIX } from '@/config/constant';
import { UserClockIn } from '@/services/parami/ClockIn.service';
import { notification, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, useModel, useParams } from 'umi';
import style from './ClockInClaim.less';

export interface ClockInClaimProps { }

function ClockInClaim({ }: ClockInClaimProps) {
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const { wallet } = useModel('currentUser');
    const apiWs = useModel('apiWs');
    const intl = useIntl();
    const {
        nftId
    } = useParams() as { nftId: string };

    const close = () => {
        window.opener.postMessage(`${POST_MESSAGE_PREFIX.AD_CLAIMED}:${nftId}`, '*');
        window.close();
    }

    useEffect(() => {
        if (nftId && apiWs && wallet) {
            setSecModal(true);
        }
    }, [nftId, apiWs, wallet]);

    const claim = async (preTx?: boolean, account?: string) => {
        if (!wallet?.keystore) {
            notification.error({
                key: 'accessDenied',
                message: intl.formatMessage({
                    id: 'error.accessDenied',
                }),
                duration: null,
            });
            return;
        }

        try {
            await UserClockIn(nftId, passphrase, wallet.keystore, preTx, account);
            close();
        } catch (e) {
            console.log(e);
            notification.error({
                message: 'Claim Ad Token Error',
                description: `${e}`,
            });
        }
    }

    return <>
        <BigModal
            visable
            title="Claim your token"
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
            func={claim}
        ></SecurityModal>
    </>;
};

export default ClockInClaim;
