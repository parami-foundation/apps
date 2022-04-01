import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import wrapABI from '@/pages/Wallet/Dashboard/NFTs/abi/ParamiHyperlink.json';

export default () => {
    const apiWs = useModel('apiWs');
    const { avatar } = useModel('user');
    const [kickNFT, setKickNFT] = useState<any[]>([]);
    const [portNFT, setPortNFT] = useState<any[]>([]);
    const [nftList, setNftList] = useState<any[]>([]);

    const currentAccount = localStorage.getItem('did');

    const getNFTs = async () => {
        if (!apiWs) {
            return;
        }

        await apiWs.query.nft.account.keys(currentAccount, async (allEntries) => {
            const kickNFTList: any[] = [];
            const portNFTList: any[] = [];
            for (let i = 0; i < allEntries.length; i++) {
                const [key, value]: any = allEntries[i].toHuman();
                if (!!key) {
                    const externalData = await apiWs.query.nft.external(value);
                    const nftMetadata = await apiWs.query.nft.metadata(value);
                    const external: any = externalData.toHuman();
                    const nft: any = nftMetadata.toHuman();
                    const deposit = await apiWs.query.nft.deposit(value);
                    if (externalData.isEmpty) {
                        const nftItem = {
                            id: value,
                            minted: nft?.minted,
                            tokenURI: avatar || '/images/logo-square-core.svg',
                            deposit: BigInt(deposit.toString()),
                        }
                        kickNFTList.push(nftItem);
                    } else {
                        const wrapContract = await new ethers.Contract(external?.namespace, wrapABI);
                        const tokenURI = await wrapContract?.tokenURI();
                        const nftItem = {
                            id: value,
                            minted: nft?.minted,
                            network: external?.network,
                            namespace: external?.namespace,
                            token: external?.token,
                            tokenURI: tokenURI,
                            deposit: BigInt(deposit.toString()),
                        }
                        portNFTList.push(nftItem);
                    }
                }
            }
            setKickNFT(kickNFTList);
            setPortNFT(portNFTList);
            setNftList(kickNFTList.concat(portNFTList));
        });
    }

    useEffect(() => {
        if (apiWs) {
            getNFTs();
        }
    }, [apiWs]);

    return {
        kickNFT,
        portNFT,
        nftList,
    }
}
