import { Keyring } from '@polkadot/api';
import { DecodeKeystoreWithPwd } from './Crypto';
import { subCallback } from './Subscription';

const instanceKeyring = new Keyring({ type: 'sr25519' });

export const BuyToken = async (assetId: string, amount: string, maxCurrency: string, password: string, keystore: string) => {
	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}

	const payUser = instanceKeyring.createFromUri(decodedMnemonic);
	const ddl = await window.apiWs.query.system.number();
	const tx = window.apiWs.tx.swap.buyTokens(assetId, amount, maxCurrency, ddl.toNumber() + 5);

	return await subCallback(tx, payUser);
};

export const SellToken = async (assetId: string, amount: string, maxCurrency: string, password: string, keystore: string) => {
	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}

	const payUser = instanceKeyring.createFromUri(decodedMnemonic);
	const ddl = await window.apiWs.query.system.number();
	const tx = window.apiWs.tx.swap.sellTokens(assetId, amount, maxCurrency, ddl.toNumber() + 5);

	return await subCallback(tx, payUser);
};

export const AddLiquidity = async (assetId: string, amount: string, LP: string, token: string, password: string, keystore: string) => {
	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}
	const payUser = instanceKeyring.createFromUri(decodedMnemonic);
	const ddl = await window.apiWs.query.system.number();
	const tx = window.apiWs.tx.swap.addLiquidity(assetId, amount, LP, token, ddl.toNumber() + 5);

	return await subCallback(tx, payUser);
};

export const RemoveLiquidity = async (lpTokenId: string, minCurrency: string, minTokens: string, password: string, keystore: string) => {
	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);
	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}
	const payUser = instanceKeyring.createFromUri(decodedMnemonic);
	const ddl = await window.apiWs.query.system.number();
	const tx = window.apiWs.tx.swap.removeLiquidity(lpTokenId, minCurrency, minTokens, ddl.toNumber() + 5);

	return await subCallback(tx, payUser);
};

export const GetAccountLPs = async (account: string) => {
	const LPs = await window.apiWs.query.swap.account.entries(account);
	return LPs;
};

export const GetLPLiquidity = async (LPTokenId: string) => {
	const LPInfo = await window.apiWs.query.swap.liquidity(LPTokenId);
	return LPInfo.toHuman();
};

export const ClaimLPReward = async (LPTokenId: string, password: string, keystore: string) => {
	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);
	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}
	const payUser = instanceKeyring.createFromUri(decodedMnemonic);
	const tx = window.apiWs.tx.swap.acquireReward(LPTokenId);

	return await subCallback(tx, payUser);
};
