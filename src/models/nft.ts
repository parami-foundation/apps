import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import wrapABI from '@/pages/Wallet/Dashboard/NFTs/abi/ParamiHyperlink.json';
import { infuraProvider } from '@/config/web3provider';

export default () => {
    const apiWs = useModel('apiWs');
    const { avatar } = useModel('user');
    const [kickNFTMap, setKickNFTMap] = useState<Map<string, any>>(new Map());
    const [portNFTMap, setPortNFTMap] = useState<Map<string, any>>(new Map());
    const [nftMap, setNftMap] = useState<Map<string, any>>(new Map());

    const [kickNFT, setKickNFT] = useState<any[]>([]);
    const [portNFT, setPortNFT] = useState<any[]>([]);
    const [nftList, setNftList] = useState<any[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const currentAccount = localStorage.getItem('did');

    const getNFTs = async () => {
        if (!apiWs) {
            return;
        }

        apiWs.query.nft.account.keys(currentAccount, async (allEntries) => {
            for (const nftItem in allEntries) {
                const [key, value]: any = allEntries[nftItem].toHuman();
                if (!!key) {
                    const externalData = await apiWs.query.nft.external(value);
                    const nftMetadata = await apiWs.query.nft.metadata(value);
                    const external: any = externalData.toHuman();
                    const nft: any = nftMetadata.toHuman();
                    const deposit = await apiWs.query.nft.deposit(value);

                    const assetData = await apiWs.query.assets.metadata(nft?.tokenAssetId);
                    const asset: any = assetData.toHuman();

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
                        const provider = new ethers.providers.JsonRpcProvider(infuraProvider[4]);
                        const wrapContract = await new ethers.Contract(external?.namespace, wrapABI.abi, provider);
                        const tokenURI = await wrapContract?.tokenURI(external?.token);
                        const name = await wrapContract?.getOriginalName(external?.token);
                        const json = Buffer.from(tokenURI?.substring(29), 'base64').toString('utf8');
                        const result = JSON.parse(json);
                        portNFTMap.set(value, {
                            id: value,
                            name: asset?.name || name,
                            symbol: asset?.symbol,
                            minted: nft?.minted,
                            network: external?.network,
                            namespace: external?.namespace,
                            token: external?.token,
                            tokenURI: result?.image,
                            deposit: BigInt(deposit.toString()),
                        });
                    }
                }

                setKickNFTMap(kickNFTMap);
                setPortNFTMap(portNFTMap);
                setNftMap(new Map([...kickNFTMap, ...portNFTMap]));

                setKickNFT([...kickNFTMap.values()]);
                setPortNFT([...portNFTMap.values()]);
                setNftList([...new Map([...kickNFTMap, ...portNFTMap]).values()]);
                setLoading(false);
            }

            setKickNFTMap(kickNFTMap);
            setPortNFTMap(portNFTMap);
            setNftMap(new Map([...kickNFTMap, ...portNFTMap]));

            setKickNFT([...kickNFTMap.values()]);
            setPortNFT([...portNFTMap.values()]);
            setNftList([...new Map([...kickNFTMap, ...portNFTMap]).values()]);
            setLoading(false);
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
        loading,
    }
}
