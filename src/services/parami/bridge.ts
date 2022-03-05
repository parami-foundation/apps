import { web3FromSource } from "@polkadot/extension-dapp";
import { subWeb3Callback } from "./subscription";
import config from "@/pages/Dashboard/pages/Bridge/config";

export const AD3ToETH = async (account: any, amount: string, recipient: string) => {
    const injector = await web3FromSource(account.meta.source);
    const tx = window.apiWs.tx.xAssets.transferNative(amount, recipient, config.bridge.destId);
    const ex = window.apiWs.tx.magic.codo(tx);

    return await subWeb3Callback(ex, injector, account);
};