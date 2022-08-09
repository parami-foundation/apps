export const isMainnetOrRinkeby = (chainId?: number): chainId is 1 | 4 => chainId === 1 || chainId === 4;
