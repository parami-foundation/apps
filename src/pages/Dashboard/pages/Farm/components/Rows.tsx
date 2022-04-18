import BigModal from '@/components/ParamiModal/BigModal';
import { FloatStringToBigInt } from '@/utils/format';
import { LinkOutlined } from '@ant-design/icons';
import { formatBalance } from '@polkadot/util';
import { Button, Divider, Space, Image } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { getAd3Price } from '../api/uniswap/pool';
import { contractAddresses } from '../config';
import style from '../style.less';
import AddModal from './Modal';

const Rows: React.FC<{
    collapse: boolean;
    stakedLPs: Farm.Liquid[];
    unstakedLPs: Farm.Liquid[];
    rewards: any[];
    pair: Farm.Pair;
    poolAddress: string;
    apys: string[]
}> = ({ collapse, stakedLPs, unstakedLPs, rewards, pair, poolAddress, apys }) => {
    const apiWs = useModel('apiWs');
    const {
        StakeContract,
        FactoryContract
    } = useModel('contracts');
    const {
        Account,
        ChainId,
    } = useModel('web3');
    const [AddModalShow, setAddModalShow] = useState<boolean>(false);
    const [pendingStake, setPendingStake] = useState<(true | false)[]>([]);
    const [pendingUnstake, setPendingUnstake] = useState<(true | false)[]>([]);
    const [pendingClaim, setPendingClaim] = useState<(true | false)[]>([]);
    const [currentPrice, setCurrentPrice] = useState<bigint>(BigInt(0));

    const handleStake = useCallback(async (tokenId, incentiveIndex) => {
        pendingStake[tokenId] = true;
        setPendingStake(pendingStake);
        console.log(`handle Stake ${tokenId}`);
        const incentiveKey = {
            rewardToken: contractAddresses.ad3[ChainId],
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
    }, [StakeContract, ChainId, pair.incentives, pendingStake, poolAddress]);

    const handleUnstake = useCallback(
        async (tokenId, incentiveIndex) => {
            console.log('handleunstake', tokenId, incentiveIndex)
            pendingUnstake[tokenId] = true
            setPendingUnstake(pendingUnstake)
            const incentiveKey = {
                rewardToken: contractAddresses.ad3[ChainId],
                pool: poolAddress,
                startTime: pair.incentives[incentiveIndex].startTime,
                endTime: pair.incentives[incentiveIndex].endTime,
            }
            try {
                //unstake
                await StakeContract?.unstakeToken(incentiveKey, tokenId, Account)
                pendingUnstake[tokenId] = false
                setPendingUnstake(pendingUnstake)
            } catch (e) {
                console.error(e)
                pendingUnstake[tokenId] = false
                setPendingUnstake(pendingUnstake)
            }
        },
        [StakeContract, Account, ChainId, pair.incentives, pendingUnstake, poolAddress]
    )

    const handleClaim = useCallback(async (tokenId, amount, incentiveIndex) => {
        pendingClaim[tokenId] = true
        setPendingClaim(pendingClaim)
        console.log('handleclaim', tokenId, amount, incentiveIndex)
        const incentiveKey = {
            rewardToken: contractAddresses.ad3[ChainId],
            pool: poolAddress,
            startTime: pair.incentives[incentiveIndex].startTime,
            endTime: pair.incentives[incentiveIndex].endTime,
        }
        try {
            await StakeContract?.claimReward(incentiveKey, tokenId, Account, amount);
            pendingClaim[tokenId] = false
            setPendingClaim(pendingClaim)
        } catch (e) {
            console.error(e)
            pendingClaim[tokenId] = false
            setPendingClaim(pendingClaim)
        }
    }, [StakeContract, Account, pair.incentives, pendingClaim, poolAddress, ChainId]);

    const getAd3CoinPrice = useCallback(async () => {
        if (!FactoryContract) return;
        const res = await getAd3Price(FactoryContract, pair.coinAddress);
        console.log('getAd3CoinPrice/', pair.coin, res?.toSignificant());

        setCurrentPrice(BigInt(FloatStringToBigInt(res?.toSignificant() || '0', 18)));//todo: check decimals
    }, [FactoryContract]);

    useEffect(() => {
        if (apiWs) {
            getAd3CoinPrice();
        }
    }, [FactoryContract, apiWs]);

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
                            onClick={() => {
                                window.open('https://rinkeby.etherscan.io/address/' + StakeContract?.address)
                            }}
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
                                                        formatBalance(item.liquidity, { withUnit: false }, 18)
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
                                                    {apys[item.incentiveIndex]}
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
                                                        {formatBalance(rewards.filter((reward) => { return reward.tokenId === item.tokenId })[0]?.reward, { withUnit: false }, 18)}
                                                    </div>
                                                </div>
                                                <Button
                                                    size='middle'
                                                    shape='round'
                                                    type='primary'
                                                    onClick={() => handleClaim(item.tokenId, rewards.filter((reward) => { return reward.tokenId === item.tokenId })[0]?.reward, item.incentiveIndex)}
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
                                                        formatBalance(item.liquidity, { withUnit: false }, 18)
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
                                                    0%
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
                                                        0
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
                    <AddModal
                        setVisiable={setAddModalShow}
                        pair={pair}
                        currentPrice={currentPrice}
                    />
                }
                footer={false}
                close={() => setAddModalShow(false)}
            />
        </>
    )
}

export default Rows;
