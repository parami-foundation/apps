import { notification } from "antd";
import { useEffect, useState } from "react";
import { useModel } from "umi";

export default () => {
	const apiWs = useModel('apiWs');
	const { blockNumber } = useModel('blockNumber');
	const [linkedInfo, setLinkedInfo] = useState<Record<string, any>>({});
	const [lastNumber, setLastNumber] = useState<any>(0);
	const [tmpList, setTmpList] = useState<Record<string, any>>({});

	const platforms = ['Telegram', 'Discord', 'Twitter', 'Bitcoin', 'Ethereum', 'Binance', 'Eosio', 'Solana', 'Kusama', 'Polkadot', 'Tron'];

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
					//maybe ocw just finished this task, so we need to query again
					const linked2 = await apiWs.query.linker.linksOf(did, platform);
					if (linked2.isEmpty) {
						//definitely not linked and not verifing
						return null;
					} else {
						return 'linked';
					}
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
			// console.log("[Dev] [sns.ts]: ", tmpList[platforms[i]], data[platforms[i]]);
			// (tmpList[platforms[i]] is existed and not null) && (tmpList[platforms[i]] status is verifing) && (new status is nothing)
			// indicate a failed binding
			if (!!tmpList[platforms[i]] && tmpList[platforms[i]] === 'verifing' && data[platforms[i]] === null) {
				notification.error({
					message: 'Binding failed',
					description: `${platforms[i]} binding failed. Please check whether the account you submitted is correct and has been replaced with did avatar?`,
					duration: null,
				});
				tmpList[platforms[i]] = null;
			}
		}
		setLinkedInfo(data);
		setTmpList(tmpList);

		platforms.forEach(platform => {
			if (data[platform] === 'verifing') {
				tmpList[platform] = 'verifing';
			}
		});
		setTmpList(tmpList);
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