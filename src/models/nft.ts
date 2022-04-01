import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import wrapABI from '@/pages/Wallet/Dashboard/NFTs/abi/ParamiHyperlink.json';

export default () => {
    const apiWs = useModel('apiWs');
    const { Provider } = useModel('web3');
    const { avatar } = useModel('user');
    const [kickNFTMap, setKickNFTMap] = useState<Map<string, any>>(new Map());
    const [portNFTMap, setPortNFTMap] = useState<Map<string, any>>(new Map());
    const [nftMap, setNftMap] = useState<Map<string, any>>(new Map());

    const [kickNFT, setKickNFT] = useState<any[]>([]);
    const [portNFT, setPortNFT] = useState<any[]>([]);
    const [nftList, setNftList] = useState<any[]>([]);

    const currentAccount = localStorage.getItem('did');

    const getNFTs = async () => {
        if (!apiWs) {
            return;
        }

        await apiWs.query.nft.account.keys(currentAccount, async (allEntries) => {
            for (let i = 0; i < allEntries.length; i++) {
                const [key, value]: any = allEntries[i].toHuman();
                if (!!key) {
                    const externalData = await apiWs.query.nft.external(value);
                    const nftMetadata = await apiWs.query.nft.metadata(value);
                    const external: any = externalData.toHuman();
                    const nft: any = nftMetadata.toHuman();
                    const deposit = await apiWs.query.nft.deposit(value);

                    const assetData = await apiWs.query.assets.metadata(nft?.tokenAssetId);
                    const asset: any = assetData.toHuman();

                    // TODO: Query import NFT name

                    if (externalData.isEmpty) {
                        kickNFTMap.set(value, {
                            id: value,
                            name: asset?.name || 'My NFT',
                            symbol: asset?.symbol,
                            minted: nft?.minted,
                            tokenURI: avatar || '/images/logo-square-core.svg',
                            deposit: BigInt(deposit.toString()),
                        });
                    } else {
                        const wrapContract = await new ethers.Contract(external?.namespace, wrapABI, Provider);
                        const tokenURI = await wrapContract?.tokenURI(external?.token);
                        portNFTMap.set(value, {
                            id: value,
                            name: asset?.name || 'My NFT',
                            symbol: asset?.symbol,
                            minted: nft?.minted,
                            network: external?.network,
                            namespace: external?.namespace,
                            token: external?.token,
                            tokenURI: tokenURI,
                            deposit: BigInt(deposit.toString()),
                        });
                    }
                }
            }

            setKickNFTMap(kickNFTMap);
            setPortNFTMap(portNFTMap);
            setNftMap(new Map([...kickNFTMap, ...portNFTMap]));

            setKickNFT([...kickNFTMap.values()]);
            setPortNFT([...portNFTMap.values()]);
            setNftList([...nftMap?.values()]);
        });
    }

    useEffect(() => {
        if (apiWs) {
            getNFTs();
        }
    }, [apiWs]);

    return {
        kickNFTMap,
        portNFTMap,
        nftMap,
        kickNFT,
        portNFT,
        nftList,
    }
}
