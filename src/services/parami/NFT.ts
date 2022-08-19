import { Keyring } from '@polkadot/api';
import { DecodeKeystoreWithPwd } from './Crypto';
import { subCallback } from './Subscription';
import { BigNumber } from "ethers";

const instanceKeyring = new Keyring({ type: 'sr25519' });

export const GetPreferredNFT = async (did: string) => {
  const id = await window.apiWs.query.nft.preferred(did);
  return id;
};

export const GetNFTMetaData = async (id: string) => {
  const nftInfo = await window.apiWs.query.nft.metadata(id);
  return nftInfo;
};

export const NftMint = async (name: string, symbol: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = await window.apiWs.tx.nft.mint(name, symbol);

  if (preTx && account) {
    const info = await ex.paymentInfo(account);
    return info;
  }

  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  let result = false;

  await ex.signAndSend(payUser, ({ events = [], status }) => {
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

export const KickNFT = async (password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.kick();

  if (preTx && account) {
    const info = await ex.paymentInfo(account);
    return info;
  }

  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  return await subCallback(ex, payUser);
};

export const PortNFT = async (password: string, keystore: string, network: NFTNetwork, namespace: string, tokenID: BigNumber, ethAccount: string, signature: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.port(network, namespace, tokenID.toHexString(), ethAccount, signature);

  if (preTx && account) {
    const info = await ex.paymentInfo(account);
    return info;
  }

  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  return await subCallback(ex, payUser);
};

export const SupportDAO = async (nftID: string, amount: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.back(nftID, amount);

  if (preTx && account) {
    const info = await ex.paymentInfo(account);
    return info;
  }

  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  return await subCallback(ex, payUser);
};

export const MintNFT = async (nftID: string, name: string, symbol: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.mint(nftID, name, symbol);

  if (preTx && account) {
    const info = await ex.paymentInfo(account);
    return info;
  }

  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  return await subCallback(ex, payUser);
};

export const ClaimNFT = async (nftID: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.claim(nftID);

  if (preTx && account) {
    const info = await ex.paymentInfo(account);
    return info;
  }

  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  return await subCallback(ex, payUser);
};

export const GetKolDeposit = async (did: string) => {
  const id = await GetPreferredNFT(did);
  if (id.isEmpty) {
    return null;
  }
  const deposit = await window.apiWs.query.nft.deposit(id.toHuman());
  return deposit;
};
