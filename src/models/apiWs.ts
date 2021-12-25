import config from "@/config/config";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { Mutex } from "async-mutex";
import { useEffect, useState } from 'react';

export default () => {
    const [apiWs, setApiWs] = useState<ApiPromise>();

    const initChain = async () => {
        const mutex = new Mutex();

        const release = await mutex.acquire();

        try {
            await cryptoWaitReady();
            const provider = new WsProvider(config.main.socketServer);
            const api = await ApiPromise.create({
                provider,
                types: config.types,
                rpc: config.rpc
            });
            window.apiWs = api;
            setApiWs(api);
        } finally {
            release();
        }
    }

    useEffect(() => {
        initChain();
    }, []);

    return apiWs;
}