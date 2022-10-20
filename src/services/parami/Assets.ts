export type Asset = {
  deposit: number;
  name: string;
  symbol: string;
  decimals: number;
  isFrozen: boolean;
}

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
  const balance = await window.apiWs.query.assets.account(Number(assetId), potId);
  if (balance.isEmpty) {
    return null;
  }
  const res = balance.toHuman() as any;
  return res;
}

export const GetAllAssets = async () => {
  const entries = await window.apiWs.query.assets.metadata.entries();
  const assets: {
    decimals: string;
    deposit: string;
    id: string;
    isFrozen: boolean;
    name: string;
    symbol: string;
  }[] = (entries ?? []).map(entry => {
    const [key, value] = entry;
    const assetId = key.toHuman();
    if (assetId) {
      return {
        ...value.toHuman(),
        id: assetId[0].replaceAll(',', '')
      }
    }
    return null;
  }).filter(Boolean) as any;

  return assets;
}
