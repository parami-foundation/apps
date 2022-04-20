import { Keyring } from '@polkadot/api';
import { DecodeKeystoreWithPwd } from './crypto';
import { subCallback } from './subscription';

const instanceKeyring = new Keyring({ type: 'sr25519' });

/// @type= one of {Discord,Twitter,Reddit,Facebook,Telegram,Twitter,Reddit,Facebook}
export const GetLinkedInfo = async (did: string, type: string) => {
	const linked = await window.apiWs.query.linker.linksOf(did, type);
	if (linked.isEmpty) {
		const pending = await window.apiWs.query.linker.pendingOf(type, did);
		if (pending.isEmpty) {
			return null;
		} else {
			return 'verifing'
		}
	} else {
		return 'linked'
	}
};

export const LinkSociality = async (did: string, type: string, profile: string, password: string, keystore: string) => {
	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}

	const payUser = instanceKeyring.createFromUri(decodedMnemonic);
	const tx = window.apiWs.tx.linker.linkSociality(type, profile);
	const res = await subCallback(tx, payUser);
	return res;
};

export const LinkBlockChain = async (type: string, address: string, signature: string, password: string, keystore: string) => {
	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}

	const payUser = instanceKeyring.createFromUri(decodedMnemonic);
	const tx = window.apiWs.tx.linker.linkCrypto(type, address, signature);
	return await subCallback(tx, payUser);
};