import { web3FromSource } from "@polkadot/extension-dapp";
import { subWeb3Callback } from "./Subscription";

export const ExistTag = async (tag: string): Promise<any> => {
  const res = await window.apiWs.query.tag.metadata(tag);
  return res
};

export const GetTagsOf = async (ad: Uint8Array): Promise<any> => {
  const res = await window.apiWs.query.tag.tagsOf.entries(ad);
  return res.length
};

export const CreateTag = async (tag: string, account: any): Promise<any> => {
  const injector = await web3FromSource(account.meta.source);
  const tx = window.apiWs.tx.tag.create(tag);

  return await subWeb3Callback(tx, injector, account);
};
