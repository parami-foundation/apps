import BigModal from '@/components/ParamiModal/BigModal';
import { LinkOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Image } from 'antd';
import React, { useState } from 'react';
import style from '../style.less';
import AddModal from './Modal';

const Rows: React.FC<{
    collapse: boolean;
}> = ({ collapse }) => {
    const [addModal, setAddModal] = useState<boolean>(false);
    const [nfts, setNfts] = useState<any>();

    return (
        <>
            <div
                className={style.rowsContainer}
                style={{
                    maxHeight: collapse ? '100vh' : 0,
                }}
            >
                <Divider />
                <div className={style.rowsContentContainer}>
                    <div className={style.actionButtons}>
                        <Button
                            block
                            shape='round'
                            size='middle'
                            type='primary'
                            className={style.actionButton}
                            onClick={() => {
                                setAddModal(true);
                            }}
                        >
                            Get UniswapV3 NFT
                        </Button>
                        <Button
                            block
                            shape='round'
                            size='middle'
                            type='primary'
                            className={style.actionButton}
                        >
                            View Contract
                        </Button>
                        <span className={style.actionButtonDesc}>
                            Click the Get button to acquire more NFTs
                        </span>
                    </div>
                    {nfts ? (
                        <div className={style.nftList}>
                            <div className={style.nftItem}>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        NFTId
                                    </div>
                                    <div className={style.value}>
                                        <Space>
                                            <LinkOutlined /> 372
                                        </Space>
                                    </div>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        Liquidity
                                    </div>
                                    <div className={style.value}>
                                        $1,996.10
                                    </div>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        Reward Range
                                    </div>
                                    <div className={style.value}>
                                        0.95-1.05
                                    </div>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        My APR
                                    </div>
                                    <div className={style.value}>
                                        158.13%
                                    </div>
                                </div>
                                <div className={style.nftReward}>
                                    <div className={style.nftItemBlock}>
                                        <div className={style.title}>
                                            Reward(AD3)
                                        </div>
                                        <div className={style.value}>
                                            <Image
                                                src={'/images/logo-round-core.svg'}
                                                preview={false}
                                                className={style.icon}
                                            />
                                            6.00
                                        </div>
                                    </div>
                                    <Button
                                        size='middle'
                                        shape='round'
                                        type='primary'
                                    >
                                        Harvest
                                    </Button>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <Button
                                        danger
                                        size='middle'
                                        shape='round'
                                        type='primary'
                                        className={style.stakeButton}
                                    >
                                        Unstake
                                    </Button>
                                </div>
                            </div>
                            <div className={style.nftItem}>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        NFTId
                                    </div>
                                    <div className={style.value}>
                                        <Space>
                                            <LinkOutlined /> 372
                                        </Space>
                                    </div>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        Liquidity
                                    </div>
                                    <div className={style.value}>
                                        $1,996.10
                                    </div>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        Reward Range
                                    </div>
                                    <div className={style.value}>
                                        0.95-1.05
                                    </div>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        My APR
                                    </div>
                                    <div className={style.value}>
                                        158.13%
                                    </div>
                                </div>
                                <div className={style.nftReward}>
                                    <div className={style.nftItemBlock}>
                                        <div className={style.title}>
                                            Reward(AD3)
                                        </div>
                                        <div className={style.value}>
                                            <Image
                                                src={'/images/logo-round-core.svg'}
                                                preview={false}
                                                className={style.icon}
                                            />
                                            6.00
                                        </div>
                                    </div>
                                    <Button
                                        size='middle'
                                        shape='round'
                                        type='primary'
                                    >
                                        Harvest
                                    </Button>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <Button
                                        danger
                                        size='middle'
                                        shape='round'
                                        type='primary'
                                        className={style.stakeButton}
                                    >
                                        Unstake
                                    </Button>
                                </div>
                            </div>
                            <div className={style.nftItem}>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        NFTId
                                    </div>
                                    <div className={style.value}>
                                        <Space>
                                            <LinkOutlined /> 372
                                        </Space>
                                    </div>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        Liquidity
                                    </div>
                                    <div className={style.value}>
                                        $1,996.10
                                    </div>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        Reward Range
                                    </div>
                                    <div className={style.value}>
                                        0.95-1.05
                                    </div>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        My APR
                                    </div>
                                    <div className={style.value}>
                                        158.13%
                                    </div>
                                </div>
                                <div className={style.nftReward}>
                                    <div className={style.nftItemBlock}>
                                        <div className={style.title}>
                                            Reward(AD3)
                                        </div>
                                        <div className={style.value}>
                                            <Image
                                                src={'/images/logo-round-core.svg'}
                                                preview={false}
                                                className={style.icon}
                                            />
                                            6.00
                                        </div>
                                    </div>
                                    <Button
                                        size='middle'
                                        shape='round'
                                        type='primary'
                                    >
                                        Harvest
                                    </Button>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <Button
                                        danger
                                        size='middle'
                                        shape='round'
                                        type='primary'
                                        className={style.stakeButton}
                                    >
                                        Unstake
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <span className={style.noNFT}>You have no UniswapV3 position NFTs, click the Get button on the left to acquire some.
                        </span>
                    )}
                </div>
            </div>
            <BigModal
                visable={addModal}
                title={'Add Liquidity'}
                content={
                    <AddModal setVisiable={setAddModal} />
                }
                footer={false}
                close={() => setAddModal(false)}
            />
        </>
    )
}

export default Rows;
