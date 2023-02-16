import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from 'ethers';
import { useCallback, useEffect, useState } from "react";
import Web3Modal from 'web3modal';
import { EthNetworkName } from "@/config/ethereumNetwork";
import { message, notification } from 'antd';
import { numberToHex } from "@polkadot/util";

const providerOptions = {
    // Example with WalletConnect provider
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: "eca99940fe244068a87095aa826a34fa" // required
        }
    }
};

interface ProviderRpcError {
    message: string;
    code: number;
    data?: unknown;
}

type SupportedChainId = 1 | 3 | 4 | 5;
const chainIdSupported = (chainId: number): chainId is SupportedChainId => chainId === 1 || chainId === 3 || chainId === 4 || chainId === 5;

export default () => {
    const [Account, setAccount] = useState<string>('');
    const [Provider, setProvider] = useState<any>(null);
    const [Web3Provider, setWeb3Provider] = useState<providers.Web3Provider | null>(null);
    const [Signer, setSigner] = useState<providers.JsonRpcSigner | null>(null);
    const [BlockNumber, setBlockNumber] = useState<number>(0);
    const [ChainId, setChainId] = useState<SupportedChainId>();
    const [ChainName, setChainName] = useState<string>('');
    const [Network, setNetwork] = useState<providers.Network>();
    const [NoProvider, setNoProvider] = useState<boolean>(false);

    useEffect(() => {
        Web3Provider?.on('block', (blockNo: number) => {
            setBlockNumber(blockNo);
        });
    }, [Web3Provider]);

    const disconnect = useCallback(async () => {
        const web3Modal = new Web3Modal({
            cacheProvider: true,
            providerOptions,
        });
        try {
            web3Modal.clearCachedProvider();
            setProvider(null);
            setWeb3Provider(null);
            setSigner(null);
            setAccount('');
            setNetwork(undefined);
        } catch (e: any) {
            message.error(e.message);
            setNoProvider(true);
        }
    }, []);

    const connect = useCallback(async () => {
        const web3Modal = new Web3Modal({
            cacheProvider: true,
            providerOptions,
        });
        try {
            const provider = await web3Modal.connect();
            setProvider(provider);
            const web3Provider = new providers.Web3Provider(provider);
            setWeb3Provider(web3Provider);
            const signer = web3Provider.getSigner();
            setSigner(signer);
            const account = await signer.getAddress();
            setAccount(account);
            const network = await web3Provider.getNetwork();
            setNetwork(network);
            const chainId = await signer.getChainId();
            if (chainIdSupported(chainId)) {
                setChainId(chainId);
                setChainName(EthNetworkName[chainId]);
            } else {
                notification.warning({
                    message: 'Unsupported ChainId',
                    description: `ChainId: ${chainId}`
                });
                (async () => {
                    try {
                        if (window.ethereum) {
                            await window.ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: '0x1' }],
                            });
                        }
                    } catch (e) {
                        console.log('Switch Eth Chain Error', e);
                    }
                })();
            }

            provider.on('accountsChanged', function (accounts: string[]) {
                if (accounts.length === 0) {
                    setAccount('');
                    setSigner(null);
                }
                setAccount(accounts[0]);
                const newSign = web3Provider.getSigner()
                setSigner(newSign);
            });
            provider.on('chainChanged', (_newChainId: number) => {
                window.location.reload();
            });
            provider.on('disconnect', (error: ProviderRpcError) => {
                console.log('disconnect', error.code, error.message, error.data);
                disconnect();
                Provider.removeAllListeners();
            });
        } catch (e: any) {
            message.error(e.message || e);
            setNoProvider(true);
        }
    }, []);

    return {
        Account,
        Provider,
        Web3Provider,
        Signer,
        BlockNumber,
        ChainId,
        ChainName,
        NoProvider,
        Network,
        connect,
        disconnect,
    }
}
