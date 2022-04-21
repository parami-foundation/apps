import config from '@/config/config';
import Keyring from "@polkadot/keyring";
import { extend } from 'umi-request';
import { DecodeKeystoreWithPwd } from './Crypto';
import { subCallback } from './Subscription';

const errorHandler = (error: any) => {
	const { response = {}, message = '', data = {} } = error;
	if (message === 'http error') {
		return {
			response,
			data
		} as API.Resp;
	}
}
const request = extend({
	errorHandler,
	credentials: 'omit',
});

const instanceKeyring = new Keyring({ type: 'sr25519' });

/** Update an image to IPFS POST */
export async function uploadIPFS(body: any, options?: { [key: string]: any }) {
	const formData = new FormData();
	formData.append('file', body);

	return request(config.ipfs.upload, {
		method: 'POST',
		body: formData,
		requestType: 'form',
		getResponse: true,
		...(options || {}),
	});
};

export const uploadAvatar = async (hash: string, password: string, keystore: string) => {
	const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

	if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
		throw new Error('Wrong password');
	}

	const payUser = instanceKeyring.createFromUri(decodedMnemonic);
	const tx = window.apiWs.tx.did.setMetadata('pic', hash);

	return await subCallback(tx, payUser);
};