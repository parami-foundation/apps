import { Keyring } from '@polkadot/api';
import { didToHex, parseAmount } from '@/utils/common';
import { subCallback } from './Subscription';
import { DecodeKeystoreWithPwd } from './Crypto';
import type { SubmittableExtrinsic } from '@polkadot/api/types';

const instanceKeyring = new Keyring({ type: 'sr25519' });

export const Transfer = async (amount: string, keystore: string, toAddress: string, password: string, preTx?: boolean) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong Password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  let to = toAddress;
  if (/^did:ad3:/.test(toAddress)) {
    to = didToHex(to);
    if (!to) {
      throw new Error('Wrong Did');
    }
  }
  const ex = window.apiWs.tx.balances.transfer(to, parseAmount(amount));

  if (preTx) {
    const info = await ex.paymentInfo(payUser);
    return info;
  }

  return await subCallback(ex, payUser);
};

export const TransferAsset = async (assetId: number, amount: string, keystore: string, toAddress: string, password: string, preTx?: boolean) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong Password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  let to = toAddress;
  if (/^did:ad3:/.test(toAddress)) {
    to = didToHex(to);
    if (!to) {
      throw new Error('Wrong Did');
    }
  }
  const ex = window.apiWs.tx.assets.transfer(assetId, to, parseAmount(amount));

  if (preTx) {
    const info = await ex.paymentInfo(payUser);
    return info;
  }

  return await subCallback(ex, payUser);
};

export const getTransFee = async (toAddress: string, myAddress: string, amount: string) => {
  const transfer = window.apiWs.tx.balances.transfer(toAddress, parseAmount(amount));

  const info = await transfer.paymentInfo(myAddress);

  return info.partialFee;
};

export const getTokenTransFee = async (token: any, toAddress: string, myAddress: string, amount: string) => {
  const transfer = window.apiWs.tx.assets.transfer(token, toAddress, parseAmount(amount));

  const info = await transfer.paymentInfo(myAddress);

  return info.partialFee;
};

export const GetExistentialDeposit = async () => {
  const existentialDeposit = await window.apiWs.consts.balances.existentialDeposit;
  return existentialDeposit.toString();
};

export const TransactionInfo = async (transfer: SubmittableExtrinsic<"promise", any>, account: string) => {
  const info = await transfer.paymentInfo(account);

  return info;
};
