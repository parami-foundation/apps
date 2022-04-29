import config from "@/config/config";
import { GetAvatar } from "@/services/parami/HTTP";
import { GetUserInfo, DrylySellToken } from "@/services/parami/RPC";
import { OwnerDidOfNft } from "@/services/subquery/subquery";
import { formatBalance } from "@polkadot/util";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { useModel } from "umi";

export default () => {
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');
	const [first] = useState((new Date()).getTime());
	const [assets, setAssets] = useState<Map<string, any>>(new Map());
	const [assetsArr, setAssetsArr] = useState<any[]>([]);

	const getAssets = async () => {
		if (!apiWs) {
			return;
		}

		const allEntries = await apiWs.query.assets.metadata.entries();
		const tmpAssets = {};
		for (let i = 0; i < allEntries.length; i++) {
			const [key, value] = allEntries[i];
			const shortKey = key.toHuman();
			const meta: any = value.toHuman();
			if (shortKey && !meta?.name?.endsWith('LP*')) {
				tmpAssets[shortKey[0]] = value.toHuman();
			}
		}
		for (const assetId in tmpAssets) {
			apiWs.query.assets.account(Number(assetId), wallet?.account, async (result: any) => {
				const { balance } = result;

				const ad3 = await DrylySellToken(assetId, balance);
				const did = await OwnerDidOfNft(assetId);
				const kol = await GetUserInfo(did);
				let icon: any;
				if (!!kol?.avatar && kol?.avatar.indexOf('ipfs://') > -1) {
					const hash = kol?.avatar.substring(7);
					const { response, data } = await GetAvatar(config.ipfs.endpoint + hash);

					// Network exception
					if (!response) {
						notification.error({
							key: 'networkException',
							message: 'Network exception',
							description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
							duration: null,
						});
					}

					if (response?.status === 200) {
						icon = window.URL.createObjectURL(data);
					}
				}

				let changes = BigInt(0);
				if (!assets.has(assetId)) {
					changes = BigInt(balance);
				} else {
					changes = BigInt(balance) - BigInt(assets.get(assetId).balance);
				}

				// TODO: time events(first)
				if (((new Date()).getTime() - first >= 30000) && changes) {
					notification.success({
						key: 'assetsChange',
						message: `Changes in ${tmpAssets[assetId].name}`,
						description: formatBalance(changes, { withUnit: tmpAssets[assetId].symbol }, 18),
					});
				}

				if (!!balance && balance > 0 && !tmpAssets[assetId].name.endsWith('LP*')) {
					assets.set(assetId, {
						id: assetId,
						token: tmpAssets[assetId].name,
						symbol: tmpAssets[assetId].symbol,
						balance: `${balance}`,
						ad3: `${ad3}`,
						icon,
					});
				}

				setAssets(assets);
				setAssetsArr([...assets?.values()]);
			});
		}

		setAssets(assets);
		setAssetsArr([...assets?.values()]);
	}

	useEffect(() => {
		if (apiWs) {
			getAssets();
		}
	}, [apiWs]);

	return { assets, assetsArr };
}