import { useCallback, useState, useEffect } from 'react';
import { FeeAmount } from '@uniswap/v3-sdk';
import type BigNumber from 'bignumber.js';
import { Button, Table, Image, PageHeader, Space, Spin } from 'antd';
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
    const [minTick, setMinTick] = useState(0)
    const [maxTick, setMaxTick] = useState(0)
    const [token, setToken] = useState<Token>();
    const [coin, setCoin] = useState<Token>();
    const [liquidities, setLiquidities] = useState<any[]>([])
    const [isApprovedAll, setIsApproveAll] = useState(false);
    const [loading, setLoading] = useState(false);

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
        if (!LPContract) return;
        setLoading(true);
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
        const liquid: any[] = [];
        for (let i = 0; i < positions.length; i++) {
            if (positions[i].fee === FeeAmount.MEDIUM && positions[i].liquidity.toString() !== '0' && array.includes(positions[i].token0.toLowerCase()) && array.includes(positions[i].token1.toLowerCase())) {
                // const stakes = await stakeContract?.stakes(getIncentiveId(incentiveKey), positions[i].tokenId);
                // console.log(stakes);
                // if (stakes.owner==='0x0000000000000000000000000000000000000000') {
                //     liquid.push({ tokenId: positions[i].tokenId, status: 'unstaked' });
                // } else {
                //     liquid.push({ tokenId: positions[i].tokenId, status: 'staked' });
                // }
                liquid.push({ tokenId: positions[i].tokenId.toNumber(), status: 'unstaked', minTick: 0, maxTick: 0 });
            }
        }
        console.log('liquid', liquid);
        const tokenCountFromStakeManager = await stakeContract?.getUserTokenIdCount(account);
        console.log('tokenCountFromStakeManager', tokenCountFromStakeManager);
        for (let i = 0; i < tokenCountFromStakeManager; i++) {
            const tokenId = await stakeContract['getTokenId(address,uint256)'](account, i);
            console.log('tokenId', tokenId);
            if (tokenId) {
                const stake = await stakeContract?.deposits(tokenId);
                console.log('stake', stake);
                liquid.push({ tokenId: tokenId.toNumber(), status: 'staked', minTick: stake.tickLower, maxTick: stake.tickUpper });
            }
        }
        console.log('liquid2', liquid);
        for (let i = 0; i < liquid.length; i++) {
            if (liquid[i].status === 'unstaked') {
                liquid[i] = { ...liquid[i], reward: '0' }
            } else {
                console.log('incentiveId', (incentiveKey));
                console.log('tokenId', liquid[i].tokenId);
                const { reward } = await stakeContract?.getAccruedRewardInfo(incentiveKey, liquid[i].tokenId);
                console.log('reward', reward);
                liquid[i] = { ...liquid[i], reward: BigIntToFloatString(reward.toString(), 18) };
            }
        }
        console.log('liquid3', liquid);
        setLiquidities(liquid);
        setLoading(false);
    };

    useEffect(() => {
        if (!LPContract || account === '') {
            return;
        }
        getStakeStatus();
    }, [LPContract, account, blockNumber]);
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
    }, [stakeContract, LPContract, account]);

    const handleStake = useCallback(async (tokenId) => {
        pendingStake[tokenId] = true;
        setPendingStake(pendingStake);
        console.log(incentiveKey, tokenId);
        try {
            const tx = await stakeContract?.depositToken(incentiveKey, tokenId)
            await tx.wait();
            pendingStake[tokenId] = false
            setPendingStake(pendingStake)
        } catch (e) {
            console.error(e)
            pendingStake[tokenId] = false
            setPendingStake(pendingStake)
        }
    }, [stakeContract, incentiveKey, account]);

    const handleUnstake = useCallback(
        async (tokenId) => {
            pendingUnstake[tokenId] = true
            setPendingUnstake(pendingUnstake)

            try {
                //unstake
                await stakeContract?.unstakeToken(incentiveKey, tokenId, account)
                pendingUnstake[tokenId] = false
                setPendingUnstake(pendingUnstake)
            } catch (e) {
                console.error(e)
                pendingUnstake[tokenId] = false
                setPendingUnstake(pendingUnstake)
            }
        },
        [stakeContract, incentiveKey, account]
    )

    const handleClaim = useCallback(async (tokenId, amount) => {
        pendingClaim[tokenId] = true
        setPendingClaim(pendingClaim)
        try {
            await stakeContract?.claimReward(incentiveKey, tokenId, account, FloatStringToBigInt(amount, 18).toString());
            pendingClaim[tokenId] = false
            setPendingClaim(pendingClaim)
        } catch (e) {
            console.error(e)
            pendingClaim[tokenId] = false
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


    const columns = [
        {
            title: 'Token',
            dataIndex: 'tokenId',
            key: 'tokenId',
        },
        {
            title: 'Reward',
            dataIndex: 'reward',
            key: 'tokenId',
        },
        {
            title: 'Action',
            key: 'tokenId',
            width: 300,
            render: (item) => (
                <>
                    <Space>
                        <Button
                            type='primary'
                            shape='round'
                            size='large'
                            onClick={item.status === 'staked' ? () => handleUnstake(item.tokenId) : () => handleStake(item.tokenId)}
                        >
                            {item.status === 'staked' ? 'Unstake' : 'Stake'}
                        </Button>
                        <Button
                            type='primary'
                            shape='round'
                            size='large'
                            disabled={item.reward === '0'}
                            onClick={() => handleClaim(item.tokenId, item.reward)}
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
                            onClick={handleCreateIncentive}
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
