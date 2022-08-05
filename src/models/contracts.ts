import { ethers } from 'ethers';
import { useState, useEffect } from 'react'
import { contractAddresses } from '@/pages/Dashboard/pages/Farm/config';
// abi
import AD3Abi from '@/pages/Dashboard/pages/Farm/abi/ERC20.json'
import WETHAbi from '@/pages/Dashboard/pages/Farm/abi/WETH.json'
import StakeManagerAbi from '@/pages/Dashboard/pages/Farm/abi/Ad3StakeManager.json'
import IUniswapV3FactoryABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json";
import LP_ABI from '@/pages/Dashboard/pages/Farm/abi/ERC721-ABI.json';
import BRIDGE_ABI from '@/pages/Dashboard/pages/Bridge/abi/Bridge.json';
import { useModel } from 'umi';

export default () => {
    const {
        Provider,
        Signer,
        ChainId,
    } = useModel('web3');
    // Contract instances
    const [StakeContract, setStakeContract] = useState<ethers.Contract | null>(null);
    const [Ad3Contract, setAd3Contract] = useState<ethers.Contract | null>(null);
    const [WEthContract, setWethContract] = useState<ethers.Contract | null>(null);
    const [FactoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);
    const [LPContract, setLPContract] = useState<ethers.Contract | null>(null);
    const [BridgeContract, setBridgeContract] = useState<ethers.Contract | null>(null);
    // Init contract instances
    useEffect(() => {
        if (ChainId !== 1 && ChainId !== 4 && ChainId !== 3) {
            setAd3Contract(null);
            setWethContract(null);
            setStakeContract(null);
            setFactoryContract(null);
            setLPContract(null);
            setBridgeContract(null);
            return;
        }

        if (!Provider || !Signer) return;

        if (ChainId === 3) {
            const ad3 = new ethers.Contract(contractAddresses.ad3[ChainId], AD3Abi, Signer);
            setAd3Contract(ad3);

            const bridge = new ethers.Contract(contractAddresses.bridge[ChainId], BRIDGE_ABI, Signer);
            setBridgeContract(bridge);
        } else {
            const ad3 = new ethers.Contract(contractAddresses.ad3[ChainId], AD3Abi, Signer);
            const weth = new ethers.Contract(contractAddresses.weth[ChainId], WETHAbi, Signer);
            const stakeManager = new ethers.Contract(contractAddresses.stake[ChainId], StakeManagerAbi, Signer);
            const factory = new ethers.Contract(contractAddresses.uniswapFactory[ChainId], IUniswapV3FactoryABI.abi, Signer);
            const lp = new ethers.Contract(contractAddresses.nonfungiblePositionManager[ChainId], LP_ABI, Signer);
            const bridge = new ethers.Contract(contractAddresses.bridge[ChainId], BRIDGE_ABI, Signer);
            setAd3Contract(ad3);
            setWethContract(weth);
            setStakeContract(stakeManager);
            setFactoryContract(factory);
            setLPContract(lp);
            setBridgeContract(bridge);
        }


        return () => {
            setAd3Contract(null);
            setWethContract(null);
            setStakeContract(null);
            setFactoryContract(null);
            setLPContract(null);
            setBridgeContract(null);
        }
    }, [Provider, ChainId, Signer]);

    return {
        StakeContract,
        Ad3Contract,
        WEthContract,
        FactoryContract,
        LPContract,
        BridgeContract,
    }
}