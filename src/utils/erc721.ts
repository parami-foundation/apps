import config from "@/config/config"

const ipfsPattern = new RegExp("^ipfs://");

export interface TokenUriMetaData {
  image: string,
}

export const normalizeToHttp = (uri: string): string => {
  if (ipfsPattern.test(uri)) {
    const resource = uri.substring(7);
    return `${config.ipfs.endpoint}${resource}`;
  }
  return uri;
}
