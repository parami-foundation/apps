import { useCallback, useEffect, useState } from 'react';
import style from '../style.less';
import { Button, Image, Space, Tooltip, Badge } from 'antd';
import { DownOutlined, FireOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Rows from './Rows';
import { useModel } from 'umi';
import { contractAddresses } from '../config';
import { FeeAmount } from '@uniswap/v3-sdk';
import { BigNumber, ethers } from 'ethers';
import { Token } from '@uniswap/sdk-core';
import ERC20_ABI from '@/pages/Dashboard/pages/Stake/abi/ERC20.json';
import { getIncentiveId, tryParseTick } from '../api/parami/util';
import { CompareArray } from '@/utils/common';
import { BigIntToFloatString } from '@/utils/format';
import { formatBalance } from '@polkadot/util';
const ICON_AD3 = '/images/logo-round-core.svg';

const PairItem = ({ logo, pair, positions, poolAddress, apy, liquidity }:
    { logo: string, pair: Pair, positions: any, poolAddress: string, apy: string[], liquidity: bigint, }) => {
    const {
        account,
        provider,
        signer,
        chainId,
        blockNumber,
    } = useModel("metaMask");
    const {
        StakeContract
    } = useModel('contracts');
    const [Collapse, setCollapse] = useState<boolean>(false);
    const [UnStakedLPs, setUnStakedLPs] = useState<Liquid[]>([]);
    const [StakedLPs, setStakedLPs] = useState<Liquid[]>([]);
    const [Rewards, setRewards] = useState<any[]>([]);
    const [IncentiveKeys, setIncentiveKeys] = useState<any[]>([]);
    const [Ticks, setTicks] = useState<any[]>([]);
    const [Token0, setToken0] = useState<Token | undefined>(undefined);
    const [Token1, setToken1] = useState<Token | undefined>(undefined);
    const getToken = async (address: string) => {
        if (chainId !== 1 && chainId !== 4 || !signer) return undefined
        const erc20_rw = new ethers.Contract(address, ERC20_ABI, signer);
        const name = await erc20_rw.name();
        const symbol = await erc20_rw.symbol();
        const decimals = await erc20_rw.decimals();
        return new Token(
            chainId,
            address,
            decimals,
            symbol,
            name
        );
    };

    const initToken = async () => {
        const newToken = await getToken(contractAddresses.ad3[chainId]);
        const newCoin = await getToken(pair.coinAddress);
        console.log(newToken, newCoin);
        setToken0(newToken);
        setToken1(newCoin);
    };
    useEffect(() => {
        if (!signer) return;
        initToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId, provider, signer]);
    useEffect(() => {
        if (Token0 && Token1) {
            const tmpTicks: any[] = [];
            for (let i = 0; i < pair.incentives.length; i++) {
                const tickLower = tryParseTick(Token0, Token1, FeeAmount.MEDIUM, pair.incentives[i].maxPrice) || 0;
                const tickUpper = tryParseTick(Token0, Token1, FeeAmount.MEDIUM, pair.incentives[i].minPrice) || 0;
                tmpTicks.push({
                    tickLower,
                    tickUpper,
                });
            }
            console.log('tmpTicks', tmpTicks);
            setTicks(tmpTicks);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Token0, Token1])
    useEffect(() => {
        if (poolAddress === '0x0000000000000000000000000000000000000000' || poolAddress === '') {
            setIncentiveKeys([]);
            return;
        }
        if (pair === undefined) return;
        const tmp: any[] = [];
        for (let i = 0; i < pair.incentives.length; i++) {
            tmp.push({
                rewardToken: contractAddresses.ad3[chainId],
                pool: poolAddress,
                startTime: pair.incentives[i].startTime,
                endTime: pair.incentives[i].endTime,
            });
        }
        setIncentiveKeys(tmp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poolAddress, chainId, pair])
    const getUnstaked = useCallback(async () => {
        if (positions.length === 0 || Ticks.length === 0) return;
        // console.log('positions', positions);
        const array = [pair.coinAddress.toLowerCase(), contractAddresses.ad3[chainId].toLowerCase()];
        const liquid: any[] = [];
        for (let i = 0; i < positions.length; i++) {
            if (positions[i].fee === FeeAmount.MEDIUM && positions[i].liquidity.toString() !== '0' && array.includes(positions[i].token0.toLowerCase()) && array.includes(positions[i].token1.toLowerCase())) {
                for (let j = 0; j < IncentiveKeys.length; j++) {
                    if (Ticks[j].tickLower <= positions[i].tickLower && positions[i].tickUpper <= Ticks[j].tickUpper) {
                        console.log('liquidity', positions[i].liquidity);
                        liquid.push({
                            tokenId: positions[i].tokenId.toNumber(),
                            staked: false,
                            tickLower: positions[i].tickLower,
                            tickUpper: positions[i].tickUpper,
                            incentiveIndex: j,
                            liquidity: positions[i].liquidity.toBigInt(),
                        });
                    }
                }
            }
        }
        // console.log('unstaked', liquid);
        setUnStakedLPs(liquid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positions, chainId, Ticks]);
    const getStaked = useCallback(async () => {
        if (!StakeContract) {
            console.log('stakeContract is null');
            return;
        }
        if (IncentiveKeys.length === 0) {
            console.log('incentiveKeys is null');
            return;
        }
        if (Ticks.length === 0) return;
        const tokenCountFromStakeManager = await StakeContract?.getUserTokenIdCount(account);
        console.log('tokenCountFromStakeManager', tokenCountFromStakeManager);
        const indexies: number[] = [];
        for (let i = 0; i < tokenCountFromStakeManager; i++) {
            indexies.push(i);
        }
        const tokenIdsPromises = indexies.map(async (tokenId) => {
            return await StakeContract['getTokenId(address,uint256)'](account, tokenId);
        })
        const tokenIds = await Promise.all(tokenIdsPromises);
        const stakesPromises = tokenIds.map(async (tokenId: BigNumber) => {
            const deposit = await StakeContract?.deposits(tokenId);
            console.log('deposit', deposit);
            for (let j = 0; j < IncentiveKeys.length; j++) {
                if (Ticks[j].tickLower <= deposit.tickLower && deposit.tickUpper <= Ticks[j].tickUpper) {
                    console.log(getIncentiveId(IncentiveKeys[j]), tokenId)
                    const stake = await StakeContract?.stakes(getIncentiveId(IncentiveKeys[j]), tokenId);
                    console.log('stake', stake);

                    return ({
                        tokenId: tokenId.toNumber(),
                        staked: true,
                        tickLower: deposit.tickLower,
                        tickUpper: deposit.tickUpper,
                        incentiveIndex: j,
                        liquidity: stake.liquidity.toBigInt(),
                    });
                }
            }
            return undefined;
        })
        const stakes: Liquid[] = (await Promise.all(stakesPromises)).filter((e) => { return e !== undefined }) as Liquid[];
        if (CompareArray(stakes, StakedLPs)) return;
        setStakedLPs(stakes);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [IncentiveKeys, StakeContract, Ticks, account, blockNumber]);
    const updateReward = useCallback(async () => {
        const promises = StakedLPs.map(async (stakedLP) => {
            const res = await StakeContract?.getAccruedRewardInfo(IncentiveKeys[stakedLP.incentiveIndex], stakedLP.tokenId);
            const tmpReward = res.reward.toBigInt();
            return { tokenId: stakedLP.tokenId, reward: tmpReward };
        });
        const rewards = await Promise.all(promises);
        // console.log('rewards', rewards);
        if (CompareArray(rewards, Rewards)) return;
        setRewards(rewards);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [StakedLPs, StakeContract, IncentiveKeys]);
    useEffect(() => {
        if (!StakeContract) return;
        if (StakedLPs.length === 0) return;
        updateReward();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockNumber, StakeContract, StakedLPs]);
    useEffect(() => {
        if (positions.length > 0) {
            getUnstaked();
        } else {
            setUnStakedLPs([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positions, Ticks]);
    useEffect(() => {
        getStaked();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [StakeContract, Ticks, IncentiveKeys, blockNumber]);

    return (
        <Badge.Ribbon
            text={
                <>
                    <Space>
                        <FireOutlined />
                        Double reward
                    </Space>
                </>
            }
        >
            <div className={style.stakeItem}>
                <div className={style.stakeMain}>
                    <div className={style.tokenPair}>
                        <div className={style.tokenIcons}>
                            <Image
                                src={ICON_AD3}
                                preview={false}
                                className={style.icon}
                            />
                            <Image
                                src={logo}
                                preview={false}
                                className={style.icon}
                            />
                        </div>
                        <div className={style.tokenNameAndRate}>
                            <div className={style.tokenName}>
                                {pair.name}
                            </div>
                            <div className={style.tokenRate}>
                                <Space>
                                    Fee Tier
                                    <strong>0.3%</strong>
                                </Space>
                            </div>
                        </div>
                    </div>
                    <div className={style.tokenAPY}>
                        <div className={style.title}>
                            APY(1y)
                        </div>
                        <div className={style.value}>
                            {apy[0]}
                            <Tooltip
                                placement="bottom"
                                title={'The APR value is calculated based on the current data, which changes as the user deposition changes.'}
                            >
                                <InfoCircleOutlined className={style.tipButton} />
                            </Tooltip>
                        </div>
                    </div>
                    <div className={style.tokenLiquidity}>
                        <div className={style.title}>
                            Total Liquidity({pair.coin})
                        </div>
                        <div className={style.value}>
                            {formatBalance(liquidity, { withUnit: pair.coin }, 18)}
                            <Tooltip
                                placement="bottom"
                                title={'The liquidity value is an estimation that only calculates the liquidity lies in the reward range.'}
                            >
                                <InfoCircleOutlined className={style.tipButton} />
                            </Tooltip>
                        </div>
                    </div>
                    <div className={style.tokenRewardRange}>
                        <div className={style.title}>
                            Reward Range
                        </div>
                        <div className={style.value}>
                            {pair.incentives[0].minPrice}-{pair.incentives[2].maxPrice + ' ' + pair.coin + '/AD3'}
                            {/* <Tooltip
                                placement="bottom"
                                title={'The APR value is calculated based on the current data, which changes as the user deposition changes.'}
                            >
                                <InfoCircleOutlined className={style.tipButton} />
                            </Tooltip> */}
                        </div>
                    </div>
                    <div className={style.expandButton}>
                        <Button
                            type="link"
                            icon={
                                <DownOutlined
                                    rotate={!Collapse ? 0 : -180}
                                    className={style.expandButtonIcon}
                                />
                            }
                            onClick={() => {
                                setCollapse(prev => !prev);
                            }}
                        />
                    </div>
                </div>
                <Rows
                    collapse={Collapse}
                    stakedLPs={StakedLPs}
                    unstakedLPs={UnStakedLPs}
                    rewards={Rewards}
                    pair={pair}
                    poolAddress={poolAddress}
                    apys={apy}
                />
            </div>
        </Badge.Ribbon>
    )
}
export default PairItem;


