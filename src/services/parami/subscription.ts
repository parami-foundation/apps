import type { SubmittableExtrinsic } from "@polkadot/api/submittable/types";
import type { KeyringPair } from "@polkadot/keyring/types";
import { notification } from 'antd';
import type { InjectedExtension } from '@polkadot/extension-inject/types';

export const subCallback = (call: SubmittableExtrinsic<"promise", any>, payUser: KeyringPair) => {
    return new Promise(async (resolve, reject) => {
        await call.signAndSend(payUser, ({ events = [], status, dispatchError }: any) => {
            if (dispatchError) {
                if (dispatchError.isModule) {
                    // for module errors, we have the section indexed, lookup
                    const decoded = window.apiWs.registry.findMetaError(dispatchError.asModule);
                    const { docs, name, section } = decoded;

                    console.log(`${section}.${name}: ${docs.join(" ")}`);
                } else {
                    // Other, CannotLookup, BadOrigin, no extra info
                    console.log(dispatchError.toString());
                }
            }
            if (status.isReady) {
                notification.success({
                    key: 'ChainMessage',
                    message: 'Broadcast',
                });
            }
            if (status.isInBlock) {
                notification.success({
                    key: 'ChainMessage',
                    message: 'Included at block hash',
                    description: status.asInBlock.toHex(),
                });

                const map = {};
                events.forEach(({ event: { data, method, section } }) => {
                    if (section === 'magic' && method === 'Codo' && data[0].isError) {
                        notification.error({
                            message: 'Transaction failed',
                        });
                        const error = data[0].asError;
                        if (error.isModule) {
                            const decoded = window.apiWs.registry.findMetaError(error.asModule);
                            reject(`error.${decoded.section}.${decoded.method}`);
                            return;
                        } else {
                            // Other, CannotLookup, BadOrigin, no extra info
                            console.log(error);
                        }
                    }
                    if (!map[section]) map[section] = {}
                    if (!map[section][method]) map[section][method] = []
                    map[section][method].push(data.toHuman());
                });

                resolve(map);
            }
            if (status.isFinalized) {
                notification.success({
                    key: 'ChainMessage',
                    message: 'Finalized block hash',
                    description: status.asFinalized.toHex(),
                });
            }
        });
    })
};

export const subWeb3Callback = (call: SubmittableExtrinsic<"promise", any>, injector: InjectedExtension, account: any) => {
    return new Promise(async (resolve, reject) => {
        await call.signAndSend(identity.address, { signer: injector.signer }, ({ events = [], status, dispatchError }: any) => {
            if (dispatchError) {
                if (dispatchError.isModule) {
                    // for module errors, we have the section indexed, lookup
                    const decoded = window.apiWs.registry.findMetaError(dispatchError.asModule);
                    const { docs, name, section } = decoded;

                    console.log(`${section}.${name}: ${docs.join(" ")}`);
                } else {
                    // Other, CannotLookup, BadOrigin, no extra info
                    console.log(dispatchError.toString());
                }
            }
            if (status.isReady) {
                notification.success({
                    key: 'ChainMessage',
                    message: 'Broadcast',
                });
            }
            if (status.isInBlock) {
                notification.success({
                    key: 'ChainMessage',
                    message: 'Included at block hash',
                    description: status.asInBlock.toHex(),
                });

                const map = {};
                events.forEach(({ event: { data, method, section } }) => {
                    if (section === 'magic' && method === 'Codo' && data[0].isError) {
                        notification.error({
                            message: 'Transaction failed',
                        });
                        const error = data[0].asError;
                        if (error.isModule) {
                            const decoded = window.apiWs.registry.findMetaError(error.asModule);
                            reject(`error.${decoded.section}.${decoded.method}`);
                            return;
                        } else {
                            // Other, CannotLookup, BadOrigin, no extra info
                            console.log(error);
                        }
                    }
                    if (!map[section]) map[section] = {}
                    if (!map[section][method]) map[section][method] = []
                    map[section][method].push(data.toHuman());
                });

                resolve(map);
            }
            if (status.isFinalized) {
                notification.success({
                    key: 'ChainMessage',
                    message: 'Finalized block hash',
                    description: status.asFinalized.toHex(),
                });
            }
        });
    })
};
