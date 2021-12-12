import { useCallback, useState, useEffect } from 'react';
import { FeeAmount } from '@uniswap/v3-sdk';
import type BigNumber from 'bignumber.js';
import { Button, Table, Image, PageHeader, Space } from 'antd';
import { Token } from '@uniswap/sdk-core';
import { useModel, useIntl } from 'umi';
import { ethers } from 'ethers';
import LP_ABI from '@/pages/Dashboard/pages/Stake/abi/ERC721-ABI.json';
import ERC20_ABI from '@/pages/Dashboard/pages/Stake/abi/ERC20.json';
import { getIncentiveId, tryParseTick } from '../api/parami/util';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';

const Rows = ({ row }: { row: any; }) => {
    const {
        account,
        provider,
        signer,
        chainId,
        stakeContract,
        blockNumber,
    } = useModel("metaMask");
    const [LPContract, setLPContract] = useState<ethers.Contract>()
    const [requestedApproval, setRequestedApproval] = useState(false)
    const [pendingStake, setPendingStake] = useState<(true | false)[]>([])
    const [pendingUnstake, setPendingUnstake] = useState<(true | false)[]>([])
    const [pendingClaim, setPendingClaim] = useState<(true | false)[]>([])
    const [claimList, setClaimList] = useState<{ tokenId: string; amount: string; }[]>([])
    const [positions, setPositions] = useState<any[]>([]);
    const [minTick, setMinTick] = useState(0)
    const [maxTick, setMaxTick] = useState(0)
    const [token, setToken] = useState<Token>();
    const [coin, setCoin] = useState<Token>();
    const [liquidities, setLiquidities] = useState<any[]>([])
    const [isApprovedAll, setIsApproveAll] = useState(false);

    const intl = useIntl();

    useEffect(() => {
        console.log(account)
    }, [account]);

    const { coinAddress, tokenAddress, startTime, endTime, poolAddress, totalReward, minPrice, maxPrice } = row;

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

    const fetchPositions = async () => {
        // 1
        const balanceKinds: BigNumber = await LPContract?.balanceOf(account);
        console.log(balanceKinds);
        if (!balanceKinds) return;
        console.log(balanceKinds);
        // if (typeof(balance)==='BigNumber') {
        //     console.log('balanceOf error:', balance);
        //     setPositions([]);
        //     return [];
        // }
        const newPositions: any[] = [];
        for (let i = 0; i < balanceKinds.toNumber(); i++) {
            // 2
            const newToken = await LPContract?.tokenOfOwnerByIndex(account, i);
            if (parseInt(newToken) == NaN) {
                return [];
            }
            // 3
            const tmp = await LPContract?.positions(newToken);
            const position = {
                ...tmp,
                tokenId: newToken
            }
            // console.log(position);
            newPositions.push(position);
        }
        console.log('positions', newPositions);
        setPositions(newPositions);
        return newPositions;
    };

    useEffect(() => {
        fetchPositions();
    }, [LPContract]);

    useEffect(() => {
        if (!provider || !signer) return;
        try {
            const lpContract = new ethers.Contract(row.lpAddress, LP_ABI, provider);
            const lpContract_rw = lpContract.connect(signer);
            setLPContract(lpContract_rw);
        } catch (e) {
            console.log(e)
        }
        initToken();
    }, [chainId, provider, signer]);

    const onApprove = useCallback(async () => {
        if (!LPContract) return;
        try {
            console.log('LPContract', LPContract);
            const tx = await LPContract?.setApprovalForAll(stakeContract?.address, true);
            console.log(tx);
            await tx.wait();
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }, [LPContract, stakeContract, account]);

    const getIsApprovedAll = useCallback(async () => {
        const allowance = await LPContract?.isApprovedForAll(account, stakeContract?.address)
        console.log('allowance', allowance);
        setIsApproveAll(allowance);
    }, [LPContract, stakeContract, account]);

    useEffect(() => {
        getIsApprovedAll();
    }, [LPContract, account, stakeContract]);

    useEffect(() => {
        if (token && coin) {
            console.log(token, coin, minPrice, maxPrice);
            const newMinTick = tryParseTick(token, coin, FeeAmount.MEDIUM, minPrice) //|| 0
            const newMaxTick = tryParseTick(token, coin, FeeAmount.MEDIUM, maxPrice)// || 0
            // console.log(minTick, maxTick);
            setMinTick(newMinTick === undefined ? 0 : newMinTick);
            setMaxTick(newMaxTick === undefined ? 0 : newMaxTick);
        }
    }, [token, coin])

    const incentiveKey = {
        rewardToken: tokenAddress,
        pool: poolAddress,
        startTime,
        endTime,
    };

    const getStakeStatus = async () => {
        const array = [coinAddress.toLowerCase(), tokenAddress.toLowerCase()];
        const liquid: any[] = [];
        for (let i = 0; i < positions.length; i++) {
            if (array.includes(positions[i].token0.toLowerCase()) && array.includes(positions[i].token1.toLowerCase())) {
                const stakes = await stakeContract?.stakes(getIncentiveId(incentiveKey), positions[i].tokenId);
                console.log(stakes);
                if (stakes.owner && stakes.owner === account) {
                    liquid.push({ tokenId: positions[i].tokenId, status: 'staked' });
                } else {
                    liquid.push({ tokenId: positions[i].tokenId, status: 'unstaked' });
                }
            }
        }
        setLiquidities(liquid);
    };

    useEffect(() => {
        getStakeStatus();
    }, [coinAddress, tokenAddress, positions, blockNumber]);

    const getRewardInfo = async (newIncentiveKey: {}, tokenId: string) => {
        const { reward } = stakeContract?.getAccruedRewardInfo(getIncentiveId(newIncentiveKey), tokenId);
        console.log(reward)
        return reward
    };

    const fetchToClaim = useCallback(async () => {
        if (!liquidities.length) {
            setClaimList([])
            return
        }
        try {
            const promises = liquidities.map(({ tokenId, status }) => {
                if (status === 'staked') getRewardInfo(incentiveKey, tokenId.toString())
            })

            const amounts = await Promise.all(promises)
            // console.log(amounts)
            const newClaimList = liquidities.map(({ tokenId, status }, i) => {
                if (status === 'staked') {
                    return {
                        tokenId: tokenId.toString(),
                        amount: `${amounts[i]}`,
                    }
                } else {
                    return ({
                        tokenId: tokenId,
                        amount: '0'
                    })
                }
            }
            )
            setClaimList(newClaimList.sort((a: any, b: any) => b.tokenId - a.tokenId));
        } catch (e) {
            console.error(e)
        }
    }, [liquidities, blockNumber]);

    useEffect(() => {
        if (liquidities.length) {
            fetchToClaim()
        }
    }, [liquidities, blockNumber]);

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
    }, [stakeContract, LPContract, account]);

    const handleStake = useCallback(async (tokenId, idx) => {
        pendingStake[idx] = true;
        setPendingStake(pendingStake);
        console.log(incentiveKey, tokenId);
        try {
            const tx = await stakeContract?.depositToken(incentiveKey, tokenId)
            await tx.wait();
            pendingStake[idx] = false
            setPendingStake(pendingStake)
        } catch (e) {
            console.error(e)
            pendingStake[idx] = false
            setPendingStake(pendingStake)
        }
    }, [stakeContract, incentiveKey, account]);

    const handleUnstake = useCallback(
        async (tokenId, idx) => {
            pendingUnstake[idx] = true
            setPendingUnstake(pendingUnstake)

            try {
                //unstake
                await stakeContract?.unstakeToken(incentiveKey, tokenId, account)
                pendingUnstake[idx] = false
                setPendingUnstake(pendingUnstake)
            } catch (e) {
                console.error(e)
                pendingUnstake[idx] = false
                setPendingUnstake(pendingUnstake)
            }
        },
        [stakeContract, incentiveKey, account]
    )

    const handleClaim = useCallback(async (tokenId, amount, idx) => {
        pendingClaim[idx] = true
        setPendingClaim(pendingClaim)
        try {
            await stakeContract?.claimReward(incentiveKey, tokenId, account, amount);
            pendingClaim[idx] = false
            setPendingClaim(pendingClaim)
        } catch (e) {
            console.error(e)
            pendingClaim[idx] = false
            setPendingClaim(pendingClaim)
        }
    }, [stakeContract, incentiveKey, account]);

    const handleCreateIncentive = useCallback(async () => {
        try {
            const total = FloatStringToBigInt(String(totalReward), 18);
            console.log(total, totalReward)
            console.log(total.toString())
            console.log(minTick)
            console.log(maxTick)
            const res = await stakeContract?.createIncentive(incentiveKey, total.toString(), minTick, maxTick);
            console.log(res);
        } catch (e) {
            console.error(e)
        }
    }, [incentiveKey, minTick, maxTick, stakeContract, totalReward]);

    const handleCancelIncentive = useCallback(async () => {
        await stakeContract?.cancelIncentive(incentiveKey)
    }, [incentiveKey]);

    // const liquidities = [...toStakes].sort((a: any, b: any) => b.tokenId - a.tokenId);
    // console.log(account);
    const data = [
        {
            tokenId: 1,
            reward: 2,
            status: 'staked'
        }
    ];

    const columns = [
        {
            title: 'Token',
            dataIndex: 'tokenId',
            key: 'tokenId',
        },
        {
            title: 'Reward',
            dataIndex: 'reward',
            key: 'reward',
        },
        {
            title: 'Action',
            key: 'Action',
            width: 300,
            render: (item) => (
                <>
                    <Space>
                        {item.status === 'staked' && (
                            <Button
                                type='primary'
                                shape='round'
                                size='large'
                            >
                                Unstake
                            </Button>
                        )}
                        <Button
                            type='primary'
                            shape='round'
                            size='large'
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
                        >
                            {intl.formatMessage({
                                id: 'dashboard.stake.cancelIncentive',
                                defaultMessage: 'Cancel Incentive',
                            })}
                        </Button>,
                    ]}
                />
            )}
            <Table
                columns={columns}
                dataSource={data}
                bordered={false}
                pagination={false}
            />
        </>
    )
}

export default Rows
