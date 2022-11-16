import { DecodeKeystoreWithPwd } from "@/services/parami/Crypto";
import { subCallback } from "@/services/parami/Subscription";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import Keyring from "@polkadot/keyring";

const instanceKeyring = new Keyring({ type: 'sr25519' });

export const isMainnetOrRinkeby = (chainId?: number): chainId is 1 | 4 => chainId === 1 || chainId === 4;

export const checkFeeAndSubmitExtrinsic = async (ex: SubmittableExtrinsic<"promise", any>, password: string, keystore: string, preTx?: boolean, account?: string) => {
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
}
