import { Keyring } from '@polkadot/api';
import { DecodeKeystoreWithPwd, errCb } from './wallet';
const instanceKeyring = new Keyring({ type: 'sr25519' });

export const GetUserInfo = async (did: string) => {
  const userInfo = await window.apiWs.query.did.metadata(did);
  const [avatar, nickname] = await window.apiWs.rpc.did_batchGetMetadata(did, ['pic', 'name']);
  return { ...userInfo, avatar, nickname };
};

export const BuyToken = async (assetId: string, amount: string, maxCurrency: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);
  const ddl = await window.apiWs.query.system.number();
  const buyTokens = window.apiWs.tx.swap.buyTokens(assetId, amount, maxCurrency, ddl.toNumber() + 5);
  const codo = window.apiWs.tx.magic.codo(buyTokens);
  await codo.signAndSend(payUser, errCb);
};

export const SellToken = async (assetId: string, amount: string, maxCurrency: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);
  const ddl = await window.apiWs.query.system.number();
  const sellTokens = window.apiWs.tx.swap.sellTokens(assetId, amount, maxCurrency, ddl.toNumber() + 5);
  const codo = window.apiWs.tx.magic.codo(sellTokens);
  await codo.signAndSend(payUser, errCb);
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

export const GetKolDeposit = async (did: string) => {
  const deposit = await window.apiWs.query.nft.deposit(did);
  return deposit;
};

export const SupportSomeBody = async (did: string, amount: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);
  const back = window.apiWs.tx.nft.back(did, amount);
  const codo = window.apiWs.tx.magic.codo(back);
  await codo.signAndSend(payUser, errCb);
};

export const NftMint = async (name: string, symbol: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  const mint = await window.apiWs.tx.nft.mint(name, symbol);
  const codo = window.apiWs.tx.magic.codo(mint);
  let result = false;
  await codo.signAndSend(payUser, ({ events = [], status }) => {
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