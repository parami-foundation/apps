import { useModel } from 'umi';
import { useEffect, useState } from 'react';

export default () => {
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');
	const { avatar } = useModel('user');
	const { connect } = useModel('web3');
	const { retrieveAsset } = useModel('openseaApi');
	const [kickNFTMap, setKickNFTMap] = useState<Map<string, any>>(new Map());
	const [portNFTMap, setPortNFTMap] = useState<Map<string, any>>(new Map());
	const [nftMap, setNftMap] = useState<Map<string, any>>(new Map());

	const [kickNFT, setKickNFT] = useState<any[]>([]);
	const [portNFT, setPortNFT] = useState<any[]>([]);
	const [nftList, setNftList] = useState<any[]>([]);

	const [loading, setLoading] = useState<boolean>(true);

	const getNFTs = async () => {
		if (!apiWs) {
			return;
		}

		await connect();

		const allEntries = await apiWs.query.nft.metadata.entries();
		const tmpAssets = {};
		for (let i = 0; i < allEntries.length; i++) {
			const [key, value] = allEntries[i];
			const shortKey = key.toHuman();
			const meta: any = value.toHuman();
			if (shortKey && meta?.owner === wallet?.did) {
				tmpAssets[shortKey[0]] = value.toHuman();
			}
		}

		for (const index in tmpAssets) {
			const nftId = tmpAssets[index].classId;
			const tokenAssetId = tmpAssets[index].tokenAssetId;
			const minted = tmpAssets[index].minted;

			const externalData = await apiWs.query.nft.external(nftId);
			const external: any = externalData.toHuman();
			const deposit = await apiWs.query.nft.deposit(nftId);

			const assetData = await apiWs.query.assets.metadata(tokenAssetId);
			const asset: any = assetData.toHuman();

			if (externalData.isEmpty) {
				kickNFTMap.set(nftId, {
					id: nftId,
					name: asset?.name || 'My NFT',
					symbol: asset?.symbol,
					minted: minted,
					tokenURI: avatar || '/images/logo-square-core.svg',
					deposit: BigInt(deposit.toString()),
				});
			} else {
				try {
					const nft = await retrieveAsset(external?.namespace, parseInt(external?.token, 16));
					if (nft) {
						portNFTMap.set(nftId, {
							id: nftId,
							name: asset?.name || nft?.name,
							symbol: asset?.symbol,
							minted: minted,
							network: external?.network,
							namespace: external?.namespace,
							token: external?.token,
							tokenURI: nft?.image_url,
							deposit: BigInt(deposit.toString()),
						});
					}

				} catch (e) {
					// If the NFT is not on the chain which user currently connecting to, ignore it.
					console.log(`Skip fetching nft data. Address:${external?.namespace}, TokenId:${external?.token}`);
				}
			}
		}

		setKickNFTMap(kickNFTMap);
		setPortNFTMap(portNFTMap);
		setNftMap(new Map([...kickNFTMap, ...portNFTMap]));

		setKickNFT([...kickNFTMap.values()]);
		setPortNFT([...portNFTMap.values()]);
		setNftList([...new Map([...kickNFTMap, ...portNFTMap]).values()]);
		setLoading(false);
	};

	useEffect(() => {
		if (!!apiWs) {
			getNFTs();
		}
	}, [apiWs, avatar]);

	return {
		kickNFTMap,
		portNFTMap,
		nftMap,
		kickNFT,
		portNFT,
		nftList,
		loading,
		getNFTs,
	}
}
