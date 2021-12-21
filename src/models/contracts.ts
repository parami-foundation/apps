import { ethers } from 'ethers';
import { useState, useEffect } from 'react'
import { contractAddresses } from '@/pages/Dashboard/pages/Farm/config';
// abi
import AD3Abi from '@/pages/Dashboard/pages/Farm/abi/ERC20.json'
import WETHAbi from '@/pages/Dashboard/pages/Farm/abi/WETH.json'
import StakeManagerAbi from '@/pages/Dashboard/pages/Farm/abi/Ad3StakeManager.json'
import { abi as IUniswapV3FactoryABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json";
import LP_ABI from '@/pages/Dashboard/pages/Stake/abi/ERC721-ABI.json';
import { useModel } from 'umi';

export default () => {
    const {
        provider,
        signer,
        chainId,
    } = useModel("metaMask");
    // Contract instances
    const [StakeContract, setStakeContract] = useState<ethers.Contract | null>(null);
    const [Ad3Contract, setAd3Contract] = useState<ethers.Contract | null>(null);
    const [WEthContract, setWethContract] = useState<ethers.Contract | null>(null);
    const [FactoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);
    const [LPContract, setLPContract] = useState<ethers.Contract | null>(null);
    // Init contract instances
    useEffect(() => {
        if (chainId !== 1 && chainId !== 4) {
            setAd3Contract(null);
            setWethContract(null);
            setStakeContract(null);
            setFactoryContract(null);
            setLPContract(null);
            return;
        }
        if (!provider || !signer) return;
        const ad3 = new ethers.Contract(contractAddresses.ad3[chainId], AD3Abi, signer);
        const weth = new ethers.Contract(contractAddresses.weth[chainId], WETHAbi, signer);
        const stakeManager = new ethers.Contract(contractAddresses.stake[chainId], StakeManagerAbi, signer);
        const factory = new ethers.Contract(contractAddresses.uniswapFactory[chainId], IUniswapV3FactoryABI, signer);
        const lp = new ethers.Contract(contractAddresses.nonfungiblePositionManager[chainId], LP_ABI, signer);
        setAd3Contract(ad3);
        setWethContract(weth);
        setStakeContract(stakeManager);
        setFactoryContract(factory);
        setLPContract(lp);
        return () => {
            setAd3Contract(null);
            setWethContract(null);
            setStakeContract(null);
            setFactoryContract(null);
            setLPContract(null);
        }
    }, [provider, chainId, signer]);

    return {
        StakeContract,
        Ad3Contract,
        WEthContract,
        FactoryContract,
        LPContract
    }
}