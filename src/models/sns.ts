import { notification } from "antd";
import { useEffect, useState } from "react";
import { useModel } from "umi";

export default () => {
    const apiWs = useModel('apiWs');
    const { blockNumber } = useModel('blockNumber');
    const [linkedInfo, setLinkedInfo] = useState<Record<string, any>>({});
    const [lastNumber, setLastNumber] = useState<any>(0);
    const platforms = ['Telegram', 'Discord', 'Twitter', 'Bitcoin', 'Ethereum', 'Binance', 'Eosio', 'Solana', 'Kusama', 'Polkadot', 'Tron'];

    const did = localStorage.getItem('did') as string;

    const tmpList: Record<string, any> = {};

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
        setLinkedInfo(data);

        platforms.forEach(platform => {
            if (data[platform] === 'verifing') {
                tmpList[platform] = 'verifing';
            }
            if (!!tmpList[platform] && tmpList[platform] === 'verifing' && data[platform] !== 'verifing') {
                notification.error({
                    message: 'Binding failed',
                    description: `${platform} binding failed`,
                });
                tmpList[platform] = null;
            }
        });
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