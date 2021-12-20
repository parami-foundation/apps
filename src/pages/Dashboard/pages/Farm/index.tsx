import React, { useCallback, useEffect, useState } from 'react';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Button, Typography, Image, Space, Tooltip, Badge, Spin, notification } from 'antd';
import { DownOutlined, FireOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import SelectWallet from '../Bridge/components/selectWallet';
import { BigNumber, ethers } from 'ethers';
import { getAd3UsdtPrice } from './api/uniswap/pool';
import { contractAddresses, pairs, pairsData } from './config';
import { FeeAmount } from '@uniswap/v3-sdk';
import { CompareArray } from '@/utils/common';
import { getIncentiveId } from './api/parami/util';
import { BigIntToFloatString } from '@/utils/format';
import PairItem from './components/PairItem';


const ICON_ETH = '/images/crypto/ethereum-circle.svg';
const ICON_USDT = '/images/crypto/usdt-circle.svg';
const ICON_USDC = '/images/crypto/usdc-circle.svg';

const Farm: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [Postitions, setPostitions] = useState<any[]>([]);
    const [isApprovedAll, setIsApproveAll] = useState(true);
    const [requestedApproval, setRequestedApproval] = useState(false);
    const [Pairs, setPairs] = useState<any[]>([]);
    const [AD3Price, setAD3Price] = useState('0');
    const [AD3Supply, setSupply] = useState(BigInt(0));
    const [Pools, setPools] = useState<string[]>([]);
    const [Apys, setApys] = useState<any[]>([]);
    const [ad3Approved, setAd3Approved] = useState<boolean>(false);
    const [ad3ApprovedLoading, setAd3ApprovedLoading] = useState<boolean>(false);

    const { Title } = Typography;

    const {
        account,
        chainId,
        blockNumber
    } = useModel("metaMask");

    const {
        Ad3Contract,
        StakeContract,
        FactoryContract,
        LPContract
    } = useModel('contracts');

    const handleApproveAd3 = async () => {
        const tx = await Ad3Contract?.approve(StakeContract?.address, ethers.constants.MaxUint256)
        setAd3ApprovedLoading(true);
        await tx.wait();
        setAd3Approved(true);
    };

    useEffect(() => {
        if (chainId !== 1 && chainId !== 4) {
            notification.error({
                message: 'Unsupported Chain',
                description: 'This feature is only supported on mainnet and rinkeby',
                duration: null
            });
            return;
        }//TODO: error msg
        const p: any[] = [];
        for (let i = 0; i < pairsData.length; i++) {
            p.push({ ...pairsData[i], coinAddress: pairsData[i].coinAddresses[chainId] });
        }
        setPairs(p);
    }, [chainId]);
    //get total supply
    useEffect(() => {
        if (Ad3Contract) {
            Ad3Contract.totalSupply().then((res: BigNumber) => {
                console.log(res.toString());
                setSupply(res.toBigInt());
            })
        }
    }, [Ad3Contract]);

    //update AD3 price && set pools
    const getPoolsAndPrice = useCallback(async () => {
        if (FactoryContract && chainId !== undefined) {
            if (chainId !== 1 && chainId !== 4) {
                return;
            }
            const promises = pairsData.map(async (pair) => {
                return await FactoryContract.getPool(pair.coinAddresses[chainId], contractAddresses.ad3[chainId], FeeAmount.MEDIUM)
            });
            const pools = await Promise.all(promises);
            if (!CompareArray(pools, Pools)) {
                setPools(pools);
            }
            const res = await getAd3UsdtPrice(FactoryContract);
            setAD3Price(res.toSignificant())
        }
    }, [FactoryContract, Pools, chainId])
    useEffect(() => {
        setLoading(true);
        getPoolsAndPrice();
        setLoading(false);
    }, [FactoryContract, chainId, Pools, getPoolsAndPrice]);

    //update liquidities from 
    async function getPositions() {
        const balanceKinds: BigNumber = await LPContract?.balanceOf(account);
        console.log(balanceKinds);
        if (!balanceKinds) return;
        console.log(balanceKinds);
        const tokenIndexArray: number[] = [];
        for (let i = 0; i < balanceKinds.toNumber(); i++) {
            tokenIndexArray.push(i);
        }
        const tokenIdPromises = tokenIndexArray.map(async (i) => {
            const tokenId = await LPContract?.tokenOfOwnerByIndex(account, i);
            if (parseInt(tokenId) == NaN) {
                return -1;
            }
            return tokenId;
        });
        const tokenIds = await Promise.all(tokenIdPromises);
        const positionPromises = tokenIds.map(async (tokenId) => {
            const tmp = await LPContract?.positions(tokenId);
            const position = {
                ...tmp,
                tokenId
            }
            return position;
        });
        const positions = await Promise.all(positionPromises);
        if (!CompareArray(positions, Postitions)) {
            setPostitions(positions);
        }
    };
    useEffect(() => {
        if (LPContract) {
            getPositions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [LPContract, blockNumber])

    //update APY
    const updateApy = useCallback(async () => {
        if (pairsData.length > 0 && Pools.length > 0) {
            console.log('bbbbbbbbbbbbbbbbbbb')
            const promises = pairsData.map(async (pair: any, index: number) => {
                // console.log(encode)
                const incentiveKey = {
                    rewardToken: contractAddresses.ad3[chainId],
                    pool: Pools[index],
                    startTime: pair.incentives[2].startTime,
                    endTime: pair.incentives[2].endTime,
                }
                console.log(incentiveKey);
                const incentiveId = getIncentiveId(incentiveKey);
                // console.log(incentiveId)
                const incentive = await StakeContract?.incentives(incentiveId);
                console.log('incentive', incentive);
                console.log('pool', pair);
                // console.log(new BigNumber(incentive.totalRewardUnclaimed).dividedBy(new BigNumber(10).pow(15)).toNumber())
                const time = ((Date.now() / 1000) | 0) - pair.incentives[2].startTime;
                // console.log(time)
                const apy = (pair.incentives[2].totalReward - Number(BigIntToFloatString(incentive.totalRewardUnclaimed, 18))) / time * 365 * 24 * 60 * 60 / pair.incentives[2].totalReward * 100;
                // console.log(apy)

                return `${apy > 0 ? apy.toFixed(2) : '0.00'}%`
            })

            const newApys = await Promise.all(promises);
            console.log('newApys', newApys);
            setApys(newApys);
        }
    }, [StakeContract, Pools, chainId]);

    useEffect(() => {
        if (!StakeContract || Pools.length === 0) return;
        updateApy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [StakeContract, Pools]);
    const onApprove = useCallback(async () => {
        if (!LPContract || !StakeContract) return;
        try {
            console.log('LPContract', LPContract);
            const tx = await LPContract?.setApprovalForAll(StakeContract?.address, true);
            console.log(tx);
            await tx.wait();
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }, [LPContract, StakeContract]);
    const handleApprove = useCallback(async () => {
        try {
            setRequestedApproval(true)

            const txHash = await onApprove()

            if (txHash) {
                setIsApproveAll(true);
                setRequestedApproval(false)
            }
        } catch (e) {
            console.log(e)
            setRequestedApproval(false)
        }
    }, [onApprove]);
    const getIsApprovedAll = useCallback(async () => {
        if (!LPContract || !StakeContract) return;
        setLoading(true);
        const allowance = await LPContract?.isApprovedForAll(account, StakeContract?.address)
        console.log('allowance', allowance);
        setIsApproveAll(allowance);
        setLoading(false);
    }, [LPContract, StakeContract, account]);

    useEffect(() => {
        getIsApprovedAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [LPContract, account, StakeContract]);

    return (
        <>
            {account ? (
                <Spin
                    indicator={
                        <LoadingOutlined style={{ fontSize: 60 }} spin />
                    }
                    spinning={loading}
                >
                    <div className={styles.mainBgContainer}>
                        <div className={styles.contentContainer}>
                            <div className={style.stakeContainer}>
                                <div className={style.headerContainer}>
                                    <div className={style.titleContainer}>
                                        <Title level={2}>
                                            Liquidity Mining
                                        </Title>
                                        <span className={style.description}>
                                            Stake your AD3 to earn rewards
                                        </span>
                                    </div>
                                    <Button
                                        shape='round'
                                        type='primary'
                                        size='large'
                                        onClick={() => {
                                            window.open();
                                        }}
                                    >
                                        Exchange AD3
                                    </Button>
                                    <Button
                                        shape='round'
                                        type='primary'
                                        size='large'
                                        disabled={isApprovedAll || requestedApproval}
                                        onClick={() => {
                                            handleApprove()
                                        }}
                                    >
                                        {requestedApproval ? 'pending' : isApprovedAll ? 'LP Operation Approved' : 'LP Operation Approve'}

                                    </Button>
                                </div>
                                <div className={style.stakeContainer}>
                                    {Pairs.map((pair: Pair, index: number) => {
                                        return <PairItem
                                            logo={'/images/crypto/' + pair.coin.toLowerCase() + '-circle.svg'}
                                            apy={Apys[index]}
                                            //liquidity={liquidity[index]}
                                            liquidity={BigInt('1110000000000000000000')}
                                            pair={pair}
                                            positions={Postitions}
                                            poolAddress={Pools[0]}
                                        />
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
            ) : (
                <SelectWallet />
            )}
        </>
    )
}

export default Farm;
