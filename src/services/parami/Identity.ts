import { didToHex } from "@/utils/common";
import { UserLogout } from "@/utils/user.util";
import Keyring from "@polkadot/keyring";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import { notification } from "antd";
import { DecodeKeystoreWithPwd, EncodeKeystoreWithPwd } from "./Crypto";
import { subCallback } from "./Subscription";

const instanceKeyring = new Keyring({ type: 'sr25519' });

export const CreateMnemonic = async () => {
	const newMnemonic = await mnemonicGenerate(12);
	return {
		mnemonic: newMnemonic,
	}
}

export const CreateKeystore = async (mnemonic: string, password: string) => {
	let keystore: any = '';
	keystore = EncodeKeystoreWithPwd(password, mnemonic);

	return {
		keystore,
	};
};

export const CreateAccount = async (mnemonic: string) => {
	const sp = instanceKeyring.createFromUri(mnemonic);

	return {
		address: sp.address,
	}
};

export const QueryDID = async (address: any) => {
	const data = await window.apiWs.query.did.didOf(address);
	if (data.isEmpty) {
		return null;
	}

	return (data.toHuman() as any).toString();
};

export const RegisterDID = async (passphrase: string, keystore: string, preTx?: boolean, account?: string) => {
	const ex = await window.apiWs.tx.did.register(null);

	if (preTx && account) {
		const info = await ex.paymentInfo(account);
		return info;
	}

	const decodedMnemonic = DecodeKeystoreWithPwd(passphrase, keystore);

	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		return;
	}

	const payUser = instanceKeyring.createFromUri(decodedMnemonic);

	return await subCallback(ex, payUser);
};

export const BatchNicknameAndAvatar = async (nickname: string, avatarHash: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
	const name = await window.apiWs.tx.did.setMetadata('name', nickname);
	const avatar = await window.apiWs.tx.did.setMetadata('pic', avatarHash);

	const batch = await window.apiWs.tx.utility.batch([
		name,
		avatar,
	]);

	if (preTx && account) {
		const info = await batch.paymentInfo(account);
		return info;
	}

	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}

	const payUser = instanceKeyring.createFromUri(decodedMnemonic);

	return await subCallback(batch, payUser);
};

export const QueryAccountFromMnemonic = async (mnemonic: string) => {
	const sp = instanceKeyring.createFromUri(mnemonic);

	return {
		address: sp.address,
	};
};

export const GetExistentialDeposit = async () => {
	const existentialDeposit = await window.apiWs.consts.balances.existentialDeposit;
	return existentialDeposit.toString();
};

export const QueryAccountExist = async (account: string) => {
	const existDID = await window.apiWs.query.did.didOf(account);
	if (existDID.isEmpty) {
		notification.error({
			key: 'accessDenied',
			message: 'Access Denied',
			description: 'The account does not exist. Logging out...',
		});
		setTimeout(() => {
			UserLogout();
		}, 500);
		return false;
	}
	return true;
};

export const QueryAccountFromDid = async (did: string) => {
	const hex = didToHex(did);
	const data = await window.apiWs.query.did.metadata(hex);

	if (!data.isEmpty) {
		const result = data.toHuman() as any;
		const [avatar, nickname] = await (window.apiWs.rpc as any).did.batchGetMetadata(did, ['pic', 'name']);
		return { ...result, avatar, nickname };
	}

	return null;
};

export const SetNickName = async (nickname: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
	const ex = window.apiWs.tx.did.setMetadata('name', nickname);

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
