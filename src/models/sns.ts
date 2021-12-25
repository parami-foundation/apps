import { useEffect, useState } from "react";
import { useModel } from "umi";

export default () => {
    const apiWs = useModel('apiWs');
    const [linkedInfo, setLinkedInfo] = useState<Record<string, any>>({});

    const platforms = ['Telegram', 'Twitter', 'Bitcoin', 'Ethereum', 'Binance', 'Eosio', 'Solana', 'Kusama', 'Polkadot', 'Tron'];

    const did = localStorage.getItem('did') as string;

    const getLinkedInfo = async () => {
        if (!apiWs) {
            return;
        }
        const data = {};
        for (let i = 0; i < platforms.length; i++) {
            await apiWs.query.linker.linksOf(did, platforms[i], async (linked) => {
                if (linked.isEmpty && apiWs) {
                    await apiWs.query.linker.pendingOf(platforms[i], did, async (pending) => {
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
        if (apiWs) {
            getLinkedInfo();
        }
    }, [apiWs]);

    return linkedInfo;
}