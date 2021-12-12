export const contractAddresses = {
  ad3: {
    1: '0xb5643F5E3398fCD7608109fe9f4683fB319367E8',
    4: '0xb5643F5E3398fCD7608109fe9f4683fB319367E8',
  },
  weth: {
    // 1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
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
  master: { // Ad3 Staker Contract: https://github.com/parami-protocol/ad3-staker/blob/master/contracts/Ad3StakeManager.sol
    1: '0xE9c94322e3fFC563BD97a74e916D77DEE4797A9F',
    4: '0xE9c94322e3fFC563BD97a74e916D77DEE4797A9F',
  },
}

export const pairs = [
  {
    name: 'ETH-AD3',
    lpAddresses: {
      1: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
      4: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    },
    tokenAddresses: {
      1: '0xb5643F5E3398fCD7608109fe9f4683fB319367E8',
      4: '0xb5643F5E3398fCD7608109fe9f4683fB319367E8',
    },
    poolAddresses: {
      1: '0x5b72c6c9751ca84838a5ea9a9dd19d27757e58fe',
      4: '0x5b72c6c9751ca84838a5ea9a9dd19d27757e58fe',
    },
    coinAddresses: {
      1: '0xc778417e063141139fce010982780140aa0cd5ab',
      4: '0xc778417e063141139fce010982780140aa0cd5ab',
    },
    startTime: 1638263370,
    endTime: 1640850151,
    totalReward: 10000,
    minPrice: '0.001',
    maxPrice: '22.015',
    token: 'AD3',
    coin: 'ETH',
  },
  {
    name: 'USDT-AD3',
    lpAddresses: { // contract source code: https://github.com/Uniswap/v3-periphery/blob/878a58a461ae30680acd84d44499058826bf5f3e/contracts/NonfungiblePositionManager.sol
      1: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
      4: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    },
    tokenAddresses: { //https://github.com/parami-protocol/bridge/blob/main/ad3/contracts/AD3Token.sol
      1: '0xb5643F5E3398fCD7608109fe9f4683fB319367E8',
      4: '0xb5643F5E3398fCD7608109fe9f4683fB319367E8',
    },
    poolAddresses: { //
      1: '0x2457d220f7bc316F7a287af6F233Af2fA5AcEA45',
      4: '0x2457d220f7bc316F7a287af6F233Af2fA5AcEA45',
    },
    coinAddresses: { //USDT contract
      1: '0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02',
      4: '0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02',
    },
    startTime: 1636605035,
    endTime: 1951983617,
    totalReward: 10000,
    minPrice: '0.001',
    maxPrice: '22.015',
    token: 'AD3',
    coin: 'USDT',
  },
  {
    name: 'USDC-AD3',
    lpAddresses: {
      1: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
      4: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    },
    tokenAddresses: {
      1: '0xb5643F5E3398fCD7608109fe9f4683fB319367E8',
      4: '0xb5643F5E3398fCD7608109fe9f4683fB319367E8',
    },
    poolAddresses: {
      1: '0x209B2Ae730287B2866837fAa59c3B4940a9A9b7E',
      4: '0x209B2Ae730287B2866837fAa59c3B4940a9A9b7E',
    },
    coinAddresses: {
      1: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
      4: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
    },
    startTime: 1636545612,
    endTime: 1951983617,
    totalReward: 1000000,
    minPrice: '0.001',
    maxPrice: '22.015',
    token: 'AD3',
    coin: 'USDC',
  },
]
