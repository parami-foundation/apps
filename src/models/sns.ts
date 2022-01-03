import { useEffect, useState } from "react";
import { useModel } from "umi";

export default () => {
    const apiWs = useModel('apiWs');
    const { blockNumber } = useModel('blockNumber');
    const [linkedInfo, setLinkedInfo] = useState<Record<string, any>>({});
    const [lastNumber, setLastNumber] = useState<any>(0);
    const platforms = ['Telegram', 'Twitter', 'Bitcoin', 'Ethereum', 'Binance', 'Eosio', 'Solana', 'Kusama', 'Polkadot', 'Tron'];

    const did = localStorage.getItem('did') as string;

    const getLinkedInfo = async () => {
        if (!apiWs) {
            return;
        }
        const data = {};
        const promises = platforms.map(async (platform) => {
            const linked = await apiWs.query.linker.linksOf(did, platform);
            if (linked.isEmpty && apiWs) {
                const pending = await apiWs.query.linker.pendingOf(platform, did);
                if (pending.isEmpty) {
                    return null;
                } else {
                    return 'verifing';
                }
            } else {
                return 'linked';
            }
        });
        const status = await Promise.all(promises);
        for (let i = 0; i < platforms.length; i++) {
            data[platforms[i]] = status[i];
        }
        console.log(data)
        setLinkedInfo(data);
    }

    useEffect(() => {
        if (apiWs) {
            if (lastNumber + 5 < blockNumber) {
                getLinkedInfo();
            }
            setLastNumber(blockNumber);
        }
    }, [apiWs, blockNumber, lastNumber]);

    return linkedInfo;
}