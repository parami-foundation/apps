import { NFTItem } from '@/models/nft';
import React, { useState, useRef, useEffect } from 'react';
import { history, useModel } from 'umi';
import style from './style.less';
import { Button, Modal, notification } from 'antd';
import MintNFTModal from '../Mint';
import IdoModal from '../IdoModal/IdoModal';
import IpoModal from '../IpoModal/IpoModal';
import { ExclamationCircleOutlined, LinkOutlined } from '@ant-design/icons';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { EndICO } from '@/services/parami/NFT';

const NFTCard: React.FC<{
    item: NFTItem;
}> = ({ item }) => {
    const { wallet } = useModel('currentUser');
    const [passphrase, setPassphrase] = useState<string>('');
    const { getNFTs } = useModel('nft');
    const [mintModal, setMintModal] = useState<boolean>(false);
    const [ipoModal, setIpoModal] = useState<boolean>(false);
    const [idoModal, setIdoModal] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    const [coverHeight, setCoverHeight] = useState<number>();

    const [endIpoSecModal, setEndIpoSecModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleEndIPO = async (preTx?: boolean, account?: string) => {
        setLoading(true);
        try {
            const info = await EndICO(item.id, passphrase, wallet?.keystore, preTx, account);
            if (preTx && account) {
                return info
            }
            setLoading(false);
            notification.success({
                message: 'IPO ended!'
            });
            history.push(`/ipo/?nftId=${item.id}`);
        } catch (e: any) {
            notification.error({
                message: e.message,
                duration: null,
            });
            setLoading(false);
        }
    }

    useEffect(() => {
        setCoverHeight(ref.current?.offsetWidth);
    }, [ref.current]);

    return (<>
        <div
            className={`${style.nftItem} ${item.minted ? '' : style.unmint}`}
            onClick={() => {
                history.push(`/ad/?nftId=${item?.id}`);
            }}
        >
            <div className={style.card}>
                <div className={style.cardWrapper}>
                    <div className={style.cardBox}>
                        <div
                            className={style.cover}
                            style={{
                                backgroundImage: `url(${item?.imageUrl})`,
                                height: coverHeight,
                                minHeight: '20vh',
                            }}
                            ref={ref}
                        >
                            <div className={style.nftID}>
                                #{item?.id}
                            </div>
                        </div>
                        <div
                            className={style.filterImage}
                        />
                        <div className={style.cardDetail}>
                            {!!item?.name && <>
                                <h3 className={style.title}>
                                    {item.name}
                                </h3>
                            </>}

                            {!item.minted && <>
                                <div className={style.action}>
                                    <Button
                                        block
                                        type='primary'
                                        shape='round'
                                        size='middle'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMintModal(true);
                                        }}
                                    >
                                        Mint
                                    </Button>
                                </div>
                            </>}

                            {item.minted && <>
                                <div className={style.section}>
                                    <div className={style.label}>
                                        Initial NFT Power Offering
                                    </div>
                                    <div className={style.value}>
                                        {!item.icoMetadata && 'Not started'}
                                        {item.icoMetadata && <>
                                            <span className={style.link} onClick={(e) => {
                                                e.stopPropagation();
                                                history.push(`/ipo/?nftId=${item.id}`);
                                            }}>
                                                {item.icoMetadata.done && 'IPO ended '}
                                                {!item.icoMetadata.done && 'IPO ongoing '}
                                                <LinkOutlined style={{fontSize: '14px'}} />
                                            </span>
                                        </>}
                                    </div>

                                    <div className={style.action}>
                                        {!item.icoMetadata && <>
                                            <Button
                                                block
                                                type='primary'
                                                shape='round'
                                                size='small'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIpoModal(true);
                                                }}
                                            >
                                                Start IPO
                                            </Button>
                                        </>}
                                        {item.icoMetadata && !item.icoMetadata?.done && <>
                                            <Button
                                                block
                                                type='primary'
                                                shape='round'
                                                size='small'
                                                loading={loading}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    Modal.confirm({
                                                        title: 'Do you want to end this IPO?',
                                                        icon: <ExclamationCircleOutlined />,
                                                        onOk() {
                                                            setEndIpoSecModal(true);
                                                        }
                                                    });
                                                }}
                                            >
                                                End IPO
                                            </Button>
                                        </>}
                                    </div>
                                </div>

                                <div className={style.section}>
                                    <div className={style.label}>
                                        Initial DEX Offering
                                    </div>

                                    <div className={style.value}>
                                        {(!item.swapMetadata || item.swapMetadata.liquidity === '0') ? 'No Liquidity' : <>
                                            <span className={style.link} onClick={(e) => {
                                                e.stopPropagation();
                                                history.push(`/swap/${item.id}`);
                                            }}>
                                                {'Done '}
                                                <LinkOutlined style={{fontSize: '14px'}} />
                                            </span>
                                        </>}
                                    </div>

                                    {(!item.swapMetadata || item.swapMetadata.liquidity === '0') && <>
                                        <div className={style.action}>
                                            <Button
                                                block
                                                type='primary'
                                                shape='round'
                                                size='small'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIdoModal(true);
                                                }}
                                            >
                                                Start IDO
                                            </Button>
                                        </div>
                                    </>}
                                </div>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {ipoModal && <>
            <IpoModal
                nftId={item.id} onClose={() => setIpoModal(false)} onIPO={() => {
                    history.push(`/ipo/?nftId=${item?.id}`);
                }}
            ></IpoModal>
        </>}

        {idoModal && <>
            <IdoModal nftId={item.id} symbol={item.symbol} swapMetadata={item.swapMetadata} onClose={() => setIdoModal(false)} onIDO={() => {
                setIdoModal(false);
                getNFTs();
            }}></IdoModal>
        </>}

        {mintModal && <>
            <MintNFTModal item={item} onClose={() => setMintModal(false)} onMint={() => {
                setMintModal(false);
            }}></MintNFTModal>
        </>}

        <SecurityModal
            visable={endIpoSecModal}
            setVisable={setEndIpoSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={handleEndIPO}
        />
    </>);
};

export default NFTCard;
