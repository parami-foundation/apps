import { useCallback } from "react";
import { useModel } from "umi";

const OpenseaApiServer = 'https://ipfs.parami.io';

export interface OSAssetContract {
  name: string;
  address: string;
}

export interface OSCollection {
  slug: string;
  name: string;
  banner_image_url?: string;
  featured_image_url?: string;
  image_url?: string;
  description?: string;
  primary_asset_contracts?: OSAssetContract[];
}

export interface OSNFT {
  token_id: string;
  image_url: string;
  name: string;
  description: string;
  asset_contract: OSAssetContract
}

export default () => {
  const { Account, ChainId } = useModel('web3');

  const retrieveAssets = useCallback((searchParams = {}) => {
    if (!Account || !ChainId) {
      return Promise.resolve([]);
    }

    const options = { method: 'GET' };
    const params = new URLSearchParams();

    if (searchParams.contractAddresses?.length) {
      searchParams.contractAddresses.forEach(address => params.append('asset_contract_addresses', address));
    }
    delete searchParams.contractAddresses;

    if (searchParams.tokenIds?.length) {
      searchParams.tokenIds.forEach(tokenId => params.append('token_ids', `${tokenId}`));
    }
    delete searchParams.tokenIds;

    searchParams = {
      chainId: `${ChainId}`,
      owner: Account,
      order_direction: 'desc',
      offset: '0',
      limit: '25',
      include_orders: 'false',
      ...searchParams
    };

    for (const key in searchParams) {
      params.append(key, searchParams[key]);
    }

    return fetch(`${OpenseaApiServer}/api/os/assets?${params.toString()}`, options)
      .then(response => response.json()).then(resp => (resp?.assets ?? []) as OSNFT[])
      .catch(err => console.error(err));
  }, [Account, ChainId]);

  const retrieveAsset = useCallback((address: string, tokenId: number) => {
    const options = { method: 'GET' };
    return fetch(`${OpenseaApiServer}/api/os/asset/${address}/${tokenId}?chainId=${ChainId}`, options)
      .then(response => response.json())
      .catch(err => console.error(err));
  }, [ChainId])

  const retrieveCollections = useCallback(() => {
    const options = { method: 'GET' };
    return fetch(`${OpenseaApiServer}/api/os/collections?chainId=${ChainId}&asset_owner=${Account}&offset=0&limit=300`, options)
      .then(resp => {
        return resp.json() as Promise<OSCollection[]>;
      })
      .catch(err => console.error(err));
  }, [ChainId, Account])

  if (!ChainId || !Account) {
    return {};
  }

  return {
    retrieveAssets,
    retrieveAsset,
    retrieveCollections
  };
}