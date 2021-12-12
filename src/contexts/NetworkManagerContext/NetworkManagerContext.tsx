import type { AddMessageAction, ResetAction } from "@/reducers/TransitMessageReducer";
import { transitMessageReducer } from "@/reducers/TransitMessageReducer";
import type {
    Dispatch
} from "react";
import React, {
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import type { Adaptors } from "../Adaptors/typing";

interface INetworkManagerProviderProps {
    children: React.ReactNode | React.ReactNode[];
}

export type WalletType = Bridge.ChainType | "select" | "unset";

export type Vote = {
    address: string;
    signed?: "Confirmed" | "Rejected";
    order?: string;
    message?: string;
    eventType?: "Vote";
};

export type TransitMessage = {
    address: string;
    message?: string;
    proposalStatus?: number;
    order: number;
    signed?: "Confirmed" | "Rejected";
    eventType?: "Proposal" | "Vote";
};

export type TransactionStatus =
    | "Initializing Transfer"
    | "In Transit"
    | "Transfer Completed"
    | "Transfer Aborted";

interface NetworkManagerContext {
    walletType: WalletType;
    setWalletType: (walletType: WalletType) => void;

    networkId: number;
    setNetworkId: (id: number) => void;

    domainId?: number;

    homeChainConfig: Bridge.BridgeConfig | undefined;
    destinationChainConfig: Bridge.BridgeConfig | undefined;

    destinationChains: { domainId: number; name: string }[];
    homeChains: Bridge.BridgeConfig[];
    handleSetHomeChain: (domainId: number | undefined) => void;
    setDestinationChain: (domainId: number | undefined) => void;

    transactionStatus?: TransactionStatus;
    setTransactionStatus: (message: TransactionStatus | undefined) => void;
    inTransitMessages: TransitMessage[];

    setDepositVotes: (input: number) => void;
    depositVotes: number;

    setDepositNonce: (input: string | undefined) => void;
    depositNonce: string | undefined;

    tokensDispatch: Dispatch<AddMessageAction | ResetAction>;

    setTransferTxHash: (input: string) => void;
    transferTxHash: string;

    setHomeTransferTxHash: (input: string) => void;
    homeTransferTxHash: string;
}

const networkManagerContext = React.createContext<
    NetworkManagerContext | undefined
>(undefined);

const NetworkManagerProvider = ({ children }: INetworkManagerProviderProps) => {
    const [walletType, setWalletType] = useState<WalletType>("unset");

    const [networkId, setNetworkId] = useState(0);

    const [homeChainConfig, setHomeChainConfig] = useState<
        Bridge.BridgeConfig | undefined
    >();
    const [homeChains, setHomeChains] = useState<Bridge.BridgeConfig[]>([]);
    const [destinationChainConfig, setDestinationChain] = useState<
        Bridge.BridgeConfig | undefined
    >();
    const [destinationChains, setDestinationChains] = useState<Bridge.BridgeConfig[]>(
        []
    );

    const [transferTxHash, setTransferTxHash] = useState<string>("");
    const [homeTransferTxHash, setHomeTransferTxHash] = useState<string>("");
    const [transactionStatus, setTransactionStatus] = useState<
        TransactionStatus | undefined
    >(undefined);
    const [depositNonce, setDepositNonce] = useState<string | undefined>(
        undefined
    );
    const [depositVotes, setDepositVotes] = useState<number>(0);
    const [inTransitMessages, tokensDispatch] = useReducer(
        transitMessageReducer,
        []
    );

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

    useEffect(() => {
        if (walletType !== "unset") {
            if (walletType === "select") {
                setHomeChains(Bridge.chainbridgeConfig.chains);
            } else {
                setHomeChains(
                    Bridge.chainbridgeConfig.chains.filter(
                        (bridgeConfig: Bridge.BridgeConfig) => bridgeConfig.type === walletType
                    )
                );
            }
        } else {
            setHomeChains([]);
        }
    }, [walletType]);

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

    const DestinationProvider = ({
        children: Children,
    }: Adaptors.IDestinationBridgeProviderProps) => {
        if (destinationChainConfig?.type === "Ethereum") {
            return (
                <EVMDestinationAdaptorProvider>
                    {Children}
                </EVMDestinationAdaptorProvider>
            );
        } else if (destinationChainConfig?.type === "Substrate") {
            return (
                <SubstrateDestinationAdaptorProvider>
                    {Children}
                </SubstrateDestinationAdaptorProvider>
            );
        } else {
            return (
                <DestinationBridgeContext.Provider
                    value={{
                        disconnect: async () => { },
                    }}
                >
                    {Children}
                </DestinationBridgeContext.Provider>
            );
        }
    };

    return (
        <NetworkManagerContext.Provider
            value={{
                domainId: homeChainConfig?.domainId,
                networkId,
                setNetworkId,
                homeChainConfig,
                setWalletType,
                walletType,
                homeChains: homeChains,
                destinationChains,
                inTransitMessages,
                handleSetHomeChain,
                setDestinationChain: handleSetDestination,
                destinationChainConfig,
                transactionStatus,
                setTransactionStatus,
                depositNonce,
                depositVotes,
                setDepositNonce,
                setDepositVotes,
                tokensDispatch,
                setTransferTxHash,
                transferTxHash,
                setHomeTransferTxHash,
                homeTransferTxHash,
            }}
        >
            {walletType === "Ethereum" ? (
                <EVMHomeAdaptorProvider>
                    <DestinationProvider>{children}</DestinationProvider>
                </EVMHomeAdaptorProvider>
            ) : walletType === "Substrate" ? (
                <SubstrateHomeAdaptorProvider>
                    <DestinationProvider>{children}</DestinationProvider>
                </SubstrateHomeAdaptorProvider>
            ) : (
                <HomeBridgeContext.Provider
                    value={{
                        connect: async () => undefined,
                        disconnect: async () => { },
                        getNetworkName: (id: any) => "",
                        isReady: false,
                        selectedToken: "",
                        deposit: async (
                            amount: number,
                            recipient: string,
                            tokenAddress: string,
                            destinationChainId: number
                        ) => undefined,
                        setDepositAmount: () => undefined,
                        tokens: {},
                        setSelectedToken: (input: string) => undefined,
                        address: undefined,
                        bridgeFee: undefined,
                        chainConfig: undefined,
                        depositAmount: undefined,
                        nativeTokenBalance: undefined,
                        relayerThreshold: undefined,
                        wrapTokenConfig: undefined,
                        wrapper: undefined,
                        wrapToken: async (value: number) => "",
                        unwrapToken: async (value: number) => "",
                    }}
                >
                    <DestinationProvider>{children}</DestinationProvider>
                </HomeBridgeContext.Provider>
            )}
        </NetworkManagerContext.Provider>
    );
};

const useNetworkManager = () => {
    const context = useContext(networkManagerContext);
    if (context === undefined) {
        throw new Error(
            "useNetworkManager must be called within a HomeNetworkProvider"
        );
    }
    return context;
};

export { NetworkManagerProvider, useNetworkManager };
