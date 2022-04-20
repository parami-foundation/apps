import { Keyring } from '@polkadot/api';
import { DecodeKeystoreWithPwd } from './crypto';
import { subCallback } from './subscription';

const instanceKeyring = new Keyring({ type: 'sr25519' });

export const BuyToken = async (assetId: string, amount: string, maxCurrency: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);
  const ddl = await window.apiWs.query.system.number();
  const tx = window.apiWs.tx.swap.buyTokens(assetId, amount, maxCurrency, ddl.toNumber() + 5);

  return await subCallback(tx, payUser);
};

export const SellToken = async (assetId: string, amount: string, maxCurrency: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);
  const ddl = await window.apiWs.query.system.number();
  const tx = window.apiWs.tx.swap.sellTokens(assetId, amount, maxCurrency, ddl.toNumber() + 5);

  return await subCallback(tx, payUser);
};

export const GetValueOf = async (assetId: string, amount: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylySellTokens(assetId, amount);
  return value.toHuman();
};

export const GetCostOf = async (assetId: string, amount: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylyBuyTokens(assetId, amount);
  return value.toHuman();
};

export const DrylySellCurrency = async (assetId: string, amount: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylySellCurrency(assetId, amount);
  return value.toHuman();
};

export const DrylyBuyCurrency = async (assetId: string, amount: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylyBuyCurrency(assetId, amount);
  return value.toHuman();
};

export const GetAssetBalance = async (assetId: string, address: string): Promise<string> => {
  const { balance }: any = await window.apiWs.query.assets.account(Number(assetId), address);
  if (!!balance) {
    return balance;
  }
  return '0';
};

export const GetPreferedNFT = async (did: string) => {
  const id = await window.apiWs.query.nft.preferred(did);
  return id;
};

export const GetNFTMetaData = async (id: string) => {
  const nftInfo = await window.apiWs.query.nft.metadata(id);
  return nftInfo;
};

export const NftMint = async (name: string, symbol: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  const mint = await window.apiWs.tx.nft.mint(name, symbol);
  let result = false;
  await mint.signAndSend(payUser, ({ events = [], status }) => {
    if (status.isInBlock || status.isFinalized) {
      events
        // find/filter for failed events
        .filter(({ event }) =>
          window.apiWs.events.system.ExtrinsicFailed.is(event)
        )
        // we know that data for system.ExtrinsicFailed is
        // (DispatchError, DispatchInfo)
        .forEach(({ event: { data: [error] } }: any) => {
          if (error.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = window.apiWs.registry.findMetaError(error.asModule);
            const { docs, method, section } = decoded;

            console.log(`${section}.${method}: ${docs.join(' ')}`);
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            console.log(error.toString());
          }
        });
    }
    result = true;
  });
  return result;
};

export const GetAssetInfo = async (assetId: string) => {
  const assetInfo = await window.apiWs.query.assets.metadata(Number(assetId));
  return assetInfo;
};

export const GetAssetDetail = async (assetId: string) => {
  const assetInfo = await window.apiWs.query.assets.asset(Number(assetId));
  return assetInfo;
};

export const GetAssetsHolders = async (assetId: string) => {
  const accounts = await window.apiWs.query.assets.account.entries(assetId);
  return accounts;
};

export const GetAdRemain = async (slot: any) => {
  const remainToken = await (window.apiWs.rpc as any).swap.drylySellCurrency(slot.nft, slot.remain.replace(/,/g, ''));
  return BigInt(remainToken.toHuman()) + BigInt(slot.tokens.replace(/,/g, ''));
};

// New 20220324

export const KickNFT = async (password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  const tx = window.apiWs.tx.nft.kick();

  return await subCallback(tx, payUser);
};



type NFTNetwork =
  'Unknown'
  | 'Binance'
  | 'Bitcoin'
  | 'Eosio'
  | 'Ethereum'
  | 'Kusama'
  | 'Polkadot'
  | 'Solana'
  | 'Tron'
  | 'Near';
export const PortNFT = async (password: string, keystore: string, network: NFTNetwork, namespace: string, tokenID: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);
  const tx = window.apiWs.tx.nft.port(network, namespace, tokenID);

  return await subCallback(tx, payUser);
};

export const SupportDAO = async (nftID: string, amount: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);
  const tx = window.apiWs.tx.nft.back(nftID, amount);

  return await subCallback(tx, payUser);
};

export const MintNFT = async (nftID: string, name: string, symbol: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);
  const tx = window.apiWs.tx.nft.mint(nftID, name, symbol);

  return await subCallback(tx, payUser);
};

export const ClaimNFT = async (nftID: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);
  const tx = window.apiWs.tx.nft.claim(nftID);

  return await subCallback(tx, payUser);
};


export const GetKolDeposit = async (did: string) => {
  const id = await GetPreferedNFT(did);
  if (id.isEmpty) {
    return null;
  }
  const deposit = await window.apiWs.query.nft.deposit(id.toHuman());
  return deposit;
};
