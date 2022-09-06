import { web3FromSource } from "@polkadot/extension-dapp";
import { subWeb3Callback } from "./Subscription";
import { notification } from "antd";
import { ChainBridgeToken } from "@/models/chainbridge";
import { ethers } from "ethers";
import ERC20Abi from '@/pages/Dashboard/pages/Farm/abi/ERC20.json'
import { deleteComma } from "@/utils/format";

export const ERC20TokenToETH = async (token: ChainBridgeToken, account: any, amount: string, recipient: string) => {
    const injector = await web3FromSource(account.meta.source);
    const tx = token.assetId
        ? window.apiWs.tx.xAssets.transferToken(amount, recipient, token.ethChainId, token.assetId)
        : window.apiWs.tx.xAssets.transferNative(amount, recipient, token.ethChainId);

    return await subWeb3Callback(tx, injector, account);
}

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

export const getERC20TokenToEthTransferFee = async (chainId: number, assetId: number) => {
    try {
        const res = await window.apiWs.query.xAssets.transferTokenFee(chainId, assetId);
        if (res.isEmpty) {
            notification.error({
                message: 'Query ERC20 Token Transfer Fee Error',
                description: 'result is empty'
            })
            return;
        }
        return {
            fee: res.toHuman() as string
        }
    } catch (e) {
        notification.error({
            message: 'Query ERC20 Token Transfer Fee Error',
            description: JSON.stringify(e)
        });
        return;
    }
}

export const getTokenBalanceOnEth = async (token: ChainBridgeToken, signer: ethers.Signer, account: string) => {
    const tokenContract = new ethers.Contract(token.contract_address, ERC20Abi, signer);
    const balanceOnEth = await tokenContract.balanceOf(account);
    return balanceOnEth.toString();
}

export const getTokenBalanceOnParami = async (token: ChainBridgeToken, account: string) => {
    if (token.assetId) {
        const result = await window.apiWs.query.assets.account(Number(token.assetId), account);
        const { balance = '' } = result.toHuman() ?? {};
        const balanceStr = deleteComma(balance as string);
        return {
            free: balanceStr,
            total: balanceStr
        }
    } else {
        const info: any = await window.apiWs.query.system.account(account);
        const { data } = info.toHuman() ?? {};
        const free = deleteComma(data?.free ?? '');
        const reserved = deleteComma(data?.reserved ?? '');
        return {
            free,
            total: (BigInt(free) + BigInt(reserved)).toString()
        }
    }
}