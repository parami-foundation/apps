import { ethers } from "ethers";
import { Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { contractAddresses } from "../../config";
interface Immutables {
    factory: string;
    token0: string;
    token1: string;
    fee: number;
    tickSpacing: number;
    maxLiquidityPerTick: ethers.BigNumber;
}

interface State {
    liquidity: ethers.BigNumber;
    sqrtPriceX96: ethers.BigNumber;
    tick: number;
    observationIndex: number;
    observationCardinality: number;
    observationCardinalityNext: number;
    feeProtocol: number;
    unlocked: boolean;
}

async function getPoolImmutables(poolContract) {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
        await Promise.all([
            poolContract.factory(),
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.tickSpacing(),
            poolContract.maxLiquidityPerTick(),
        ]);

    const immutables: Immutables = {
        factory,
        token0,
        token1,
        fee,
        tickSpacing,
        maxLiquidityPerTick,
    };
    return immutables;
}

async function getPoolState(poolContract) {
    const [liquidity, slot] = await Promise.all([
        poolContract.liquidity(),
        poolContract.slot0(),
    ]);

    const PoolState: State = {
        liquidity,
        sqrtPriceX96: slot[0],
        tick: slot[1],
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6],
    };

    return PoolState;
}

async function GetPool(uniswapFactory: ethers.Contract, provider: ethers.providers.Provider, token0: Token, token1: Token, fee: number) {
    console.log(token0.address, token1.address);
    const poolAddress = await uniswapFactory.getPool(token0.address, token1.address, fee);
    console.log(poolAddress);
    const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI.abi,
        provider
    );
    const [immutables, state] = await Promise.all([
        getPoolImmutables(poolContract),
        getPoolState(poolContract),
    ]);

    const TokenA = token0;

    const TokenB = token1;

    const pool = new Pool(
        TokenA,
        TokenB,
        immutables.fee,
        state.sqrtPriceX96.toString(),
        state.liquidity.toString(),
        state.tick
    );
    return pool;
}

export async function getAd3Price(uinswapFactory: ethers.Contract, coinAddress: string) {
    const chainId = await uinswapFactory.signer.getChainId();
    if (chainId != 1 && chainId != 4) {
        return null;
    }
    const token0 = new Token(chainId, contractAddresses.ad3[chainId], 18);
    const token1 = new Token(chainId, coinAddress, 18);
    const pool = await GetPool(uinswapFactory, uinswapFactory.provider, token0, token1, 3000);
    return pool.token0Price;
}
export default GetPool;
