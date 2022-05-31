import config from "@/config/config"

const ipfsPattern = new RegExp("^ipfs://");

export interface TokenUriMetaData {
  image: string,
}

export const fetchErc721TokenURIMetaData = (uri: string) : Promise<TokenUriMetaData> => {
  for (const [pattern, metaDataFetcher] of metaDataFetchers) {
    if (pattern.test(uri)) {
      return metaDataFetcher(uri);
    }
  }

  return Promise.reject("no pattern matched");
}

export const normalizeToHttp = (uri: string): string => {
  if (ipfsPattern.test(uri)) {
    const resource = uri.substring(7);
    return `${config.ipfs.endpoint}${resource}`;
  }
  return uri;
}


const metaDataFetchers: [RegExp, (uri: string) => Promise<TokenUriMetaData>][] = [
  [new RegExp("^data:application/json;base64,.+"), async function (uri: string): Promise<TokenUriMetaData> {
      console.log("data application");
    const json = Buffer.from(uri.substring(29), "base64").toString();
    return Promise.resolve(JSON.parse(json));
  }],
  [new RegExp("^http"), async function (uri: string): Promise<TokenUriMetaData> {
    console.log("http");
    const result = await fetch(uri);
    return result.json();
  }],
  [ipfsPattern, async function (uri: string): Promise<TokenUriMetaData> {
    // example ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1957
    console.log("ipfs");
    const result = await fetch(normalizeToHttp(uri));
    return result.json();
  }]
]
