import type { Tokens } from "@chainsafe/web3-context/dist/context/tokensReducer";

declare namespace Adaptors {
    type IHomeBridgeProviderProps = {
        children: React.ReactNode | React.ReactNode[];
    }

    type IDestinationBridgeProviderProps = {
        children: React.ReactNode | React.ReactNode[];
    }

    type IWeb3ProviderWrapper = {
        children: React.ReactNode | React.ReactNode[];
    }

    type InjectedAccountType = {
        address: string;
        meta: {
            name: string;
            source: string;
        };
    }

    type HomeChainAdaptorContext = {
        chainConfig: Bridge.BridgeConfig | undefined;

        getNetworkName: (id: any) => string;

        connect: () => Promise<void>;
        disconnect: () => Promise<void>;

        deposit: (
            amount: number,
            recipient: string,
            tokenAddress: string,
            destinationChainId: number
        ) => Promise<void>;

        relayerThreshold: number | undefined;

        setDepositAmount: (input: number | undefined) => void;
        depositAmount: number | undefined;

        setSelectedToken: (tokenAddress: string) => void;
        selectedToken: string;

        bridgeFee: number | undefined;

        wrapTokenConfig: Bridge.TokenConfig | undefined;
        wrapper: Weth | undefined;

        wrapToken: (value: number) => Promise<string>;
        unwrapToken: (value: number) => Promise<string>;

        isReady: boolean;
        address: string | undefined;
        accounts?: InjectedAccountType[];
        selectAccount?: (index: number) => void;
        nativeTokenBalance: number | undefined;

        handleCheckSupplies?: (
            amount: number,
            tokenAddress: string,
            destinationChainId: number
        ) => Promise<boolean | undefined>;

        tokens: Tokens;
    }

    type DestinationChainContext = {
        disconnect: () => Promise<void>;
    }
}