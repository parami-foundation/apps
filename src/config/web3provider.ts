import WalletConnectProvider from "@walletconnect/web3-provider";

export const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: 'eca99940fe244068a87095aa826a34fa' // required
        }
    }
};

export const infuraId = 'eca99940fe244068a87095aa826a34fa';

export const infuraProvider = {
    1: 'https://mainnet.infura.io/v3/' + infuraId,
    3: 'https://ropsten.infura.io/v3/' + infuraId,
    4: 'https://rinkeby.infura.io/v3/' + infuraId,
    5: 'https://goerli.infura.io/v3/' + infuraId,
    42: 'https://kovan.infura.io/v3/' + infuraId,
}
