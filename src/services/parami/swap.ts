import { Keyring } from '@polkadot/api';
import { DecodeKeystoreWithPwd, errCb } from './wallet';

const instanceKeyring = new Keyring({ type: 'sr25519' });

export const AddLiquidity = async (assetId: string, amount: string, LP: string, token: string, password: string, keystore: string) => {
	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}
	const payUser = instanceKeyring.createFromUri(decodedMnemonic);
	const ddl = await window.apiWs.query.system.number();
	const addLiquidity = window.apiWs.tx.swap.addLiquidity(assetId, amount, LP, token, ddl.toNumber() + 5);
	const codo = window.apiWs.tx.magic.codo(addLiquidity);
	await codo.signAndSend(payUser, errCb);
};

export const RemoveLiquidity = async (assetId: string, amount: string, LP: string, token: string, password: string, keystore: string) => {
	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);
	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}
	const payUser = instanceKeyring.createFromUri(decodedMnemonic);
	const ddl = await window.apiWs.query.system.number();
	const removeLiquidity = window.apiWs.tx.swap.removeLiquidity(assetId, amount, LP, token, ddl.toNumber() + 5);
	const codo = window.apiWs.tx.magic.codo(removeLiquidity);
	await codo.signAndSend(payUser, errCb);
};

export const DrylyAddLiquidity = async (assetId: string, amount: string) => {
	const value = await (window.apiWs.rpc as any).swap.drylyAddLiquidity(assetId, amount, '0');
	return value.toHuman();
};

export const DrylyRemoveLiquidity = async (assetId: string, amount: string): Promise<string> => {
	const tokenId = 4294967295 - Number(assetId);
	const value = await (window.apiWs.rpc as any).swap.drylyRemoveLiquidity(tokenId, amount);
	return value.toHuman();
};