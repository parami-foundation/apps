import { checkFeeAndSubmitExtrinsic } from "@/utils/chain.util";
import { parseAmount } from "@/utils/common";
import { deleteComma } from "@/utils/format";
import { fetchMetadata } from "@/utils/ipfs.util";
import { GetBalanceOfBudgetPot } from "./Assets";
import { GetTagsOfClockIn } from "./Tag";

export interface ClockInData {
  nftId: string;
  levelProbability: number[];
  levelUpperBounds: string[];
  sharesPerBucket: number;
  awardPerShare: string;
  totalRewardToken?: string;
}

export interface ClockInVO extends ClockInData {
  remainingBudget: string;
}

export interface UserLotteryStatus {
  enabled: boolean;
  claimable: boolean;
  rewardAmount: string;
}

export const QueryLotteryMetadata = async (nftId: string) => {
  const res = await window.apiWs.query.clockIn.lotteryMetadataStore(nftId);

  if (res.isEmpty) {
    return null;
  }

  const lottery = res.toHuman() as any;

  return {
    nftId: deleteComma(lottery.assetId),
    awardPerShare: deleteComma(lottery.awardPerShare),
    levelProbability: lottery.levelProbability,
    levelUpperBounds: (lottery.levelUpperBounds ?? []).map(upperBound => deleteComma(upperBound)),
    pot: lottery.pot,
    sharesPerBucket: parseInt(lottery.sharesPerBucket, 10)
  }
}

export const QueryLottery = async (nftId: string) => {
  const metadata = await QueryLotteryMetadata(nftId);

  if (!metadata) {
    return null;
  }

  const potBudget = await GetBalanceOfBudgetPot(metadata.pot, metadata.nftId) as any;

  return {
    ...metadata,
    remainingBudget: deleteComma(potBudget?.balance)
  }
}

export const QueryUserLotteryStatus = async (nftId: string, did: string) => {
  const clockInRes = await window.apiWs.call.clockInRuntimeApi.getClockInInfo(nftId, did) as any;
  const [_, enabled, claimable, amount] = clockInRes.toHuman();
  
  return {
    enabled,
    claimable,
    rewardAmount: deleteComma(amount)
  }
}

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

export const EnableClockIn = async (clockIn: ClockInData, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.clockIn.enableClockIn(clockIn.nftId, clockIn.levelProbability, clockIn.levelUpperBounds, clockIn.sharesPerBucket, clockIn.awardPerShare, clockIn.totalRewardToken);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const DisableClockIn = async (nftId: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.clockIn.disableClockIn(nftId);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const UpdateClockIn = async (clockIn: ClockInData, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.clockIn.updateClockIn(clockIn.nftId, clockIn.levelProbability, clockIn.levelUpperBounds, clockIn.sharesPerBucket, clockIn.awardPerShare);
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