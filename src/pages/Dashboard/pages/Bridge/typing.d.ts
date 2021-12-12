declare namespace Bridge {
    type WalletType = ChainType | "select" | "unset";

    type PreflightDetails = {
        tokenAmount: number;
        token: string;
        tokenSymbol: string;
        receiver: string;
    };

    type ChainType = "Ethereum" | "Substrate";

    type TokenConfig = {
        address: string;
        name?: string;
        symbol?: string;
        imageUri?: string;
        resourceId: string;
        isNativeWrappedToken?: boolean;
        decimals?: number;
        isDoubleApproval?: boolean;
    };

    type BridgeConfig = {
        networkId?: number;
        domainId: number;
        name: string;
        rpcUrl: string;
        type: ChainType;
        tokens: TokenConfig[];
        nativeTokenSymbol: string;
        decimals: number;
    };

    type EvmBridgeConfig = BridgeConfig & {
        bridgeAddress: string;
        erc20HandlerAddress: string;
        type: "Ethereum";
        //This should be the full path to display a tx hash, without the trailing slash, ie. https://etherscan.io/tx
        blockExplorer?: string;
        defaultGasPrice?: number;
        deployedBlockNumber?: number;
    };

    type SubstrateBridgeConfig = BridgeConfig & {
        type: "Substrate";
        chainbridgePalletName: string;
        bridgeFeeFunctionName?: string; // If this value is provided, the chain value will be used will be used
        bridgeFeeValue?: number; // If the above value is not provided, this value will be used for the fee. No scaling should be applied.
        transferPalletName: string;
        transferFunctionName: string;
        typesFileName: string;
        blockExplorer?: string;
    };

    type ChainbridgeConfig = {
        chains: (EvmBridgeConfig | SubstrateBridgeConfig)[];
    };

    const chainbridgeConfig: ChainbridgeConfig =
        window.__RUNTIME_CONFIG__.CHAINBRIDGE;

    type TransactionStatus =
        | "Initializing Transfer"
        | "In Transit"
        | "Transfer Completed"
        | "Transfer Aborted";
}