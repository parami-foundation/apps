import { parseAmount } from "@/utils/common";
import Keyring from "@polkadot/keyring";
import { u8aToHex } from "@polkadot/util";
import { decodeAddress, mnemonicGenerate } from "@polkadot/util-crypto";
import { DecodeKeystoreWithPwd, EncodeKeystoreWithPwd } from "./Crypto";
import { subCallback } from "./subscription";

const instanceKeyring = new Keyring({ type: 'sr25519' });

export const CreateMnemonic = async () => {
    const newMnemonic = await mnemonicGenerate(12);
    return {
        mnemonic: newMnemonic,
    }
}

export const CreateAccountKeystore = async (mnemonic: string, password: string) => {
    let keystore: any = '';
    keystore = EncodeKeystoreWithPwd(password, mnemonic);

    return {
        keystore,
    };
};

export const CreateAccountAddress = async (mnemonic: string) => {
    const sp = instanceKeyring.createFromUri(mnemonic);

    return {
        address: sp.address,
    }
};

export const BatchNicknameAndAvatar = async (nickname: string, avatarHash: string, password: string, keystore: string) => {
    const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

    if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
        throw new Error('Wrong password');
    }

    const payUser = instanceKeyring.createFromUri(decodedMnemonic);

    const name = await window.apiWs.tx.did.setMetadata('name', nickname);
    const nameCodo = await window.apiWs.tx.magic.codo(name);
    const avatar = await window.apiWs.tx.did.setMetadata('pic', avatarHash);
    const avatarCodo = await window.apiWs.tx.magic.codo(avatar);

    const batch = await window.apiWs.tx.utility.batch([
        nameCodo,
        avatarCodo,
    ]);

    const events = await subCallback(batch, payUser);
    return events;
};

export const QueryDid = async (address: any) => {
    const data = await window.apiWs.query.did.didOf(address);
    if (data.isEmpty) {
        return null;
    }

    return (data.toHuman() as any).toString();
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

export const GetStableAccount = async (controllerUserAddress: any) => {
    const accountsData: any = await window.apiWs.query.magic.metadata(controllerUserAddress);
    if (accountsData.toHuman() === null) {
        return null;
    }

    return {
        stashAccount: `${JSON.parse(accountsData).stashAccount}`,
        controllerAccount: `${JSON.parse(accountsData).controllerAccount}`,
        magicAccount: `${JSON.parse(accountsData).magicAccount}`,
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

export const GetExistentialDeposit = async () => {
    const existentialDeposit = await window.apiWs.consts.balances.existentialDeposit;
    return existentialDeposit.toString();
};

export const GetRecoveryFee = async (magicUserAddress: string, newControllerUserAddress: string) => {
    const ex = await window.apiWs.tx.magic.changeController(newControllerUserAddress);
    const info = await ex.paymentInfo(magicUserAddress);
    return info.partialFee.toString();
};

export const QueryAccountFromMnemonic = async (mnemonic: string) => {
    const sp = instanceKeyring.createFromUri(mnemonic);

    return {
        address: sp.address,
    };
};

export const QueryStableAccountByMagic = async (magicUserAddress: string) => {
    const oldControllerUserAddress = await window.apiWs.query.magic.controller(
        magicUserAddress,
    );

    return oldControllerUserAddress.toHuman();
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

export const ChangeController = async (password: string, magicKeystore: string, newControllerUserAddress: string) => {
    const decodedMnemonic = DecodeKeystoreWithPwd(password, magicKeystore);

    if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
        throw new Error('Wrong Password');
    }

    const sender = instanceKeyring.createFromUri(decodedMnemonic);
    // Create a extrinsic, transferring 12345 units to Bob
    const ex = await window.apiWs.tx.magic.changeController(newControllerUserAddress);

    return await subCallback(ex, sender);
};