import config from '@/config/config';
import Keyring from "@polkadot/keyring";
import { DecodeKeystoreWithPwd, errCb } from "./wallet";
import { extend } from 'umi-request';

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
        ...(options || {}),
    });
};

export const uploadAvatar = async (hash: string, password: string, keystore: string) => {
    const decodedMnemonic = DecodeKeystoreWithPwd(password, keystore);

    if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
        throw new Error('Wrong password');
    }

    const payUser = instanceKeyring.createFromUri(decodedMnemonic);
    const avatar = window.apiWs.tx.did.setMetadata('pic', hash);
    const codo = window.apiWs.tx.magic.codo(avatar);
    await codo.signAndSend(payUser, errCb);
};