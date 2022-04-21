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
