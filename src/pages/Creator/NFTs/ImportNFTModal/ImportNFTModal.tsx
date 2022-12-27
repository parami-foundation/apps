import React, { useEffect, useState } from 'react';
import { Modal, Steps, Spin, notification } from 'antd';
import { OSNFT } from '@/models/openseaApi';
import style from './ImportNFTModal.less';
import { useModel } from 'umi';
import { ethers } from 'ethers';
import { hexToDid } from '@/utils/common';
import { PortNFT } from '@/services/parami/NFT';
import SecurityModal from '@/components/ParamiModal/SecurityModal';

export interface ImportNFTModalProps {
    nft: OSNFT,
    onCancel: () => void,
    onImported: (nftId: string) => void;
}

const { Step } = Steps;

function ImportNFTModal({ nft, onCancel, onImported }: ImportNFTModalProps) {

    const {
        Provider,
        Signer,
        ChainId,
    } = useModel('web3');
    const { wallet } = useModel('currentUser');
    const [importStep, setImportStep] = useState<number>(0);
    const [paramiRegistry, setParamiRegistry] = useState<ethers.Contract>();
    const [signedMsg, setSignedMsg] = useState<string>('');
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const { Events, SubParamiEvents } = useModel('paramiEvents');
    const [eventsUnsub, setEventsUnsub] = useState<() => void>();

    useEffect(() => {
        if (Provider && Signer && ChainId) {
            // todo: Parami Registry Contract
            const contract = new ethers.Contract('0x123', {} as any, Signer);
            setParamiRegistry(contract);
        }
    }, [Provider, Signer, ChainId])

    const registerNft = async () => {
        const registered = await paramiRegistry!.isRegistered(nft.asset_contract.address, nft.token_id);
        if (registered) {
            setImportStep(1);
            return;
        }

        const registerResp = await paramiRegistry!.register(nft.asset_contract.address, nft.token_id);
        await registerResp.wait();

        setImportStep(1);
    }

    const signEthMsg = async () => {
        const signedMsg = await Signer!.signMessage(`Link: ${hexToDid(wallet?.did)}`);
        setSignedMsg(signedMsg);
        setImportStep(2);
    }

    useEffect(() => {
        if (paramiRegistry) {
            switch (importStep) {
                case 0:
                    registerNft();
                    break;
                case 1:
                    signEthMsg();
                    break;
                case 2:
                    setSecModal(true);
                    break;
            }
        }
    }, [importStep, paramiRegistry]);

    const handleImportNft = async (preTx?: boolean, account?: string) => {
        try {
            const ethAccount = await Signer!.getAddress();
            const info: any = await PortNFT(
                passphrase,
                wallet?.keystore,
                'Ethereum',
                nft.asset_contract.address,
                nft.token_id,
                ethAccount,
                signedMsg,
                true,
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
                message: e.message || e,
                duration: null,
            });
        }
    };

    useEffect(() => {
        return () => eventsUnsub && eventsUnsub();
    }, [eventsUnsub])

    useEffect(() => {
        if (Events?.length) {
            Events.forEach(record => {
                const { event } = record;
                if (`${event?.section}:${event?.method}` === 'nft:Created') {
                    if (event?.data[0].toString() === wallet?.did) {
                        const nftId = event?.data[1].toString();
                        onImported(nftId);
                    }
                }
            })
        }
    }, [Events])

    return <>
        <Modal
            visible
            title='Importing'
            footer={null}
            onCancel={onCancel}
        >
            <Steps
                progressDot
                size='small'
                current={importStep}
            >
                <Step title="Register NFT as AD space"></Step>
                <Step title="Sign ETH Message" />
                <Step title="Import NFT" />
            </Steps>
            <div className={style.loadingContainer}>
                <Spin />
                {importStep === 0 && <p>Registering your NFT as AD space. Please confirm transaction in your wallet.</p>}
                {importStep === 1 && <p>Please provide a proof of ownership by simply signing a message in your wallet.</p>}
                {importStep === 2 && <p>Importing your NFT. Please wait.</p>}
            </div>
        </Modal>

        <SecurityModal
            visable={secModal}
            setVisable={setSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={handleImportNft}
        />
    </>;
};

export default ImportNFTModal;
