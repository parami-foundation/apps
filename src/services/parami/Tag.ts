import { deleteComma } from "@/utils/format";
import { web3FromSource } from "@polkadot/extension-dapp";
import { subWeb3Callback } from "./Subscription";

export const ExistTag = async (tag: string): Promise<any> => {
  const res = await window.apiWs.query.tag.metadata(tag);
  return res
};

export const GetAllTags = async () => {
  const entriesResult = await window.apiWs.query.tag.metadata.entries();

  return (entriesResult ?? []).map(entry => {
    const [key, value] = entry;
    const tagValues = value.toHuman() as any;
    return {
      key: (key.toHuman() as string[])[0],
      ...tagValues,
      created: deleteComma(tagValues.created)
    } as {
      key: string;
      creator: string;
      created: string;
      tag: string;
    }
  }).filter(tag => tag.tag !== 'unknown');
}

export const GetTagsOfAd = async (adId: string) => {
  const entries: any = await window.apiWs.query.tag.tagsOf.entries(adId);

  if (!entries?.length) {
    return [];
  }

  const allTags = await GetAllTags();

  return entries.map(entry => {
    const [key, _] = entry;
    const tagHash = key.toHuman()[1];
    const tag = allTags.find(t => t.key === tagHash);
    const tagName = tag?.tag;
    return {
      hash: tagHash,
      name: tagName
    }
  }).filter(tag => !!tag.name);
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
