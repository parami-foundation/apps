import { ethers } from 'ethers';
import { useState, useEffect } from 'react'
import { contractAddresses } from '@/pages/Dashboard/pages/Stake/config';
// abi
import AD3Abi from '@/pages/Dashboard/pages/Stake/abi/ERC20.json'
import WETHAbi from '@/pages/Dashboard/pages/Stake/abi/WETH.json'
import StakeManagerAbi from '@/pages/Dashboard/pages/Stake/abi/Ad3StakeManager.json'
import { abi as IUniswapV3FactoryABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json";

import { useModel } from 'umi';

export default () => {
    const {
        provider,
        signer,
        chainId,
    } = useModel("metaMask");
    // Contract instances
    const [stakeContract, setStakeContract] = useState<ethers.Contract | null>(null);
    const [ad3Contract, setAd3Contract] = useState<ethers.Contract | null>(null);
    const [wethContract, setWethContract] = useState<ethers.Contract | null>(null);
    const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);
    // Init contract instances
    useEffect(() => {
        if (!provider || !signer) return;
        const ad3 = new ethers.Contract(contractAddresses.ad3[chainId], AD3Abi, signer);
        const weth = new ethers.Contract(contractAddresses.weth[chainId], WETHAbi, signer);
        const stakeManager = new ethers.Contract(contractAddresses.stake[chainId], StakeManagerAbi, signer);
        const factory = new ethers.Contract(contractAddresses.uniswapFactory[chainId], IUniswapV3FactoryABI, signer);
        setAd3Contract(ad3);
        setWethContract(weth);
        setStakeContract(stakeManager);
        setFactoryContract(factory);
        return () => {
            setAd3Contract(null);
            setWethContract(null);
            setStakeContract(null);
            setFactoryContract(null);
        }
    }, [provider, chainId, signer]);

    return {
        stakeContract,
        ad3Contract,
        wethContract,
        factoryContract
    }
}