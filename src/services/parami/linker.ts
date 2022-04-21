import { Keyring } from '@polkadot/api';
import { DecodeKeystoreWithPwd } from './Crypto';
import { subCallback } from './Subscription';

const instanceKeyring = new Keyring({ type: 'sr25519' });

export const LinkSociality = async (did: string, type: string, profile: string, password: string, keystore: string) => {
	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}

	const payUser = instanceKeyring.createFromUri(decodedMnemonic);
	const tx = window.apiWs.tx.linker.linkSociality(type, profile);
	return await subCallback(tx, payUser);
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