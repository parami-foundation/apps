// @ts-ignore
/* eslint-disable */
import config from '@/config/config';
import Keyring from "@polkadot/keyring";
import { DecodeKeystoreWithPwd, errCb } from "./wallet";

const instanceKeyring = new Keyring({ type: 'sr25519' });

/** Update an image to IPFS POST */
export async function uploadIPFS(body: any, options?: { [key: string]: any }) {
    const formData = new FormData();
    formData.append('file', body);

    const res = await fetch(config.ipfs.upload, {
        method: 'POST',
        body: formData,
        ...(options || {}),
    });

    return await res.json();
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