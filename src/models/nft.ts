import { useModel } from 'umi';
import { useCallback, useState } from 'react';

export default () => {
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');
	const { connect } = useModel('web3');
	const { retrieveAssets } = useModel('openseaApi');

	const [nftList, setNftList] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const getNFTs = useCallback(async () => {
		setLoading(true);
		await connect();

		if (apiWs && retrieveAssets) {
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

			Promise.all(Object.keys(tmpAssets).map(async key => {
				const tempAsset = tmpAssets[key];
				const nftId = tempAsset.classId;
				const tokenAssetId = tempAsset.tokenAssetId;
				const minted = tempAsset.minted;

				const externalData = await apiWs.query.nft.external(nftId);
				const external: any = externalData.toJSON();
				const deposit = await apiWs.query.nft.deposit(nftId);

				const assetData = await apiWs.query.assets.metadata(tokenAssetId);
				const asset: any = assetData.toHuman();

				return {
					nftId,
					external,
					asset,
					deposit,
					minted
				};
			})).then(async nfts => {
				const portNFTMap = new Map();
				const externalNFTs = nfts.filter(nft => nft.external?.namespace && nft.external?.token);

				if (externalNFTs.length) {
					const contractAddresses = externalNFTs.map(nft => nft.external?.namespace).filter(Boolean);
					const tokenIds = externalNFTs.map(nft => parseInt(nft.external?.token, 16)).filter(id => id >= 0);

					const portNFTs = await retrieveAssets({
						contractAddresses,
						tokenIds
					});

					externalNFTs.forEach(externalNFT => {
						const osNFT = portNFTs.find(nft =>
							parseInt(nft.token_id, 10) === parseInt(externalNFT.external?.token, 16) && nft.asset_contract?.address === externalNFT.external?.namespace);
						if (osNFT) {
							portNFTMap.set(externalNFT.nftId, {
								id: externalNFT.nftId,
								name: externalNFT.asset?.name || osNFT?.name,
								symbol: externalNFT.asset?.symbol,
								minted: externalNFT.minted,
								network: externalNFT.external?.network,
								namespace: externalNFT.external?.namespace,
								token: externalNFT.external?.token,
								tokenURI: osNFT?.image_url,
								deposit: BigInt(externalNFT.deposit.toString()),
							})
						}
					});
				}

				setNftList([...portNFTMap.values()]);
				setLoading(false);
			}).catch(e => {
				console.error(e);
				setLoading(false);
			});
		}

	}, [apiWs, retrieveAssets]);

	return {
		nftList,
		loading,
		getNFTs,
	}
}
