import { useModel } from 'umi';
import { useCallback, useState } from 'react';
import { NFTIdsOfOwnerDid } from '@/services/subquery/subquery';
import { retrieveOpenseaAsset } from '@/services/parami/HTTP';
import { QueryIcoMetadata } from '@/services/parami/NFT';

export interface NFTItem {
	id: string;
	name: string;
	symbol: string;
	minted: boolean;
	imageUrl: string;
	contractAddress: string;
	tokenId: number;
	icoMetadata: any;
	swapMetadata: any;
}

export default () => {
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');

	const [nftList, setNftList] = useState<NFTItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const getNFTs = useCallback(async () => {
		setLoading(true);

		if (apiWs) {
			const nftIds = await NFTIdsOfOwnerDid(wallet.did);
			const nfts = await Promise.all(nftIds.map(async nftId => {
				const externalRes = await apiWs.query.nft.external(nftId);
				if (externalRes.isEmpty) {
					return null;
				}

				const external: any = externalRes.toHuman();
				const osAsset = await retrieveOpenseaAsset(external.namespace, parseInt(external.token));


				const nftMetadata = (await apiWs.query.nft.metadata(nftId)).toHuman() as any;
				const minted = nftMetadata.minted;

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
		}

	}, [apiWs]);

	return {
		nftList,
		loading,
		getNFTs,
	}
}
