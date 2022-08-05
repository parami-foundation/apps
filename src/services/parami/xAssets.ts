import { web3FromSource } from "@polkadot/extension-dapp";
import { subWeb3Callback } from "./Subscription";
import config from "@/pages/Dashboard/pages/Bridge/config";
import { notification } from "antd";

export const AD3ToETH = async (account: any, amount: string, recipient: string) => {
    const injector = await web3FromSource(account.meta.source);
    const tx = window.apiWs.tx.xAssets.transferNative(amount, recipient, config.bridge.destId);

    return await subWeb3Callback(tx, injector, account);
};

export const getAD3ToETHTransferFee = async () => {
    try {
        const res = await window.apiWs.query.xAssets.nativeFee();
        if (res.isEmpty) {
            notification.error({
                message: 'Query nativeFee Error',
                description: 'result is empty'
            })
            return;
        }
        return {
            fee: res.toHuman() as string
        }
    } catch (e) {
        notification.error({
            message: 'Query nativeFee Error',
            description: JSON.stringify(e)
        });
        return;
    }
}