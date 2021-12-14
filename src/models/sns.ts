import { useEffect, useState } from "react";
import { getOrInit } from '@/services/parami/init';

export default () => {
    const [linkedInfo, setLinkedInfo] = useState<Record<string, any>>({});

    const platforms = ['Telegram', 'Twitter', 'Bitcoin', 'Ethereum', 'Eosio', 'Solana', 'Kusama', 'Polkadot', 'Tron'];

    const did = localStorage.getItem('did') as string;

    const getLinkedInfo = async () => {
        const api = await getOrInit();
        const data = {};
        for (let i = 0; i < platforms.length; i++) {
            await api.query.linker.linksOf(did, platforms[i], async (linked) => {
                if (linked.isEmpty) {
                    await api.query.linker.pendingOf(platforms[i], did, async (pending) => {
                        if (pending.isEmpty) {
                            data[platforms[i]] = null;
                        } else {
                            data[platforms[i]] = 'verifing';
                        }
                    });
                } else {
                    data[platforms[i]] = 'linked';
                }
                setLinkedInfo(data);
            });
        }
    }

    useEffect(() => {
        getLinkedInfo();
    }, []);

    return linkedInfo;
}