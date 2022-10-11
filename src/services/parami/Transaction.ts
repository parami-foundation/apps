import { Keyring } from '@polkadot/api';
import { didToHex, parseAmount } from '@/utils/common';
import { subCallback } from './Subscription';
import { DecodeKeystoreWithPwd } from './Crypto';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import { FloatStringToBigInt } from '@/utils/format';

const instanceKeyring = new Keyring({ type: 'sr25519' });

export const Transfer = async (amount: string, keystore: string, toAddress: string, password: string, preTx?: boolean, account?: string) => {
  let to = toAddress;
  if (/^did:ad3:/.test(toAddress)) {
    to = didToHex(to);
    if (!to) {
      throw new Error('Wrong Did');
    }
  }
  const ex = window.apiWs.tx.balances.transfer(to, parseAmount(amount));

  if (preTx && account) {
    const info = await ex.paymentInfo(account);
    return info;
  }

  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong Password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  return await subCallback(ex, payUser);
};

export const TransferAsset = async (assetId: number, deciamls: number, amount: string, keystore: string, toAddress: string, password: string, preTx?: boolean, account?: string) => {
  let to = toAddress;
  if (/^did:ad3:/.test(toAddress)) {
    to = didToHex(to);
    if (!to) {
      throw new Error('Wrong Did');
    }
  }
  const ex = window.apiWs.tx.assets.transfer(assetId, to, FloatStringToBigInt(amount, deciamls).toString());

  if (preTx && account) {
    const info = await ex.paymentInfo(account);
    return info;
  }

  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong Password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  return await subCallback(ex, payUser);
};

export const GetExistentialDeposit = async () => {
  const existentialDeposit = await window.apiWs.consts.balances.existentialDeposit;
  return existentialDeposit.toString();
};

export const TransactionInfo = async (transfer: SubmittableExtrinsic<"promise", any>, account: string) => {
  const info = await transfer.paymentInfo(account);

  return info;
};
