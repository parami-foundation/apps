import { GetChainBridgeTokenInfo } from "@/services/parami/HTTP";
import { useEffect, useState } from "react"

export interface ChainBridgeToken {
  name: string;
  symbol: string;
  resourceId: string;
  icon: string;
  assetId: number;
  contract_address: string;
  ethChainId: number;
  paramiChainId: number;
  decimals: number;
}

const tokenIconMap = {
  AD3: "/images/logo-round-core.svg",
  USD: "/images/crypto/usdt-circle.svg",
  LINK: "/images/crypto/chainlink-link-logo.svg",
  WPC: "/images/crypto/WePiggy-icon.png",
  USDT: "/images/crypto/usdt-circle.svg",
}

export default () => {
  const [tokens, setTokens] = useState<ChainBridgeToken[]>();

  const fetchTokenInfo = async () => {
    const { data } = await GetChainBridgeTokenInfo();
    const tokens = data.assets.map(asset => {
      return {
        name: asset.name,
        symbol: asset.symbol,
        resourceId: asset.resource_id,
        icon: tokenIconMap[asset.symbol] || '/images/logo-round-core.svg',
        assetId: asset.chains[0].asset_id,
        contract_address: asset.chains[1].contract_address,
        ethChainId: asset.chains[1].chain_id,
        paramiChainId: asset.chains[0].chain_id,
        decimals: asset.decimals
      }
    })
    setTokens(tokens);
  }

  useEffect(() => {
    fetchTokenInfo();
  }, []);

  return {
    tokens
  }
}