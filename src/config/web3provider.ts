import WalletConnectProvider from "@walletconnect/web3-provider";

export const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: '836f7f85d3104fae9263dee3bcac66c9' // required
        }
    }
};

export const infuraId = '836f7f85d3104fae9263dee3bcac66c9';

export const infuraProvider = {
    1: 'https://mainnet.infura.io/v3/' + infuraId,
    3: 'https://ropsten.infura.io/v3/' + infuraId,
    4: 'https://rinkeby.infura.io/v3/' + infuraId,
    5: 'https://goerli.infura.io/v3/' + infuraId,
    42: 'https://kovan.infura.io/v3/' + infuraId,
}
