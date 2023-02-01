import BigModal from '@/components/ParamiModal/BigModal';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { PortNFT } from '@/services/parami/NFT';
import { hexToDid } from '@/utils/common';
import { notification, Spin } from 'antd';
import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useAccess, useIntl, useModel, useParams, history } from 'umi';
import style from './Enlist.less';
import config from '@/config/config';

export interface EnlistProps { }

function Enlist({ }: EnlistProps) {
    const access = useAccess();
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const { wallet } = useModel('currentUser');
    const apiWs = useModel('apiWs');
    const { connect, Signer } = useModel('web3');
    const [signedMsg, setSignedMsg] = useState<string>('');
    const { contractAddress, tokenId } = useParams() as { contractAddress: string, tokenId: string };
    const { Events, SubParamiEvents } = useModel('paramiEvents');
    const [eventsUnsub, setEventsUnsub] = useState<() => void>();
    const intl = useIntl();

    useEffect(() => {
        return () => eventsUnsub && eventsUnsub();
      }, [eventsUnsub])

    useEffect(() => {
        if (!access.canWalletUser) {
            localStorage.setItem('parami:wallet:redirect', window.location.href);
            history.push(config.page.createPage);
        } else {
            connect();
        }
    }, [access])

    const signEthMsg = async () => {
        if (Signer && wallet?.did) {
            try {
                const signedMsg = await Signer.signMessage(`Link: ${hexToDid(wallet?.did)}`);
                
                // import nft
                setSignedMsg(signedMsg);
                setSecModal(true);
            } catch (e: any) {
                if (e?.code === 4001) {
                    notification.warning({
                        message: 'User Rejected'
                    });
                } else {
                    notification.error({
                        message: 'Sign Eth Message Error',
                        description: JSON.stringify(e)
                    });
                }
            }
        }
    }

    useEffect(() => {
        // if signer -> sign eth msg
        if (Signer) {
            signEthMsg();
        }
    }, [Signer])

    const importNft = async (preTx?: boolean, account?: string) => {
        if (!!wallet && !!wallet.keystore && !!wallet.did && contractAddress && tokenId && Signer && signedMsg) {
            try {
                const ethAccount = await Signer.getAddress();

                // todo: same api?
                const info: any = await PortNFT(
                    passphrase,
                    wallet?.keystore,
                    'Ethereum',
                    contractAddress,
                    BigNumber.from(tokenId),
                    ethAccount,
                    signedMsg,
                    preTx,
                    account,
                );

                if (preTx && account) {
                    return info
                }

                const unsub = await SubParamiEvents();
                setEventsUnsub(() => unsub);
            } catch (e: any) {
                notification.error({
                    message: intl.formatMessage({ id: e }),
                    duration: null,
                });
            }
        } else {
            notification.error({
                key: 'accessDenied',
                message: intl.formatMessage({
                    id: 'error.accessDenied',
                }),
                duration: null,
            });
        }
    };

    useEffect(() => {
        if (Events?.length) {
          Events.forEach(record => {
            const { event } = record;
            if (`${event?.section}:${event?.method}` === 'nft:Created') {
              if (event?.data[0].toString() === wallet?.did) {
                // NFT Import Success
                // todo: notify influence mining and close window
              }
            }
          })
        }
      }, [Events])

    return <>
        <BigModal
            visable
            title="Enlist"
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
            func={importNft}
        ></SecurityModal>
    </>;
};

export default Enlist;
