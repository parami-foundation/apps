import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ApiPromise, WsProvider } from '@polkadot/api';
import config from '@/config/config';
import { Mutex } from 'async-mutex';

export async function getOrInit() {
    if (!window.mutex) {
        window.mutex = new Mutex();
    };

    const release = await window.mutex.acquire();

    try {
        await cryptoWaitReady();
        if (!window.apiWs) {
            const provider = new WsProvider(config.main.socketServer);
            window.apiWs = await ApiPromise.create({
                provider,
                types: config.types,
                rpc: config.rpc
            });
        }
        return window.apiWs;
    } finally {
        release();
    }
}