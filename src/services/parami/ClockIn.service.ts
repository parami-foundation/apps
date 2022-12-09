import { checkFeeAndSubmitExtrinsic } from "@/utils/chain.util";
import { parseAmount } from "@/utils/common";
import { deleteComma } from "@/utils/format";
import { fetchMetadata } from "@/utils/ipfs.util";
import { GetBalanceOfBudgetPot } from "./Assets";
import { GetTagsOfClockIn } from "./Tag";

export interface ClockInData {
  nftId: string;
  levelProbability: number[];
  levelEndpoints: string[];
  sharesPerBucket: number;
  awardPerShare: string;
  totalRewardToken?: string;
}

export interface ClockInVO extends ClockInData {
  remainingBudget: string;
}

export const QueryLotteryMetadata = async (nftId: string) => {
  return {
    assetId: nftId,
    levelEndpoints: [
      parseAmount('1000'),
      parseAmount('10000'),
      parseAmount('100000'),
      parseAmount('1000000')
    ],
    levelProbability: [1, 5, 10, 20, 50],
    sharesPerBucket: 10,
    awardPerShare: parseAmount('1000'),
    pot: '123123'
  }
}

export const QueryLottery = async (nftId: string) => {
  const metadata = await QueryLotteryMetadata(nftId);

  if (!metadata) {
    return {};
  }

  // const potBudget = await GetBalanceOfBudgetPot(metadata.pot, metadata.assetId) as any;
  const potBudget = '1500000000000000000000';

  return {
    nftId,
    ...metadata,
    remainingBudget: potBudget
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
  const ex = window.apiWs.tx.clockIn.enableClockIn(clockIn.nftId, clockIn.levelProbability, clockIn.levelEndpoints, clockIn.sharesPerBucket, clockIn.awardPerShare, clockIn.totalRewardToken);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const DisableClockIn = async (nftId: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.clockIn.disableClockIn(nftId);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const UpdateClockIn = async (clockIn: ClockInData, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.clockIn.updateClockIn(clockIn.nftId, clockIn.levelProbability, clockIn.levelEndpoints, clockIn.sharesPerBucket, clockIn.awardPerShare);
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