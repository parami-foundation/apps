export const GetValueOf = async (assetId: string, amount: bigint) => {
  const value = await (window.apiWs.rpc as any).swap.drylySellTokens(assetId, amount.toString());
  return value.toHuman();
};

export const GetUserInfo = async (did: string) => {
  const userInfo = await window.apiWs.query.did.metadata(did);
  const [avatar, nickname] = await (window.apiWs.rpc as any).did.batchGetMetadata(did, ['pic', 'name']);

  if (userInfo.isEmpty) {
    return null;
  }
  const user = userInfo.toHuman() as any;
  return { ...user, avatar, nickname };
};

export const GetCostOf = async (assetId: string, amount: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylyBuyTokens(assetId, amount);
  return value.toHuman();
};

export const DrylySellCurrency = async (assetId: string, amount: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylySellCurrency(assetId, amount);
  return value.toHuman();
};

export const DrylyBuyCurrency = async (assetId: string, amount: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylyBuyCurrency(assetId, amount);
  return value.toHuman();
};

export const GetAdRemain = async (slot: any) => {
  const remainToken = await (window.apiWs.rpc as any).swap.drylySellCurrency(slot.nft, slot.remain.replace(/,/g, ''));
  return BigInt(remainToken.toHuman()) + BigInt(slot.tokens.replace(/,/g, ''));
};

export const DrylyAddLiquidity = async (assetId: string, amount: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylyAddLiquidity(assetId, amount, '0');
  return value.toHuman();
};

export const DrylyRemoveLiquidity = async (lpTokenId: string): Promise<string> => {
  const value = await (window.apiWs.rpc as any).swap.drylyRemoveLiquidity(lpTokenId);
  return value.toHuman();
};

export const CalculateLPReward = async (LPTokenId: string) => {
  const reward = await (window.apiWs.rpc as any).swap.calculateReward(LPTokenId);
  return reward.toHuman();
};