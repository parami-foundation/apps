export const GetAssetInfo = async (assetId: string) => {
  const assetInfo = await window.apiWs.query.assets.metadata(Number(assetId));
  return assetInfo;
};

export const GetAssetDetail = async (assetId: string) => {
  const assetInfo = await window.apiWs.query.assets.asset(Number(assetId));
  return assetInfo;
};

export const GetAssetsHolders = async (assetId: string) => {
  const accounts = await window.apiWs.query.assets.account.entries(assetId);
  return accounts;
};

export const GetBalanceOfBudgetPot = async (potId: string, assetId: string) => {
  console.log('we are not here', potId, assetId);
  const balance = await window.apiWs.query.assets.account(Number(assetId), potId);
  if (balance.isEmpty) {
    return null;
  }
  const res = balance.toHuman() as any;
  return res;
}
