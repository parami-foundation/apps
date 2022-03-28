import { ethers } from 'ethers';
import WrapABI from './abi/wrap.json';
import ERC721ABI from './abi/erc721.json';
import { contractAddresses } from './config';

export const OriginContract = async (contract: string, signer: ethers.providers.JsonRpcSigner) => {
    const originContract = await new ethers.Contract(contract, ERC721ABI, signer);
    return originContract;
};

export const WrapContract = async (chainID: number, signer: ethers.providers.JsonRpcSigner) => {
    const wrapContract = await new ethers.Contract(contractAddresses.wrap[chainID], WrapABI, signer);
    return wrapContract;
};