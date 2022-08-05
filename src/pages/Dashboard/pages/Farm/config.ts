/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from 'dotenv';
config();
export const defaultChainId = 4;

const INFURA_KEY = '4bf032f2d38a4ed6bb975b80d6340847';//process.env.REACT_APP_INFURA_KEY
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID

if (typeof INFURA_KEY === 'undefined') {
	throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`)
}

const NETWORK_URLS = {
	mainnet: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
	rinkeby: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
	ropsten: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
	goerli: `https://goerli.infura.io/v3/${INFURA_KEY}`,
	kovan: `https://kovan.infura.io/v3/${INFURA_KEY}`,
}

export const contractAddresses = {
	ad3: {
		1: '0x76B61Ae8F964F5CBE23ad9aea9BF597aa4cEA7eD',
		4: '0x76B61Ae8F964F5CBE23ad9aea9BF597aa4cEA7eD',
		3: '0xf8bd1248816ec6cd10336d54a7530305e03dcf3f'
	},
	weth: {
		1: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
		4: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
	},
	usdt: {
		1: '0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02',
		4: '0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02',
	},
	usdc: {
		1: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
		4: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
	},
	stake: { // Ad3 Staker Contract: https://github.com/parami-protocol/ad3-staker/blob/master/contracts/Ad3StakeManager.sol
		1: '0xE9c94322e3fFC563BD97a74e916D77DEE4797A9F',
		4: '0xE9c94322e3fFC563BD97a74e916D77DEE4797A9F',
	},
	uniswapFactory: {
		1: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
		4: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
	},
	nonfungiblePositionManager: {
		1: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
		4: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
	},
	bridge: {
		1: '0xDb59E0cA1644D1F93D1b85261c0D414656bA98F9',
		4: '0xDb59E0cA1644D1F93D1b85261c0D414656bA98F9',
		3: '0x0e58C69918baa6A578E2BA65a58C3Bdcc640EE2f'
	}
}

export const pairsData = [
	{
		name: 'ETH-AD3',
		coinAddresses: {
			1: '0xc778417e063141139fce010982780140aa0cd5ab',
			4: '0xc778417e063141139fce010982780140aa0cd5ab',
		},
		incentives: [
			{
				startTime: 1639383953,
				endTime: 1641801923,
				totalReward: 1000,
				minPrice: '0.49859',
				maxPrice: '1.1008',
			},
			{
				startTime: 1639383954,
				endTime: 1641801923,
				totalReward: 1000,
				minPrice: '1.1074',
				maxPrice: '2.0056',
			},
			{
				startTime: 1639383955,
				endTime: 1641801923,
				totalReward: 1000,
				minPrice: '2.0177',
				maxPrice: '2.998',
			},
		],
		token: 'AD3',
		coin: 'ETH',
	},
	{
		name: 'USDT-AD3',
		coinAddresses: { //USDT contract
			1: '0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02',
			4: '0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02',
		},
		incentives: [
			{
				startTime: 1639378523,
				endTime: 1641801923,
				totalReward: 1000,
				minPrice: '0.49859',
				maxPrice: '1.1008',
			},
			{
				startTime: 1639378523,
				endTime: 1641801923,
				totalReward: 1000,
				minPrice: '1.1074',
				maxPrice: '2.0056',
			},
			{
				startTime: 1639378523,
				endTime: 1641801923,
				totalReward: 1000,
				minPrice: '2.0177',
				maxPrice: '2.998',
			},
		],

		token: 'AD3',
		coin: 'USDT',
	},
	{
		name: 'USDC-AD3',
		coinAddresses: {
			1: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
			4: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
		},
		incentives: [
			{
				startTime: 1639378523,
				endTime: 1641801923,
				totalReward: 1000,
				minPrice: '0.49859',
				maxPrice: '1.1008',
			},
			{
				startTime: 1639378523,
				endTime: 1641801923,
				totalReward: 1000,
				minPrice: '1.1074',
				maxPrice: '2.0056',
			},
			{
				startTime: 1639378523,
				endTime: 1641801923,
				totalReward: 1000,
				minPrice: '2.0177',
				maxPrice: '2.998',
			},
		],
		token: 'AD3',
		coin: 'USDC',
	},
]

export function pairs(chainId: number, apys: any[]) {
	return pairsData.map((pool: any, i: number) => ({
		lpAddress: pool.lpAddresses[chainId],
		tokenAddress: pool.tokenAddresses[chainId],
		poolAddress: pool.poolAddresses[chainId],
		coinAddress: pool.coinAddresses[chainId],
		...pool,
		apy: apys[i],
		key: pool.name,
	}))
}
