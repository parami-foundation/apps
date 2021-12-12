import { web3FromSource } from '@polkadot/extension-dapp';
import { errCb } from './wallet';

export const BecomeAdvertiser = async (deposit: string, account: any) => {
    const injector = await web3FromSource(account.meta.source);
    const tx = window.apiWs.tx.advertiser.deposit(deposit);
    const ex = window.apiWs.tx.magic.codo(tx);

    const hash = await ex.signAndSend(account.address, { signer: injector.signer }, errCb);
    return hash
};

export const IsAdvertiser = async (stashAccount: string): Promise<boolean> => {
    const res = await window.apiWs.query.balances.reserves(stashAccount);
    const reserves = res.toHuman() as any;
    for (let i = 0; i < reserves.length; i++) {
        if (reserves[i].id.indexOf('prm/ader') > -1) {
            return true;
        }
    }
    return false;
};

export const GetAdsListOf = async (did: Uint8Array): Promise<any> => {
    const res = await window.apiWs.query.ad.adsOf(did);
    const adList = res.toHuman() as any;
    const data: any[] = [];
    for (const adItem in adList) {
        const metadata = await window.apiWs.query.ad.metadata(adList[adItem]);
        data.push({
            id: adList[adItem],
            meta: metadata.toHuman()
        });
    }
    return data;
};

export const GetTagsOf = async (ad: Uint8Array): Promise<any> => {
    const res = await window.apiWs.query.tag.tagsOf.entries(ad);
    return res.length
};

export const CreateAds = async (budget: string, tags: any[], metadata: string, rewardRate: string, lifetime: number, account: any) => {
    const ddl = await window.apiWs.query.system.number();
    const injector = await web3FromSource(account.meta.source);
    const tx = window.apiWs.tx.ad.create(budget, tags, metadata, rewardRate, lifetime + Number(ddl));
    const ex = window.apiWs.tx.magic.codo(tx);

    const hash = await ex.signAndSend(account.address, { signer: injector.signer }, errCb);
    return hash
};

export const CreateTag = async (tag: string, account: any): Promise<any> => {
    const injector = await web3FromSource(account.meta.source);
    const tx = window.apiWs.tx.tag.create(tag);
    const ex = window.apiWs.tx.magic.codo(tx);

    const hash = await ex.signAndSend(account.address, { signer: injector.signer }, errCb);
    return hash
};

export const ExistTag = async (tag: string): Promise<any> => {
    const res = await window.apiWs.query.tag.metadata(tag);
    return res
};

export const BidSlot = async (adId: string, kolDid: string, amount: string, account: any) => {
    const injector = await web3FromSource(account.meta.source);
    const tx = window.apiWs.tx.ad.bid(adId, kolDid, amount);
    const ex = window.apiWs.tx.magic.codo(tx);

    const hash = await ex.signAndSend(account.address, { signer: injector.signer }, errCb);
    return hash
};

export const GetAssetInfo = async (assetId: string) => {
    const assetInfo = await window.apiWs.query.assets.metadata(Number(assetId));
    return assetInfo;
};

export const GetSlotAdOf = async (did: string): Promise<any> => {
    const slot = await window.apiWs.query.ad.slotOf(did);
    if (slot.isEmpty) {
        return null;
    }
    const res = slot.toHuman();
    return res;
};

export const GetSlotsOf = async (adID: string): Promise<any> => {
    const res = await window.apiWs.query.ad.slotsOf(adID);
    return res;
};

export const GetValueOf = async (assetId: string, amount: bigint) => {
    const value = await (window.apiWs.rpc as any).swap.drylySellTokens(assetId, amount.toString());
    return value.toHuman();
};