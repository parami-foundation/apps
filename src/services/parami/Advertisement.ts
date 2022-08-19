import { deleteComma, BigIntToFloatString } from "@/utils/format";
import { web3FromSource } from "@polkadot/extension-dapp";
import { subWeb3Callback } from "./Subscription";

export const GetAdsListOf = async (did: Uint8Array): Promise<any> => {
  const res = await window.apiWs.query.ad.adsOf(did);
  const adList = res.toHuman() as any;
  const data: any[] = [];
  for (const adItem in adList) {
    const metadata = await window.apiWs.query.ad.metadata(adList[adItem]);
    data.push({
      id: adList[adItem],
      meta: metadata.toHuman(),
    });
  }
  return data;
};

export const GetSlotOfNft = async (nftId: string) => {
  const slot = await window.apiWs.query.ad.slotOf(nftId);
  if (slot.isEmpty) {
    return null;
  }
  const res = slot.toHuman() as any;
  return res;
}

export const GetSlotAdOf = async (nftId: string): Promise<any> => {
  const slot = await window.apiWs.query.ad.slotOf(nftId);
  if (slot.isEmpty) {
    return null;
  }
  const res = slot.toHuman() as any;
  const ad = await window.apiWs.query.ad.metadata(res.adId);
  if (ad.isEmpty) {
    return null;
  }
  res.ad = ad.toHuman();
  return res;
};

export const GetSlotsOf = async (adID: string): Promise<any> => {
  const res = await window.apiWs.query.ad.slotsOf(adID);
  return res;
};

export const GetSlotAdOfByAssetID = async (assetID: string): Promise<any> => {
  const slot = await window.apiWs.query.ad.slotOf(assetID);
  if (slot.isEmpty) {
    return null;
  }
  const res = slot.toHuman();
  return res;
};

export const CreateAds = async (tags: any[], metadata: string, rewardRate: string, lifetime: number, payoutBase: string, payoutMin: string, payoutMax: string, account: any, delegateAccount: string) => {
  const currentBlockNum = await window.apiWs.query.system.number();
  const injector = await web3FromSource(account.meta.source);
  const tx = window.apiWs.tx.ad.create(tags, metadata, rewardRate, lifetime + Number(currentBlockNum), payoutBase, payoutMin, payoutMax, delegateAccount);

  return await subWeb3Callback(tx, injector, account);
};

export const BidSlot = async (adId: string, nftID: string, amount: string, tokenSelect, tokenAmount, account: any) => { // todo: type this
  console.log(account)
  const injector = await web3FromSource(account.meta.source);
  const tx = window.apiWs.tx.ad.bidWithFraction(adId, nftID, amount, tokenSelect, tokenAmount);

  return await subWeb3Callback(tx, injector, account);
};

export const GetEndtimeOf = async (adId: string) => {
  const res = await window.apiWs.query.ad.endtimeOf(adId);

  return res;
};

export const BecomeAdvertiser = async (deposit: string, account: any) => {
  const injector = await web3FromSource(account.meta.source);
  const tx = window.apiWs.tx.advertiser.deposit(deposit);

  return await subWeb3Callback(tx, injector, account);
};

export const IsAdvertiser = async (account: string): Promise<boolean> => {
  const res = await window.apiWs.query.balances.reserves(account);
  const reserves: any = res.toHuman();
  for (const key in reserves) {
    if (reserves[key].id === 'prm/ader' && Number(BigIntToFloatString(deleteComma(reserves[key].amount), 18)) >= 1000) {
      return true;
    }
  }
  return false;
};
