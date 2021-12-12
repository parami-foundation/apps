import { useCallback, useEffect, useState } from "react";

export default () => {
    const [walletType, setWalletType] = useState<Bridge.WalletType>("unset");

    const [networkId, setNetworkId] = useState(0);

    const [homeChainConfig, setHomeChainConfig] = useState<Bridge.BridgeConfig | undefined>();
    const [homeChains, setHomeChains] = useState<Bridge.BridgeConfig[]>([]);

    const [destinationChainConfig, setDestinationChain] = useState<Bridge.BridgeConfig | undefined>();
    const [destinationChains, setDestinationChains] = useState<Bridge.BridgeConfig[]>([]);

    const [transferTxHash, setTransferTxHash] = useState<string>("");
    const [homeTransferTxHash, setHomeTransferTxHash] = useState<string>("");

    const [transactionStatus, setTransactionStatus] = useState<Bridge.TransactionStatus | undefined>(undefined);

    const [depositNonce, setDepositNonce] = useState<string | undefined>(undefined);
    const [depositVotes, setDepositVotes] = useState<number>(0);


    const handleSetHomeChain = useCallback(
        (domainId: number | undefined) => {
            if (!domainId && domainId !== 0) {
                setHomeChainConfig(undefined);
                return;
            }
            const chain = homeChains.find((c) => c.domainId === domainId);

            if (chain) {
                setHomeChainConfig(chain);
                setDestinationChains(
                    Bridge.chainbridgeConfig.chains.filter(
                        (bridgeConfig: Bridge.BridgeConfig) =>
                            bridgeConfig.domainId !== chain.domainId
                    )
                );
                if (Bridge.chainbridgeConfig.chains.length === 2) {
                    setDestinationChain(
                        Bridge.chainbridgeConfig.chains.find(
                            (bridgeConfig: Bridge.BridgeConfig) =>
                                bridgeConfig.domainId !== chain.domainId
                        )
                    );
                }
            }
        },
        [homeChains, setHomeChainConfig]
    );

    const handleSetDestination = useCallback(
        (domainId: number | undefined) => {
            if (domainId === undefined) {
                setDestinationChain(undefined);
            } else if (homeChainConfig && !depositNonce) {
                const chain = destinationChains.find((c) => c.domainId === domainId);
                if (!chain) {
                    throw new Error("Invalid destination chain selected");
                }
                setDestinationChain(chain);
            } else {
                throw new Error("Home chain not selected");
            }
        },
        [depositNonce, destinationChains, homeChainConfig]
    );

    //     const DestinationProvider = ({
    //         children,
    //     }: Adaptors.IDestinationBridgeProviderProps) => {
    //         if (destinationChainConfig?.type === "Ethereum") {
    //             return (
    //                 <EVMDestinationAdaptorProvider>
    //                 { children }
    //                 < /EVMDestinationAdaptorProvider>
    //             );
    //         } else if (destinationChainConfig?.type === "Substrate") {
    //             return (
    //                 <SubstrateDestinationAdaptorProvider>
    //                 { children }
    //                 < /SubstrateDestinationAdaptorProvider>
    //             );
    //         } else {
    //             return (
    //                 <DestinationBridgeContext.Provider
    //               value= {{
    //                 disconnect: async () => { },
    //               }
    //         }
    //             >
    //             { children }
    //             < /DestinationBridgeContext.Provider>
    //           );
    // }
    //       };

    useEffect(() => {
        if (walletType !== "unset") {
            if (walletType === "select") {
                setHomeChains(Bridge.chainbridgeConfig.chains);
            } else {
                setHomeChains(
                    Bridge.chainbridgeConfig.chains.filter(
                        (bridgeConfig: Bridge.BridgeConfig) => bridgeConfig.type === walletType
                    )
                )
            }
        } else {
            setHomeChains([]);
        }
    }, [walletType]);
}