import { useCallback } from "react";
import { useModel } from "umi";

const OpenseaApiServer = 'https://ipfs.parami.io';

export default () => {
  const { Account, ChainId } = useModel('web3');

  const retrieveAssets = useCallback((contractAddresses: string[] = []) => {
    const options = { method: 'GET' };
    return fetch(`${OpenseaApiServer}/api/os/assets?chainId=${ChainId}&owner=${Account}&order_direction=desc&offset=0&limit=25&include_orders=false`
      + (contractAddresses.length ? `&${contractAddresses.map(addr => `asset_contract_addresses=${addr}`).join('&')}` : ''), options)
      .then(response => response.json())
      .catch(err => console.error(err));
  }, [Account, ChainId]);

  return {
    retrieveAssets
  };
}