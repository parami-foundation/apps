import { checkFeeAndSubmitExtrinsic } from "@/utils/chain.util";
import { deleteComma } from "@/utils/format";
import { fetchMetadata } from "@/utils/ipfs.util";
import { GetBalanceOfBudgetPot } from "./Assets";
import { GetTagsOfClockIn } from "./Tag";

export const QueryClockInMetadata = async (nftId: string) => {
  const res = await window.apiWs.query.clockIn.metadata(nftId);

  if (res.isEmpty) {
    return null;
  }

  const clockIn = res.toHuman() as any;
  return {
    ...clockIn,
    assetId: deleteComma(clockIn.assetId),
    payoutBase: deleteComma(clockIn.payoutBase),
    payoutMin: deleteComma(clockIn.payoutMin),
    payoutMax: deleteComma(clockIn.payoutMax)
  }
}

export const QueryClockIn = async (nftId: string) => {
  const clockInMeta = await QueryClockInMetadata(nftId);

  if (!clockInMeta) {
    return {}
  }

  const clockInContent = await fetchMetadata(clockInMeta.metadata);
  const potBudget = await GetBalanceOfBudgetPot(clockInMeta.pot, clockInMeta.assetId) as any;

  const tags = await GetTagsOfClockIn(nftId);
  
  return {
    nftId: clockInMeta.assetId,
    payoutBase: clockInMeta.payoutBase,
    payoutMin: clockInMeta.payoutMin,
    payoutMax: clockInMeta.payoutMax,
    tags: tags.map(t => t.name),
    remainingBudget: deleteComma(potBudget?.balance),
    ...clockInContent,
  }
}

export const EnableClockIn = async (clockIn, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.clockIn.enableClockIn(clockIn.nftId, clockIn.payoutBase, clockIn.payoutMin, clockIn.payoutMax, clockIn.metadata, clockIn.tags, clockIn.tokenAmount);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const DisableClockIn = async (nftId: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.clockIn.disableClockIn(nftId);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const UpdateClockIn = async (clockIn, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.clockIn.updateClockIn(clockIn.nftId, clockIn.payoutBase, clockIn.payoutMin, clockIn.payoutMax, clockIn.metadata, clockIn.tags);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const AddTokenReward = async (nftId: string, tokenAmount: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.clockIn.addTokenReward(nftId, tokenAmount);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const UserClockIn = async (
  nftId: string,
  password: string,
  keystore: string,
  preTx?: boolean,
  account?: string
) => {
  let ex = window.apiWs.tx.clockIn.clockIn(nftId);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}