import type { SubmittableExtrinsic } from "@polkadot/api/submittable/types";
import type { KeyringPair } from "@polkadot/keyring/types";
import { notification } from 'antd';
import type { InjectedExtension } from '@polkadot/extension-inject/types';

export const subCallback = (cb: SubmittableExtrinsic<"promise", any>, payUser: KeyringPair) => {
	return new Promise(async (resolve, reject) => {
		try {
			await cb.signAndSend(payUser, ({ events = [], status, dispatchError }: any) => {
				if (dispatchError) {
					if (dispatchError.isModule) {
						try {
							// for module errors, we have the section indexed, lookup
							const decoded = window.apiWs.registry.findMetaError(dispatchError.asModule);
							const { docs, name, section } = decoded;

							console.log(`${section}.${name}: ${docs.join(" ")}`);
						} catch (e) {
							console.error(e);
							reject(e);
						}
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

					const map = {
						blockHash: status.asInBlock.toHex()
					};
					events.forEach(({ event: { data, method, section } }) => {
						if (section === 'system' && method === 'ExtrinsicFailed') {
							notification.error({
								message: 'Transaction failed',
							});
							if (data[0]?.isModule) {
								const decoded = window.apiWs.registry.findMetaError(data[0]?.asModule);
								reject(`error.${decoded.section}.${decoded.method}`);
								return;
							} else {
								// Other, CannotLookup, BadOrigin, no extra info
								console.log(data[0].toString());
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
		} catch (e: any) {
			reject(e);
		}
	})
};

export const subWeb3Callback = (cb: SubmittableExtrinsic<"promise", any>, injector: InjectedExtension, account: any) => {
	return new Promise(async (resolve, reject) => {
		await cb.signAndSend(account.address, { signer: injector.signer }, ({ events = [], status, dispatchError }: any) => {
			if (dispatchError) {
				if (dispatchError.isModule) {
					// for module errors, we have the section indexed, lookup
					try {
						const decoded = window.apiWs.registry.findMetaError(dispatchError.asModule);
						const { docs, name, section } = decoded;

						console.log(`${section}.${name}: ${docs.join(" ")}`);
					} catch (e) {
						console.error(e);
					}

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

				const map = {
					blockHash: status.asInBlock.toHex()
				};
				events.forEach(({ event: { data, method, section } }) => {
					if (section === 'system' && method === 'ExtrinsicFailed') {
						notification.error({
							message: 'Transaction failed',
						});
						if (data[0]?.isModule) {
							try {
								const decoded = window.apiWs.registry.findMetaError(data[0]?.asModule);
								reject(`error.${decoded.section}.${decoded.method}`);
							} catch (e) {
								console.error(e)
							}
							return;
						} else {
							// Other, CannotLookup, BadOrigin, no extra info
							console.log(data[0].toString());
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
