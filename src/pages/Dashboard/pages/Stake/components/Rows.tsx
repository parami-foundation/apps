import { useCallback, useState, useEffect } from 'react';
import { FeeAmount } from '@uniswap/v3-sdk';
import type BigNumber from 'bignumber.js';
import { Button, Table, PageHeader, Space, Spin } from 'antd';
import { Token } from '@uniswap/sdk-core';
import { useModel, useIntl } from 'umi';
import { ethers } from 'ethers';
import LP_ABI from '@/pages/Dashboard/pages/Stake/abi/ERC721-ABI.json';
import ERC20_ABI from '@/pages/Dashboard/pages/Stake/abi/ERC20.json';
import { getIncentiveId, tryParseTick } from '../api/parami/util';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';

const Rows = ({ row }: { row: any; }) => {
    const apiWs = useModel('apiWs');
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
    const [LPContract, setLPContract] = useState<ethers.Contract>()
    const [requestedApproval, setRequestedApproval] = useState(false)
    const [pendingStake, setPendingStake] = useState<(true | false)[]>([])
    const [pendingUnstake, setPendingUnstake] = useState<(true | false)[]>([])
    const [pendingClaim, setPendingClaim] = useState<(true | false)[]>([])
    const [ticks, setTicks] = useState<any[]>([]);
    const [token, setToken] = useState<Token>();
    const [coin, setCoin] = useState<Token>();
    const [liquidities, setLiquidities] = useState<any[]>([])
    const [isApprovedAll, setIsApproveAll] = useState(true);
    const [loading, setLoading] = useState(false);

    const intl = useIntl();

    useEffect(() => {
        console.log(account)

    }, [account]);

    const { coinAddress, tokenAddress, incentives, poolAddress } = row;

    const getToken = async (address: string) => {
        if (!chainId || !provider || !signer) return undefined
        const erc20 = new ethers.Contract(address, ERC20_ABI, provider);
        const erc20_rw = erc20.connect(signer);
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
        const newToken = await getToken(row.tokenAddress);
        const newCoin = await getToken(row.coinAddress);
        console.log(newToken, newCoin);
        setToken(newToken);
        setCoin(newCoin);
    };

    useEffect(() => {
        if (apiWs) {
            if (!provider || !signer) return;
            try {
                const lpContract = new ethers.Contract(row.lpAddress, LP_ABI, provider);
                const lpContract_rw = lpContract.connect(signer);
                setLPContract(lpContract_rw);
            } catch (e) {
                console.log(e)
            }
            initToken();
        }
    }, [chainId, provider, signer, apiWs]);

    const onApprove = useCallback(async () => {
        if (!LPContract) return;
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
    }, [LPContract, StakeContract, account]);

    const getIsApprovedAll = useCallback(async () => {
        if (!LPContract) return;
        setLoading(true);
        const allowance = await LPContract?.isApprovedForAll(account, StakeContract?.address)
        console.log('allowance', allowance);
        setIsApproveAll(allowance);
    }, [LPContract, StakeContract, account]);

    useEffect(() => {
        getIsApprovedAll();
    }, [LPContract, account, StakeContract]);

    useEffect(() => {
        if (token && coin) {

            // FIXIT:aaa
            const tmpTicks = [
                {
                    tickLower: tryParseTick(token, coin, FeeAmount.MEDIUM, incentives[0].maxPrice) || 0,
                    tickUpper: tryParseTick(token, coin, FeeAmount.MEDIUM, incentives[0].minPrice) || 0
                },
                {
                    tickLower: tryParseTick(token, coin, FeeAmount.MEDIUM, incentives[1].maxPrice) || 0,
                    tickUpper: tryParseTick(token, coin, FeeAmount.MEDIUM, incentives[1].minPrice) || 0
                },
                {
                    tickLower: tryParseTick(token, coin, FeeAmount.MEDIUM, incentives[2].maxPrice) || 0,
                    tickUpper: tryParseTick(token, coin, FeeAmount.MEDIUM, incentives[2].minPrice) || 0
                }
            ]
            //FIXIT:111
            console.log(token, coin);
            console.log('tmpTicks', tmpTicks);
            setTicks(tmpTicks);
        }
    }, [token, coin])

    const incentiveKeys = [
        {
            rewardToken: tokenAddress,
            pool: poolAddress,
            startTime: incentives[0].startTime,
            endTime: incentives[0].endTime,
        },
        {
            rewardToken: tokenAddress,
            pool: poolAddress,
            startTime: incentives[1].startTime,
            endTime: incentives[1].endTime,
        },
        {
            rewardToken: tokenAddress,
            pool: poolAddress,
            startTime: incentives[2].startTime,
            endTime: incentives[2].endTime,
        },
    ];


    async function getStakeStatus() {
        const balanceKinds: BigNumber = await LPContract?.balanceOf(account);
        console.log(balanceKinds);
        if (!balanceKinds) return;
        console.log(balanceKinds);
        const positions: any[] = [];
        for (let i = 0; i < balanceKinds.toNumber(); i++) {
            // 2
            const newToken = await LPContract?.tokenOfOwnerByIndex(account, i);
            if (parseInt(newToken) == NaN) {
                return;
            }
            // 3
            const tmp = await LPContract?.positions(newToken);
            const position = {
                ...tmp,
                tokenId: newToken
            }
            // console.log(position);
            positions.push(position);
        }
        console.log('positions', positions);
        const array = [coinAddress.toLowerCase(), tokenAddress.toLowerCase()];
        console.log('array', array);
        const liquid: any[] = [];
        for (let i = 0; i < positions.length; i++) {
            if (positions[i].fee === FeeAmount.MEDIUM && positions[i].liquidity.toString() !== '0' && array.includes(positions[i].token0.toLowerCase()) && array.includes(positions[i].token1.toLowerCase())) {
                for (let j = 0; j < incentiveKeys.length; j++) {
                    if (ticks[j].tickLower <= positions[i].tickLower && positions[i].tickUpper <= ticks[j].tickUpper) {
                        liquid.push({
                            tokenId: positions[i].tokenId.toNumber(),
                            status: 'unstaked',
                            tickLower: positions[i].tickLower,
                            tickUpper: positions[i].tickUpper,
                            incentiveIndex: j
                        });
                    }
                }
            }
        }
        console.log('liquid', liquid);
        const tokenCountFromStakeManager = await StakeContract?.getUserTokenIdCount(account);
        console.log('tokenCountFromStakeManager', tokenCountFromStakeManager);
        for (let i = 0; i < tokenCountFromStakeManager; i++) {
            if (!StakeContract) {
                console.log('StakeContract is null');
                return;
            }
            const tokenId = await StakeContract['getTokenId(address,uint256)'](account, i);
            console.log('tokenId', tokenId);
            if (tokenId) {
                const stake = await StakeContract?.deposits(tokenId);
                console.log('staked', stake);
                for (let j = 0; j < incentiveKeys.length; j++) {
                    if (ticks[j].tickLower <= stake.tickLower && stake.tickUpper <= ticks[j].tickUpper) {
                        liquid.push({ tokenId: tokenId.toNumber(), status: 'staked', tickLower: stake.tickLower, tickUpper: stake.tickUpper, incentiveIndex: j });
                    }
                }
            }
        }
        console.log('liquid2', liquid);
        for (let i = 0; i < liquid.length; i++) {
            if (liquid[i].status === 'unstaked') {
                liquid[i] = { ...liquid[i], reward: '0' }
            } else {
                console.log('incentiveId', (incentiveKeys));
                console.log('tokenId', liquid[i].tokenId);
                console.log('incentiveKey', incentiveKeys[liquid[i].incentiveIndex]);
                try {
                    const res = await StakeContract?.getAccruedRewardInfo(incentiveKeys[liquid[i].incentiveIndex], liquid[i].tokenId);
                    console.log(res);
                    const reward = BigIntToFloatString(res.reward, 18);
                    console.log('reward', reward);
                    liquid[i] = { ...liquid[i], reward: reward };
                } catch (e) {
                    console.log('error', e);
                    liquid[i] = { ...liquid[i], reward: '0' };
                }
            }
        }
        console.log('liquid3', liquid);
        setLiquidities(liquid);
        setLoading(false);
    };

    useEffect(() => {
        if (!LPContract || account === '' || ticks.length < 3) {
            return;
        }
        if (apiWs) {
            getStakeStatus();
        }
    }, [LPContract, account, blockNumber, ticks, apiWs]);
    // approve NFT
    const handleApprove = useCallback(async () => {
        try {
            setRequestedApproval(true)

            const txHash = await onApprove()

            if (txHash) {
                setRequestedApproval(false)
            }
        } catch (e) {
            console.log(e)
            setRequestedApproval(false)
        }
    }, [StakeContract, LPContract, account]);

    const handleStake = useCallback(async (tokenId, incentiveIndex) => {
        pendingStake[tokenId] = true;
        setPendingStake(pendingStake);
        console.log(incentiveKeys[incentiveIndex], tokenId);
        try {
            const tx = await StakeContract?.depositToken(incentiveKeys[incentiveIndex], tokenId)
            await tx.wait();
            pendingStake[tokenId] = false
            setPendingStake(pendingStake)
        } catch (e) {
            console.error(e)
            pendingStake[tokenId] = false
            setPendingStake(pendingStake)
        }
    }, [StakeContract, incentiveKeys, account]);

    const handleUnstake = useCallback(
        async (tokenId, incentiveIndex) => {
            pendingUnstake[tokenId] = true
            setPendingUnstake(pendingUnstake)

            try {
                //unstake
                await StakeContract?.unstakeToken(incentiveKeys[incentiveIndex], tokenId, account)
                pendingUnstake[tokenId] = false
                setPendingUnstake(pendingUnstake)
            } catch (e) {
                console.error(e)
                pendingUnstake[tokenId] = false
                setPendingUnstake(pendingUnstake)
            }
        },
        [StakeContract, incentiveKeys, account]
    )

    const handleClaim = useCallback(async (tokenId, amount, incentiveIndex) => {
        pendingClaim[tokenId] = true
        setPendingClaim(pendingClaim)
        try {
            await StakeContract?.claimReward(incentiveKeys[incentiveIndex], tokenId, account, FloatStringToBigInt(amount, 18).toString());
            pendingClaim[tokenId] = false
            setPendingClaim(pendingClaim)
        } catch (e) {
            console.error(e)
            pendingClaim[tokenId] = false
            setPendingClaim(pendingClaim)
        }
    }, [StakeContract, incentiveKeys, account]);

    const handleCreateIncentives = useCallback(async () => {
        try {
            //todo: total Reward
            //incentives[i].totalReward
            const total = FloatStringToBigInt(String(1000), 18);
            console.log('Create Incentives', total.toString())

            const res = await StakeContract?.createIncentive(incentiveKeys[0], total.toString(), ticks[0].tickLower, ticks[0].tickUpper);
            const res1 = await StakeContract?.createIncentive(incentiveKeys[1], total.toString(), ticks[1].tickLower, ticks[1].tickUpper);
            const res2 = await StakeContract?.createIncentive(incentiveKeys[2], total.toString(), ticks[2].tickLower, ticks[2].tickUpper);
            console.log(res, res1, res2);
        } catch (e) {
            console.error(e)
        }
    }, [incentiveKeys, StakeContract]);

    const handleCancelIncentive = useCallback(async () => {
        alert('TODO: cancel incentive')
        //await StakeContract?.cancelIncentive(incentiveKey)
    }, [incentiveKeys]);


    const columns = [
        {
            title: 'Token',
            dataIndex: 'tokenId',
            //key: 'tokenId',
        },
        {
            title: 'Reward (AD3)',
            dataIndex: 'reward',
            //key: 'tokenId',
        },
        {
            title: 'Action',
            //key: 'tokenId',
            width: 300,
            render: (item) => (
                <>
                    <Space>
                        <Button
                            type='primary'
                            shape='round'
                            size='large'
                            onClick={item.status === 'staked' ? () => handleUnstake(item.tokenId, item.incentiveIndex) : () => handleStake(item.tokenId, item.incentiveIndex)}
                        >
                            {item.status === 'staked' ? 'Unstake' : 'Stake'}
                        </Button>
                        <Button
                            type='primary'
                            shape='round'
                            size='large'
                            disabled={item.reward === '0'}
                            onClick={() => handleClaim(item.tokenId, item.reward, item.incentiveIndex)}
                        >
                            Claim
                        </Button>
                    </Space>
                </>
            ),
        },
    ];

    return (
        <>

            {account == '0x2c71b3e0b068c4d365add4035dc7f8eb6dc6c910' && (
                <PageHeader
                    ghost={false}
                    title={intl.formatMessage({
                        id: 'dashboard.stake.admin',
                        defaultMessage: 'Admin',
                    })}
                    extra={[
                        <Button
                            size='large'
                            shape='round'
                            type='primary'
                            onClick={handleCreateIncentives}
                        >
                            {intl.formatMessage({
                                id: 'dashboard.stake.createIncentive',
                                defaultMessage: 'Create Incentive',
                            })}
                        </Button>,
                        <Button
                            size='large'
                            shape='round'
                            type='primary'
                            onClick={handleCancelIncentive}
                        >
                            {intl.formatMessage({
                                id: 'dashboard.stake.cancelIncentive',
                                defaultMessage: 'Cancel Incentive',
                            })}
                        </Button>,
                    ]}
                />
            )}
            {
                !isApprovedAll &&
                <PageHeader
                    extra={[<Button size='large'
                        shape='round'
                        type='primary'
                        disabled={requestedApproval}
                        onClick={handleApprove}
                    >{requestedApproval ? 'Pending' : 'Approve LP Operation'}
                    </Button>
                    ]}
                />
            }
            {loading ? (<Spin
                spinning={loading}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}
            />) :
                (<Table
                    columns={columns}
                    dataSource={liquidities}
                    bordered={false}
                    pagination={false}
                />)
            }
        </>
    )
}

export default Rows
