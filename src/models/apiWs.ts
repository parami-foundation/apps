import config from "@/config/config";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { useEffect, useState } from 'react';

export default () => {
	const [apiWs, setApiWs] = useState<ApiPromise>();

	const initChain = async () => {
		await cryptoWaitReady();
		const provider = new WsProvider(config.main.socketServer);
		const api = await ApiPromise.create({
			provider,
			types: config.types,
			rpc: config.rpc,
			runtime: config.runtime
		});
		window.apiWs = api;
		setApiWs(api);
	};

	useEffect(() => {
		initChain();
	}, []);

	return apiWs;
}