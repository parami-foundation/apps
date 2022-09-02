import { web3FromSource } from "@polkadot/extension-dapp";
import { GetTagsMap } from "./HTTP";
import { subWeb3Callback } from "./Subscription";

export const ExistTag = async (tag: string): Promise<any> => {
  const res = await window.apiWs.query.tag.metadata(tag);
  return res
};

export const GetTagsOfAd = async (adId: string) => {
  const entries: any = await window.apiWs.query.tag.tagsOf.entries(adId);

  if (!entries?.length) {
    return [];
  }

  const {resp, data}: any = await GetTagsMap();

  if (!resp) {
    console.error('Get Tags Map Error');
  }

  const tagMap = data ?? {};

  return entries.map(entry => {
    const [key, _] = entry;
    const adHash = key.toHuman()[1];
    const tag = tagMap[adHash];
    const tagName = tag?.label ?? 'Unknown';
    return {
      hash: adHash,
      name: tagName
    }
  });
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
