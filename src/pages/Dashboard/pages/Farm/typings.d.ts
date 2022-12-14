declare namespace Farm {
    type Pair = {
        incentives: any[];
        name: string;
        coinAddress: string;
        token: string;
        coin: string;
        reward: bigint;
    }

    type Liquid = {
        tokenId: number;
        staked: boolean;
        tickLower: any;
        tickUpper: any;
        incentiveIndex: number;
        liquidity: bigint;
    }
}