import WalletConnectProvider from "@walletconnect/web3-provider";

export const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: '774b1e4252de48c3997d66ac5f5078d8' // required
        }
    }
};