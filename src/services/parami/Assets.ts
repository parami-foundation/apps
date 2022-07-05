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
  console.log('GetAssetsHolders', accounts);
  return accounts;
};

export const GetBalanceOfBudgetPot = async (potId: string, assetId: string) => {
  const balance = await window.apiWs.query.assets.account(Number(assetId), potId);
  if (balance.isEmpty) {
    return null;
  }
  const res = balance.toHuman() as any;
  return res;
}
