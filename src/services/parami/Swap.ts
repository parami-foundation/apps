import { deleteComma } from '@/utils/format';
import { Keyring } from '@polkadot/api';
import { DecodeKeystoreWithPwd } from './Crypto';
import { subCallback } from './Subscription';

const instanceKeyring = new Keyring({ type: 'sr25519' });

// AD3 To Token(Token)
export const BuyToken = async (tokenId: string, tokens: string, maxCurrency: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
	const ddl = await window.apiWs.query.system.number();
	const ex = window.apiWs.tx.swap.buyTokens(tokenId, tokens, maxCurrency, ddl.toNumber() + 5);

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

// Token to AD3(Token)
export const SellToken = async (tokenId: string, tokens: string, minCurrency: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
	const ddl = await window.apiWs.query.system.number();
	const ex = window.apiWs.tx.swap.sellTokens(tokenId, tokens, minCurrency, ddl.toNumber() + 5);

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

// Token to AD3(AD3)
export const BuyCurrency = async (tokenId: string, currency: string, maxTokens: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
	const ddl = await window.apiWs.query.system.number();
	const ex = window.apiWs.tx.swap.buyCurrency(tokenId, currency, maxTokens, ddl.toNumber() + 5);

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

// AD3 To Token(AD3)
export const SellCurrency = async (tokenId: string, currency: string, minTokens: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
	const ddl = await window.apiWs.query.system.number();
	const ex = window.apiWs.tx.swap.sellCurrency(tokenId, currency, minTokens, ddl.toNumber() + 5);

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

export const AddLiquidity = async (assetId: string, amount: string, LP: string, token: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
	const ddl = await window.apiWs.query.system.number();
	const ex = window.apiWs.tx.swap.addLiquidity(assetId, amount, LP, token, ddl.toNumber() + 5);

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

export const RemoveLiquidity = async (lpTokenId: string, minCurrency: string, minTokens: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
	const ddl = await window.apiWs.query.system.number();
	const ex = window.apiWs.tx.swap.removeLiquidity(lpTokenId, minCurrency, minTokens, ddl.toNumber() + 5);

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

export const GetAccountLPTokenIds = async (account: string) => {
	const LPs = await window.apiWs.query.swap.account.entries(account);
	return LPs.map(LP => {
		const tokenInfo = LP[0].toHuman() as string[];
		return deleteComma(tokenInfo[1]);
	});
};

export const GetLPLiquidity = async (LPTokenId: string) => {
	const LPInfo = await window.apiWs.query.swap.liquidity(LPTokenId);
	return LPInfo.toHuman();
};

export const ClaimLPReward = async (LPTokenId: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
	const ex = window.apiWs.tx.swap.acquireReward(LPTokenId);

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
