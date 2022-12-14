const umi_env = process.env.UMI_ENV;
const isDev: boolean = umi_env ? umi_env === 'dev' : false;

export const config = {
  "const": {
    "minimalCharge": "100000000000000000",
    "adEarnUpTo": "500000000000000000000",
  },
  "main": isDev ? {
    "socketServer": "wss://staging.parami.io/ws",
    "subqueryServer": "https://staging.parami.io/graph/",
    "tagMapConfig": "/tagmap.json",
    "chainBridgeConfig": "/chainbridge.staging.json",
    "tokenListConfig": "/tokens.json",
    "airdropServer": "https://staging.parami.io/airdrop",
    "webNotificationServer": "https://staging.parami.io/webnotify",
    "weeklySite": "https://weekly.parami.io/"
  } : {
    "socketServer": "wss://rpc-global.parami.io/ws",
    "subqueryServer": "https://graph.parami.io",
    "tagMapConfig": "/tagmap.json",
    "chainBridgeConfig": "/chainbridge.json",
    "tokenListConfig": "/tokens.json",
    "airdropServer": "https://airdrop.parami.io",
    "webNotificationServer": "https://webnotify.parami.io",
    "weeklySite": "https://weekly.parami.io/"
  },
  "ipfs": {
    "host": "ipfs.parami.io",
    "upload": "https://ipfs.parami.io/api/v0/add?stream-channels=true",
    "endpoint": "https://ipfs.parami.io/ipfs/",
  },
  "hnft": {
    "site": "https://hnft.parami.io",
  },
  "walletConnect": {
    "bridge": "https://bridge.walletconnect.org",
    "relay": "wss://relay.walletconnect.com",
    "key": "69e4534ef8f5fd6b94a3fc46ad255014",
  },
  "airdropService": {
    "telegram": {
      "botName": isDev ? "parami_staging_bot" : "paramiofficialbot",
    },
    "discord": {
      "clientId": "1010906937421987902",
      "redirectUri": "/create/discord",
      "oauthEndpoint": "https://discord.com/oauth2/authorize"
    },
  },
  "advertisement": {
    "defaultDelegatedDid": "did:ad3:izgyiwwftd7s1D3XaREJZBR2kvZ"
  },
  "explorer": {
    "extrinsics": "https://block.parami.io/extrinsics/",
    "block": "https://block.parami.io/blocks/",
  },
  "page": {
    "homePage": "/",
    "createPage": "/create",
    "recoverPage": "/recover",
    "walletPage": "/wallet",
    "sendPage": "/wallet/send",
    "receivePage": "/wallet/receive",
    "buyPage": "/wallet/buy",
    "chargePage": "/wallet/charge",
    "accountPage": "/profile",
    "recordPage": "/record",
    "creatorPage": "/creator",
    "miningPage": "/mining",
    "notSupport": "/notSupport",
    "socialPage": "/social",
    "dashboard": {
      "homePage": "/dashboard",
      "didPage": "/dashboard/did",
      "adsPage": "/dashboard/ads",
    }
  },
  "types": {
    "Public": "MultiSigner",
    "LookupSource": "MultiAddress",
    "Address": "MultiAddress",
    "ChainId": "u32",
    "DepositNonce": "u64",
    "ClassId": "()",
    "TokenId": "()",
    "TAssetBalance": "u128",
    "NativeBalance": "Balance",
    "SwapAssetBalance": "TAssetBalance",
    "SwapPair": {
      "account": "AccountId",
      "nativeReserve": "Balance",
      "assetReserve": "TAssetBalance"
    },
    "TagType": "u8",
    "TagScore": "i8",
    "TagCoefficient": "u8",
    "GlobalId": "u64",
    "AdvertiserId": "GlobalId",
    "AdId": "GlobalId",
    "Advertiser": {
      "createdTime": "Compact<Moment>",
      "advertiserId": "Compact<AdvertiserId>",
      "deposit": "Compact<Balance>",
      "depositAccount": "AccountId",
      "rewardPoolAccount": "AccountId"
    },
    "Advertisement": {
      "createdTime": "Compact<Moment>",
      "deposit": "Compact<Balance>",
      "tagCoefficients": "Vec<(TagType, TagCoefficient)>",
      "signer": "AccountId",
      "mediaRewardRate": "Compact<PerU16>"
    },
    "AdvertiserOf": "Advertiser",
    "AdvertisementOf": "Advertisement",
    "StableAccountOf": "StableAccount",
    "StableAccount": {
      "createdTime": "Compact<Moment>",
      "stashAccount": "AccountId",
      "controllerAccount": "AccountId",
      "magicAccount": "AccountId",
      "newControllerAccount": "Option<AccountId>"
    }
  },
  rpc: {
    did: {
      getMetadata: {
        description: 'Get metadata of a DID',
        params: [
          {
            // DID
            name: 'did',
            type: 'H160',
          },
          {
            // Meta key
            name: 'key',
            type: 'String',
          },
          {
            // RPC ignore
            name: 'at',
            type: 'Hash',
            isOptional: true,
          },
        ],
        // Meta value
        type: 'String',
      },
      batchGetMetadata: {
        description: 'Get metadata of a DID',
        params: [
          {
            // DID
            name: 'did',
            type: 'H160',
          },
          {
            // List of meta keys
            name: 'keys',
            type: 'Vec<String>',
          },
          {
            // RPC ignore
            name: 'at',
            type: 'Hash',
            isOptional: true,
          },
        ],
        // List of meta values
        type: 'Vec<String>',
      },
    } as any,
    nft: {
      getClaimInfo: {
        description: 'getClaimInfo',
        params: [
          {
            name: 'nft_id',
            type: 'u64',
          },
          {
            name: 'claimer',
            type: 'H160',
          }
        ],
        type: '(String, String, String)',
      }
    } as any,
    swap: {
      drylyAddLiquidity: {
        description: 'Dryly add liquidity to the pool',
        params: [
          {
            // Token ID
            name: 'token_id',
            type: 'u64',
          },
          {
            //  AD3
            name: 'currency',
            type: 'String',
          },
          {
            //  max_tokens=  0
            name: 'max_tokens',
            type: 'String',
          },
          {
            // RPC ignore
            name: 'at',
            type: 'Hash',
            isOptional: true,
          },
        ],
        // Token Balance, LP* Balance
        type: '(String, String)',
      },
      drylyRemoveLiquidity: {
        description: 'Dryly remove liquidity from the pool',
        params: [
          {
            // Token ID
            name: 'lp_token_id',
            type: 'u64',
          },
          {
            // RPC igonre
            name: 'at',
            type: 'Hash',
            isOptional: true,
          },
        ],
        // Token ID, LP* Balance, Token Balance, AD3 Balance
        type: '(u64, String, String, String)',
      },
      drylyBuyTokens: {
        description: 'Dryly buy tokens from the pool',
        params: [
          {
            // Token ID
            name: 'token_id',
            type: 'u64',
          },
          {
            // Token amount
            name: 'tokens',
            type: 'String',
          },
          {
            // RPC igonre
            name: 'at',
            type: 'Hash',
            isOptional: true,
          },
        ],
        // AD3 needed
        type: 'String',
      },
      drylySellTokens: {
        description: 'Dryly sell tokens to the pool',
        params: [
          {
            // Token ID
            name: 'token_id',
            type: 'u64',
          },
          {
            //  Token amount
            name: 'tokens',
            type: 'String',
          },
          {
            // RPC igonre
            name: 'at',
            type: 'Hash',
            isOptional: true,
          },
        ],
        //  AD3 Balance
        type: 'String',
      },
      drylySellCurrency: {
        description: 'Dryly sell currency to the pool',
        params: [
          {
            // Token ID
            name: 'token_id',
            type: 'u64',
          },
          {
            //  AD3
            name: 'currency',
            type: 'String',
          },
          {
            // RPC igonre
            name: 'at',
            type: 'Hash',
            isOptional: true,
          },
        ],
        //  Token
        type: 'String',
      },
      drylyBuyCurrency: {
        description: 'Dryly buy currency from the pool',
        params: [
          {
            // Token ID
            name: 'token_id',
            type: 'u64',
          },
          {
            //  AD3
            name: 'currency',
            type: 'String',
          },
          {
            // RPC igonre
            name: 'at',
            type: 'Hash',
            isOptional: true,
          },
        ],
        //  Token
        type: 'String',
      },
      calculateReward: {
        description: 'Calculate staking reward',
        params: [
          {
            // Token ID
            name: 'lp_token_id',
            type: 'u64',
          },
          {
            // RPC igonre
            name: 'at',
            type: 'Hash',
            isOptional: true,
          },
        ],
        //  Token
        type: 'String',
      },
    },
  },
  runtime: {
    AdRuntimeApi: [
      {
        methods: {
          cal_reward: {
            description: 'pre calculate reward of this did, adId, nftId pair',
            params: [
              {
                name: 'ad_id',
                type: 'H256',
              },
              {
                name: 'nft_id',
                type: 'u32',
              },
              {
                name: 'visitor',
                type: 'H160',
              },
              {
                name: 'referrer',
                type: 'Option<H160>',
              }
            ],
            type: 'u128'
          }
        },
        version: 1
      }
    ],
    ClockInRuntimeApi: [{
      methods: {
          get_clock_in_info: {
              description: "(enabled, claimable, token)",
              params: [
                  {
                      "name": "nft_id",
                      "type": "u32"
                  },
                  {
                      "name": "did",
                      "type": "H160"
                  }
              ],
              type: "(u8, bool, bool, u128)"
          }
      },
      version: 1
  }]
  }
};
export default config;