import React, { useCallback, useEffect, useState } from 'react';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Button, Typography, Spin, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import { getAd3Price } from './api/uniswap/pool';
import { contractAddresses, pairsData } from './config';
import { FeeAmount } from '@uniswap/v3-sdk';
import { CompareArray } from '@/utils/common';
import { getIncentiveId } from './api/parami/util';
import { BigIntToFloatString } from '@/utils/format';
import PairItem from './components/PairItem';
import ERC20_ABI from './abi/ERC20.json';
import ETHAddress from '../../components/ETHAddress/ETHAddress';
import SelectWallet from '../../components/SelectWallet';
import { isMainnetOrRinkeby } from '@/utils/chain.util';

const Farm: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [Postitions, setPostitions] = useState<any[]>([]);
	const [isApprovedAll, setIsApproveAll] = useState(true);
	const [requestedApproval, setRequestedApproval] = useState(false);
	const [Pairs, setPairs] = useState<any[]>([]);
	const [Balances, setBalances] = useState<BigNumber[]>([]);
	const [AD3Price, setAD3Price] = useState('0');
	const [Pools, setPools] = useState<string[]>([]);
	const [Apys, setApys] = useState<string[][]>([]);
	const [WalletReady, setWalletReady] = useState(false);

	const { Title } = Typography;

	const {
		Account,
		ChainId,
		BlockNumber,
		Signer,
	} = useModel("web3");

	const {
		Ad3Contract,
		StakeContract,
		FactoryContract,
		LPContract
	} = useModel('contracts');

	useEffect(() => {
		if (!isMainnetOrRinkeby(ChainId)) {
			notification.error({
				message: 'Unsupported Chain',
				description: 'This feature is only supported on mainnet and rinkeby',
				duration: null
			});
			setWalletReady(false);
			return;
		}
		if (Account && Account !== '') {
			setWalletReady(true);
		}
	}, [ChainId, Account]);

	useEffect(() => {
		if (!isMainnetOrRinkeby(ChainId)) {
			return;
		}
		const p: any[] = [];
		for (let i = 0; i < pairsData.length; i++) {
			p.push({ ...pairsData[i], coinAddress: pairsData[i].coinAddresses[ChainId] });
		}
		setPairs(p);
	}, [ChainId]);

	// get total supply
	useEffect(() => {
		if (Ad3Contract) {
			Ad3Contract.totalSupply().then((res: BigNumber) => {
				console.log(res.toString());
				// setSupply(res.toBigInt());
			})
		}
	}, [Ad3Contract]);

	// get LPContract's balance
	const getLPBalance = async () => {
		if (!isMainnetOrRinkeby(ChainId)) {
			return;
		}
		if (Signer && Pools.length > 0) {
			const eth_rw = new ethers.Contract(contractAddresses.weth[ChainId], ERC20_ABI, Signer);
			const usdt_rw = new ethers.Contract(contractAddresses.usdt[ChainId], ERC20_ABI, Signer);
			const usdc_rw = new ethers.Contract(contractAddresses.usdc[ChainId], ERC20_ABI, Signer);
			const erc20Array = [eth_rw, usdt_rw, usdc_rw];
			const balancePromises = erc20Array.map(async (erc20, index) => {
				return await erc20.balanceOf(Pools[index]);
			});
			const balances = await Promise.all(balancePromises);
			if (!CompareArray(balances, Balances)) {
				setBalances(balances);
				console.log('balances', balances);
			}
		}
	}

	useEffect(() => {
		getLPBalance();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ChainId, Signer, Pools]);

	// update AD3 price && set pools
	const getPoolsAndPrice = useCallback(async () => {
		if (FactoryContract && ChainId !== undefined) {
			if (!isMainnetOrRinkeby(ChainId)) {
				return;
			}
			const promises = pairsData.map(async (pair) => {
				return await FactoryContract.getPool(pair.coinAddresses[ChainId], contractAddresses.ad3[ChainId], FeeAmount.MEDIUM)
			});
			const pools = await Promise.all(promises);
			if (!CompareArray(pools, Pools)) {
				setPools(pools);
			}
			const res = await getAd3Price(FactoryContract, pairsData[1].coinAddresses[ChainId]);//USDT
			if (res) {
				setAD3Price(res.toSignificant())
			}
		}
	}, [FactoryContract, Pools, ChainId]);

	useEffect(() => {
		setLoading(true);
		getPoolsAndPrice();
		setLoading(false);
	}, [FactoryContract, ChainId, Pools, getPoolsAndPrice]);

	// update liquidities from 
	const getPositions = async () => {
		const balanceKinds: BigNumber = await LPContract?.balanceOf(Account);
		if (!balanceKinds) return;
		const tokenIndexArray: number[] = [];
		for (let i = 0; i < balanceKinds.toNumber(); i++) {
			tokenIndexArray.push(i);
		}
		const tokenIdPromises = tokenIndexArray.map(async (i) => {
			const tokenId = await LPContract?.tokenOfOwnerByIndex(Account, i);
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
	}, [LPContract, BlockNumber]);

	//update APY
	const updateApy = useCallback(async () => {
		if (pairsData.length > 0 && Pools.length > 0) {
			const allApys: any[] = [];
			for (let i = 0; i < pairsData.length; i++) {
				const promises = pairsData[i].incentives.map(async (incentive) => {
					const incentiveKey = {
						rewardToken: contractAddresses.ad3[ChainId],
						pool: Pools[i],
						startTime: incentive.startTime,
						endTime: incentive.endTime,
					}
					const incentiveId = getIncentiveId(incentiveKey);
					const incentiveRes = await StakeContract?.incentives(incentiveId);
					console.log('incentive', incentiveRes, incentiveId);
					// console.log(new BigNumber(incentive.totalRewardUnclaimed).dividedBy(new BigNumber(10).pow(15)).toNumber())
					const time = ((Date.now() / 1000) | 0) - incentive.startTime;
					// console.log(time)
					const apy = (incentive.totalReward - Number(BigIntToFloatString(incentiveRes.totalRewardUnclaimed, 18))) / time * 365 * 24 * 60 * 60 / incentive.totalReward * 100;
					// console.log(apy)
					// reward / staked time 
					return `${apy > 0 ? apy.toFixed(2) : '0.00'}%`
				});
				const newApys = await Promise.all(promises);
				allApys.push(newApys);
			}
			// const promises = pairsData.map(async (pair: any, index: number) => {
			//     // console.log(encode)
			//     const incentiveKey = {
			//         rewardToken: contractAddresses.ad3[ChainId],
			//         pool: Pools[index],
			//         startTime: pair.incentives[2].startTime,
			//         endTime: pair.incentives[2].endTime,
			//     }
			//     console.log(incentiveKey);
			//     const incentiveId = getIncentiveId(incentiveKey);
			//     // console.log(incentiveId)
			//     const incentive = await StakeContract?.incentives(incentiveId);
			//     console.log('incentive', incentive);
			//     console.log('pool', pair);
			//     // console.log(new BigNumber(incentive.totalRewardUnclaimed).dividedBy(new BigNumber(10).pow(15)).toNumber())
			//     const time = ((Date.now() / 1000) | 0) - pair.incentives[2].startTime;
			//     // console.log(time)
			//     const apy = (pair.incentives[2].totalReward - Number(BigIntToFloatString(incentive.totalRewardUnclaimed, 18))) / time * 365 * 24 * 60 * 60 / pair.incentives[2].totalReward * 100;
			//     // console.log(apy)
			//     // reward / staked time 
			//     return `${apy > 0 ? apy.toFixed(2) : '0.00'}%`
			// })

			// const newApys = await Promise.all(promises);
			console.log('newApys', allApys);
			setApys(allApys);
		}
	}, [StakeContract, Pools, ChainId]);

	useEffect(() => {
		if (!StakeContract || Pools.length === 0) return;
		updateApy();
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
		const allowance = await LPContract?.isApprovedForAll(Account, StakeContract?.address)
		console.log('allowance', allowance);
		setIsApproveAll(allowance);
		setLoading(false);
	}, [LPContract, StakeContract, Account]);

	useEffect(() => {
		getIsApprovedAll();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [LPContract, Account, StakeContract]);

	return (
		<>
			{WalletReady ? (
				<Spin
					indicator={
						<LoadingOutlined style={{ fontSize: 60 }} spin />
					}
					spinning={loading}
				>
					<div className={styles.mainBgContainer}>
						<div className={styles.contentContainer}>
							<div className={style.stakeContainer}>
								<ETHAddress />
								<div className={style.headerContainer}>
									<div className={style.titleContainer}>
										<Title level={2}>
											Liquidity Mining
										</Title>
										<span className={style.description}>
											Stake your AD3 to earn rewards
										</span>
									</div>
									<div className={style.buttonContainer}>
										<Button
											block
											shape='round'
											type='primary'
											size='middle'
											className={style.button}
											onClick={() => {
												window.open();
											}}
										>
											Exchange AD3
										</Button>
										<Button
											block
											shape='round'
											type='primary'
											size='middle'
											disabled={isApprovedAll || requestedApproval}
											className={style.button}
											onClick={() => {
												handleApprove()
											}}
										>
											{requestedApproval ? 'pending' : isApprovedAll ? 'LP Operation Approved' : 'LP Operation Approve'}

										</Button>
									</div>
								</div>
								<div className={style.stakeContainer}>
									{Apys.length > 0 && Balances.length > 0 && Pairs.map((pair: Farm.Pair, index: number) => {
										return <PairItem
											logo={'/images/crypto/' + pair.coin.toLowerCase() + '-circle.svg'}
											apy={Apys[index]}
											//liquidity={liquidity[index]}
											liquidity={Balances[index].toBigInt()}
											pair={pair}
											positions={Postitions}
											poolAddress={Pools[index]}
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
