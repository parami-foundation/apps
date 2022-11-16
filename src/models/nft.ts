import { useModel } from 'umi';
import { useCallback, useState } from 'react';
import { GetClaimInfo } from '@/services/parami/RPC';
import { deleteComma } from '@/utils/format';
import { NFTIdsOfOwnerDid } from '@/services/subquery/subquery';
import { retrieveOpenseaAsset } from '@/services/parami/HTTP';
import { P } from '@antv/g2plot';
import { QueryIcoMetadata } from '@/services/parami/NFT';

export interface NFTItem {
	id: string;
	name: string;
	symbol: string;
	minted: boolean;
	imageUrl: string;
	contractAddress: string;
	tokenId: number;
	icoMetadata: any; // todo: type this
	swapMetadata: any;
	// network: string;
	// namespace: string;
	// token: string;
	// tokenURI: string;
	// deposit: bigint;
	// claimInfo: string[];
}

export default () => {
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');
	// const { connect } = useModel('web3');
	// const { retrieveAssets } = useModel('openseaApi');

	const [nftList, setNftList] = useState<NFTItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const getNFTs = useCallback(async () => {
		setLoading(true);
		// await connect();

		if (apiWs) {
			const nftIds = await NFTIdsOfOwnerDid(wallet.did);
			// const nftMetadatas = await Promise.all(nftIds.map(async nftId => {
			// 	return await apiWs.query.nft.metadata(nftId);
			// }))

			// todo: query nft ids from graph ql
			// const allEntries = await apiWs.query.nft.metadata.entries();
			// const tmpAssets = {};
			// for (let i = 0; i < allEntries.length; i++) {
			// 	const [key, value] = allEntries[i];
			// 	const shortKey = key.toHuman();
			// 	const meta: any = value.toHuman();
			// 	if (shortKey && meta?.owner === wallet?.did) {
			// 		tmpAssets[shortKey[0]] = value.toHuman();
			// 	}
			// }

			const nfts = await Promise.all(nftIds.map(async nftId => {
				const externalRes = await apiWs.query.nft.external(nftId);
				if (externalRes.isEmpty) {
					return null;
				}

				const external: any = externalRes.toHuman();
				const osAsset = await retrieveOpenseaAsset(external.namespace, parseInt(external.token));


				const nftMetadata = (await apiWs.query.nft.metadata(nftId)).toHuman() as any;
				// const tempAsset = tmpAssets[key];
				// const nftId = deleteComma(tempAsset.classId);
				// const tokenAssetId = deleteComma(nftMetadata.tokenAssetId);
				const minted = nftMetadata.minted;

				// const externalData = await apiWs.query.nft.external(nftId);
				// const external: any = externalData.toJSON();
				// const deposit = await apiWs.query.nft.deposit(nftId);

				// const assetData = await apiWs.query.assets.metadata(tokenAssetId);
				// const asset: any = assetData.toHuman();
				let asset;
				try {
					asset = (await apiWs.query.assets.metadata(nftId)).toHuman();
				} catch (_) {}

				const icoMetadata = await QueryIcoMetadata(nftId);

				let swapMetadata;
				try {
					swapMetadata = (await apiWs.query.swap.metadata(nftId)).toHuman();
				} catch (_) {}

				return {
					id: nftId,
					name: asset?.name ?? osAsset?.name,
					symbol: asset?.symbol,
					minted,
					imageUrl: osAsset?.image_url,
					contractAddress: external.namespace,
					tokenId: parseInt(external.token),
					icoMetadata,
					swapMetadata
				}
			}));

			setNftList(nfts);
			setLoading(false);
			
			// .then(async nfts => {
			// 	const portNFTMap = new Map();
			// 	const externalNFTs = nfts.filter(nft => nft.external?.namespace && nft.external?.token);

			// 	if (externalNFTs.length) {
			// 		const contractAddresses = externalNFTs.map(nft => nft.external?.namespace).filter(Boolean);
			// 		const tokenIds = externalNFTs.map(nft => parseInt(nft.external?.token, 16)).filter(id => id >= 0);

			// 		const portNFTs = await retrieveAssets({
			// 			contractAddresses,
			// 			tokenIds
			// 		});

			// 		// const mintedNFTs = externalNFTs.filter(nft => nft.minted);
			// 		// const claimInfo = (await Promise.all(mintedNFTs.map(async nft => {
			// 		// 	try {
			// 		// 		return await GetClaimInfo(wallet.did!, nft.nftId);
			// 		// 	} catch (e) {
			// 		// 		console.error('GetClaimInfo Error', nft.nftId, e);
			// 		// 		return [];
			// 		// 	}
			// 		// }))).map((info, index) => {
			// 		// 	return {
			// 		// 		nftId: mintedNFTs[index].nftId,
			// 		// 		info
			// 		// 	}
			// 		// });

			// 		externalNFTs.forEach(externalNFT => {
			// 			const osNFT = portNFTs.find(nft =>
			// 				parseInt(nft.token_id, 10) === parseInt(externalNFT.external?.token, 16) && nft.asset_contract?.address === externalNFT.external?.namespace);
			// 			if (osNFT) {
			// 				portNFTMap.set(externalNFT.nftId, {
			// 					id: externalNFT.nftId,
			// 					name: externalNFT.asset?.name || osNFT?.name,
			// 					symbol: externalNFT.asset?.symbol,
			// 					minted: externalNFT.minted,
			// 					network: externalNFT.external?.network,
			// 					namespace: externalNFT.external?.namespace,
			// 					token: externalNFT.external?.token,
			// 					tokenURI: osNFT?.image_url,
			// 					deposit: BigInt(externalNFT.deposit.toString()),
			// 					// claimInfo: claimInfo.find(info => info.nftId === externalNFT.nftId)?.info
			// 				})
			// 			}
			// 		});
			// 	}

			// 	setNftList([...portNFTMap.values()]);
			// 	setLoading(false);
			// }).catch(e => {
			// 	console.error(e);
			// 	setLoading(false);
			// });
		}

	}, [apiWs]);

	return {
		nftList,
		loading,
		getNFTs,
	}
}
