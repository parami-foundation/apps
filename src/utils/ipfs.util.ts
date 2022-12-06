import config from "@/config/config";
import { uploadIPFS } from "@/services/parami/IPFS";

export const uploadMetadata = async (metadata) => {
  const bufferred = await Buffer.from(JSON.stringify(metadata));
  const { response, data } = await uploadIPFS(bufferred);
  if (!response.ok) {
    throw ('Create Metadata Error');
  }

  return data.Hash;
}

export const fetchMetadata = async (ipfsUrl: string) => {
  if (!ipfsUrl || !ipfsUrl.startsWith('ipfs://')) {
    return {}
  }

  const hash = ipfsUrl.substring(7);
  const adJsonResp = await fetch(config.ipfs.endpoint + hash);
  return await adJsonResp.json();
}