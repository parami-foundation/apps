/* eslint-disable @typescript-eslint/no-unused-vars */
import { decodeAddress } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';
import CryptoJS from 'crypto-js';
import { didToHex, parseAmount } from '@/utils/common';
import { message, notification } from 'antd';
import type { AccountData } from '@polkadot/types/interfaces';
import { subCallback } from './subscription';
import { getOrInit } from '@/services/parami/init';

// Create a new keyring, and add an sr25519 type account
const instanceKeyring = new Keyring({ type: 'sr25519' });

export const errCb = ({ events = [], status, dispatchError }: any) => {
  console.log(`Current status is ${status.type}`);

  if (dispatchError) {
    if (dispatchError.isModule) {
      // for module errors, we have the section indexed, lookup
      const decoded = window.apiWs.registry.findMetaError(dispatchError.asModule);
      const { docs, name, section } = decoded;

      console.log(`${section}.${name}: ${docs.join(" ")}`);
    } else {
      // Other, CannotLookup, BadOrigin, no extra info
      console.log(dispatchError.toString());
    }
  }
  if (status.isInBlock) {
    notification.success({
      message: 'Included at block hash',
      description: status.asInBlock.toHex(),
    });
    events.forEach(({ phase, event: { data, method, section } }) => {
      console.log(` ${phase}: ${section}.${method}:: ${data}`);
      console.log(data.toHuman());
    });
  }
  if (status.isFinalized) {
    notification.success({
      message: 'Finalized block hash',
      description: status.asFinalized.toHex(),
    });
  }
};

const padding = (input: string) => {
  let Input = input;
  if (Input === '' || Input === undefined || !Input) {
    message.error('Wrong Password');
    return;
  }
  let paddingCount = Input.length % 4;
  paddingCount = 4 - paddingCount;
  for (let i = 0; i < paddingCount; i += 1) {
    Input = Input.concat('p');
  }
  return Input;
};

export const EncodeKeystoreWithPwd = (password: string, contentString: string) => {
  const Password = padding(password);

  if (Password === null || Password === undefined || !Password) {
    return;
  }

  const key = CryptoJS.enc.Utf8.parse(Password);
  const iv = CryptoJS.enc.Utf8.parse(Password);

  const src = CryptoJS.enc.Utf8.parse(contentString);

  const encrypted = CryptoJS.AES.encrypt(src, key, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString();
};

export const DecodeKeystoreWithPwd = (password: string, keystore: string) => {
  const Password = padding(password);

  if (Password === null || Password === undefined || !Password) {
    return;
  }
  const key = CryptoJS.enc.Utf8.parse(Password);
  const iv = CryptoJS.enc.Utf8.parse(Password);

  const encryptedHexStr = CryptoJS.enc.Hex.parse(keystore);

  const encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);

  const decrypted = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const QueryAccountFromDid = async (did: string) => {
  const api = await getOrInit();
  const hex = didToHex(did);
  const data = await api.query.did.metadata(hex);

  if (!data.isEmpty) {
    const result = data.toHuman();
    return result;
  }

  return null;
};

export const QueryAccountFromMnemonic = async (mnemonic: string) => {
  const sp = instanceKeyring.createFromUri(mnemonic);

  return {
    userAddress: sp.address,
  };
};

export const Transfer = async (amount: string, keystore: string, toAddress: string, password: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong Password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  let to = toAddress;
  console.log(to)
  if (/^did:ad3:/.test(toAddress)) {
    to = didToHex(to);
    if (!to) {
      throw new Error('Wrong Did');
    }
  }
  const ex = window.apiWs.tx.magic.codo(window.apiWs.tx.balances.transfer(to, parseAmount(amount)));

  const payment = await ex.paymentInfo(payUser);

  const hash = await ex.signAndSend(payUser, errCb);

  return {
    hash,
    fee: payment.partialFee,
  };
};

export const TransferAsset = async (assetId: number, amount: string, keystore: string, toAddress: string, password: string) => {
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
  const ex = window.apiWs.tx.magic.codo(window.apiWs.tx.assets.transfer(assetId, to, parseAmount(amount)));

  const payment = await ex.paymentInfo(payUser);

  const hash = await ex.signAndSend(payUser, errCb);

  return {
    hash,
    fee: payment.partialFee,
  };
};

export const CreateAccount = async (mnemonic: string, password?: string) => {
  const sp = instanceKeyring.createFromUri(mnemonic);

  let keystore: any = '';
  if (password) {
    keystore = EncodeKeystoreWithPwd(password, mnemonic);
  }

  return {
    userAddress: sp.address,
    keystore,
  };
};

export const RestoreAccount = async (password: string, mnemonic: string) => {
  const sp = instanceKeyring.createFromUri(mnemonic);
  const keystore = EncodeKeystoreWithPwd(password, mnemonic);

  if (keystore === '') {
    return;
  }

  return {
    userAddress: sp.address,
    keystore,
  };
};

export const CreateDid = async (address: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    return;
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);
  const key = u8aToHex(decodeAddress(address));
  const extrinsic = window.apiWs.tx.magic.codo(window.apiWs.tx.did.register(null));
  payUser['Sr25519'] = key;

  return await subCallback(extrinsic, payUser);
};

export const QueryDid = async (address: any) => {
  const data = await window.apiWs.query.did.didOf(address);
  if (data.isEmpty) {
    return null;
  }

  return (data.toHuman() as any).toString();
};

export const GetUserBalance = async (address: string) => {
  const info: any = await window.apiWs.query.system.account(address);
  const data: AccountData = info.data;
  const total: any = data.free.add(data.reserved);

  return {
    freeBalance: data.free,
    reserved: data.reserved,
    totalBalance: total,
    nonce: info.nonce,
  };
};

export const CreateStableAccount = async (password: string, controllerKeystore: string, magicUserAddress: string, amount: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, controllerKeystore);
  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong Password');
  }

  const controllerAccount = instanceKeyring.createFromUri(decodedMnemonic);

  const ex = await window.apiWs.tx.magic.createStableAccount(magicUserAddress, parseAmount(amount));
  return await subCallback(ex, controllerAccount);
};

export const BatchChangeAndActiveController = async ({
  password,
  controllerKeystore,
  oldAccount,
  newAccount,
}: any) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, controllerKeystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    return;
  }

  const sender = instanceKeyring.createFromUri(decodedMnemonic);

  const ex = window.apiWs.tx.utility.batch([
    window.apiWs.tx.magic.changeController(newAccount),
    window.apiWs.tx.magic.activateController(oldAccount),
  ]);

  // Sign and send the transaction using our account
  const hash = await ex.signAndSend(sender, errCb);

  return {
    hash,
  };
};

export const ChangeController = async (password: string, magicKeystore: string, newControllerUserAddress: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, magicKeystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    return;
  }

  const sender = instanceKeyring.createFromUri(decodedMnemonic);
  // Create a extrinsic, transferring 12345 units to Bob
  const ex = await window.apiWs.tx.magic.changeController(newControllerUserAddress);

  return await subCallback(ex, sender);
};

export const QueryStableAccountByMagic = async (magicUserAddress: string) => {
  const oldControllerAddress = await window.apiWs.query.magic.controllerAccountOf(
    magicUserAddress,
  );

  return oldControllerAddress.toHuman();
};

export const GetStableAccount = async (controllerUserAddress: any) => {
  const accountsData: any = await window.apiWs.query.magic.stableAccountOf(controllerUserAddress);
  if (accountsData.toHuman() === null) {
    return null;
  }

  return {
    stashAccount: `${JSON.parse(accountsData).stashAccount}`,
    controllerAccount: `${JSON.parse(accountsData).controllerAccount}`,
    magicAccount: `${JSON.parse(accountsData).magicAccount}`,
  };
};

export const isSyncing = async () => {
  const response = await window.apiWs.rpc.system.health();

  if (response.isSyncing.valueOf()) {
    throw new Error('Node is syncing');
  }
};

export const setNickName = async (nickname: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  const name = await window.apiWs.tx.did.setNickname(nickname);
  const codo = await window.apiWs.tx.magic.codo(name);

  await subCallback(codo, payUser);
};

export const getTransFee = async (toAddress: string, myAddress: string, amount: string) => {
  const transfer = window.apiWs.tx.balances.transfer(toAddress, parseAmount(amount));
  const codo = window.apiWs.tx.magic.codo(transfer);

  const info = await transfer.paymentInfo(myAddress);
  const codoInfo = await codo.paymentInfo(myAddress);

  return codoInfo.partialFee.add(info.partialFee) as any;
};

export const getTokenTransFee = async (token: any, toAddress: string, myAddress: string, amount: string) => {
  const transfer = window.apiWs.tx.assets.transfer(token, toAddress, parseAmount(amount));
  const codo = window.apiWs.tx.magic.codo(transfer);

  const info = await transfer.paymentInfo(myAddress);
  const codoInfo = await codo.paymentInfo(myAddress);

  return codoInfo.partialFee.add(info.partialFee) as any;
};

export const BatchNicknameAndAvatar = async (nickname: string, avatarHash: string, password: string, keystore: string) => {
  const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

  if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
    throw new Error('Wrong password');
  }

  const payUser = instanceKeyring.createFromUri(decodedMnemonic);

  const name = await window.apiWs.tx.did.setNickname(nickname);
  const nameCodo = await window.apiWs.tx.magic.codo(name);

  const avatar = await window.apiWs.tx.did.setAvatar(avatarHash);
  const avatarCodo = await window.apiWs.tx.magic.codo(avatar);

  const batch = await window.apiWs.tx.utility.batch([
    nameCodo,
    avatarCodo,
  ]);

  await batch.signAndSend(payUser, errCb);
};