import BigModal from '@/components/ParamiModal/BigModal';
import { BigIntToFloatString } from '@/utils/format';
import { LinkOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Image } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { contractAddresses, pairs } from '../config';
import style from '../style.less';
import AddModal from './Modal';

const Rows: React.FC<{
    collapse: boolean;
    stakedLPs: Liquid[];
    unstakedLPs: Liquid[];
    rewards: any[];
    pair: Pair;
    poolAddress: string;
}> = ({ collapse, stakedLPs, unstakedLPs, rewards, pair, poolAddress }) => {
    const {
        StakeContract
    } = useModel('contracts');
    const {
        account
    } = useModel('metaMask');
    const [AddModalShow, setAddModalShow] = useState<boolean>(false);
    const [pendingStake, setPendingStake] = useState<(true | false)[]>([])
    const [pendingUnstake, setPendingUnstake] = useState<(true | false)[]>([])
    const [pendingClaim, setPendingClaim] = useState<(true | false)[]>([])
    useEffect(() => {
        console.log(stakedLPs, unstakedLPs)
    }, [stakedLPs, unstakedLPs])
    const handleStake = useCallback(async (tokenId, incentiveIndex) => {
        pendingStake[tokenId] = true;
        setPendingStake(pendingStake);

        const incentiveKey = {
            rewardToken: contractAddresses.ad3,
            pool: poolAddress,
            startTime: pair.incentives[incentiveIndex].startTime,
            endTime: pair.incentives[incentiveIndex].endTime,
        }
        try {
            const tx = await StakeContract?.depositToken(incentiveKey, tokenId)
            await tx.wait();
            pendingStake[tokenId] = false
            setPendingStake(pendingStake)
        } catch (e) {
            console.error(e)
            pendingStake[tokenId] = false
            setPendingStake(pendingStake)
        }
    }, [StakeContract, pair.incentives, pendingStake]);

    const handleUnstake = useCallback(
        async (tokenId, incentiveIndex) => {
            console.log('handleunstake', tokenId, incentiveIndex)
            pendingUnstake[tokenId] = true
            setPendingUnstake(pendingUnstake)
            const incentiveKey = {
                rewardToken: contractAddresses.ad3,
                pool: poolAddress,
                startTime: pair.incentives[incentiveIndex].startTime,
                endTime: pair.incentives[incentiveIndex].endTime,
            }
            try {
                //unstake
                await StakeContract?.unstakeToken(incentiveKey, tokenId, account)
                pendingUnstake[tokenId] = false
                setPendingUnstake(pendingUnstake)
            } catch (e) {
                console.error(e)
                pendingUnstake[tokenId] = false
                setPendingUnstake(pendingUnstake)
            }
        },
        [StakeContract, account, pair.incentives, pendingUnstake, poolAddress]
    )

    const handleClaim = useCallback(async (tokenId, amount, incentiveIndex) => {
        pendingClaim[tokenId] = true
        setPendingClaim(pendingClaim)
        const incentiveKey = {
            rewardToken: contractAddresses.ad3,
            pool: poolAddress,
            startTime: pair.incentives[incentiveIndex].startTime,
            endTime: pair.incentives[incentiveIndex].endTime,
        }
        try {
            await StakeContract?.claimReward(incentiveKey, tokenId, account, FloatStringToBigInt(amount, 18).toString());
            pendingClaim[tokenId] = false
            setPendingClaim(pendingClaim)
        } catch (e) {
            console.error(e)
            pendingClaim[tokenId] = false
            setPendingClaim(pendingClaim)
        }
    }, [StakeContract, account, pair.incentives, pendingClaim, poolAddress]);
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
                                setAddModalShow(true);
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
                    {(
                        <div className={style.nftList}>

                            {
                                stakedLPs.filter((item) => { return item != undefined }).map(item => {
                                    return (
                                        <div className={style.nftItem}>
                                            <div className={style.nftItemBlock}>
                                                <div className={style.title}>
                                                    NFTId
                                                </div>
                                                <div className={style.value}>
                                                    <Space>
                                                        <LinkOutlined /> {item.tokenId}
                                                    </Space>
                                                </div>
                                            </div>
                                            <div className={style.nftItemBlock}>
                                                <div className={style.title}>
                                                    Liquidity
                                                </div>
                                                <div className={style.value}>
                                                    {
                                                        //BigIntToFloatString(item.liquidity, 18)
                                                    }
                                                </div>
                                            </div>
                                            <div className={style.nftItemBlock}>
                                                <div className={style.title}>
                                                    Reward Range
                                                </div>
                                                <div className={style.value}>
                                                    {pair.incentives[item.incentiveIndex].minPrice}-{pair.incentives[item.incentiveIndex].maxPrice}
                                                </div>
                                            </div>
                                            <div className={style.nftItemBlock}>
                                                <div className={style.title}>
                                                    My APR
                                                </div>
                                                <div className={style.value}>
                                                    TODO%
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
                                                        {BigIntToFloatString(rewards[item.tokenId], 18)}
                                                    </div>
                                                </div>
                                                <Button
                                                    size='middle'
                                                    shape='round'
                                                    type='primary'
                                                    onClick={() => handleClaim(item.tokenId, rewards[item.tokenId], item.incentiveIndex)}
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
                                                    onClick={() => handleUnstake(item.tokenId, item.incentiveIndex)}
                                                >
                                                    Unstake
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            {
                                unstakedLPs.filter((item) => { return item != undefined }).map((item) => {
                                    console.log('item', item);
                                    return (
                                        <div className={style.nftItem}>
                                            <div className={style.nftItemBlock}>
                                                <div className={style.title}>
                                                    NFTId
                                                </div>
                                                <div className={style.value}>
                                                    <Space>
                                                        <LinkOutlined /> {item.tokenId}
                                                    </Space>
                                                </div>
                                            </div>
                                            <div className={style.nftItemBlock}>
                                                <div className={style.title}>
                                                    Liquidity
                                                </div>
                                                <div className={style.value}>
                                                    {//BigIntToFloatString(item.liquidity,18)
                                                    }
                                                    TODO
                                                </div>
                                            </div>
                                            <div className={style.nftItemBlock}>
                                                <div className={style.title}>
                                                    Reward Range
                                                </div>
                                                <div className={style.value}>
                                                    {pair.incentives[item.incentiveIndex].minPrice}-{pair.incentives[item.incentiveIndex].maxPrice}
                                                </div>
                                            </div>
                                            <div className={style.nftItemBlock}>
                                                <div className={style.title}>
                                                    My APR
                                                </div>
                                                <div className={style.value}>
                                                    TODO%
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
                                                        {BigIntToFloatString(rewards[item.tokenId], 18)}
                                                    </div>
                                                </div>
                                                <Button
                                                    size='middle'
                                                    shape='round'
                                                    type='primary'
                                                    disabled={true}
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
                                                    onClick={() => handleStake(item.tokenId, item.incentiveIndex)}
                                                >
                                                    Stake
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    )
                        // : (
                        //     <span className={style.noNFT}>You have no UniswapV3 position NFTs, click the Get button on the left to acquire some.
                        //     </span>
                        // )
                    }
                </div>
            </div>
            <BigModal
                visable={AddModalShow}
                title={'Add Liquidity'}
                content={
                    <AddModal setVisiable={setAddModalShow} />
                }
                footer={false}
                close={() => setAddModalShow(false)}
            />
        </>
    )
}

export default Rows;
