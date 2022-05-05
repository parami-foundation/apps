export const GetUserInfo = async (did: string) => {
  const userInfo = await window.apiWs.query.did.metadata(did);
  const [avatar, nickname] = await (window.apiWs.rpc as any).did.batchGetMetadata(did, ['pic', 'name']);

  if (userInfo.isEmpty) {
    return null;
  }
  const user = userInfo.toHuman() as any;
  return { ...user, avatar, nickname };
};

export const DrylyBuyToken = async (tokenId: string, tokens: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylyBuyTokens(tokenId, tokens);
  return value.toHuman();
};

export const DrylySellToken = async (tokenId: string, tokens: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylySellTokens(tokenId, tokens);
  return value.toHuman();
};

export const DrylyBuyCurrency = async (tokenId: string, currency: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylyBuyCurrency(tokenId, currency);
  return value.toHuman();
};

export const DrylySellCurrency = async (tokenId: string, currency: string) => {
  const value = await (window.apiWs.rpc as any).swap.drylySellCurrency(tokenId, currency);
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