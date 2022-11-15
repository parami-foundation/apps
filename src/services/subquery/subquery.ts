import config from '@/config/config';
import { notification } from 'antd';

const endpoints = config.main.subqueryServer;

export type AssetTransaction = {
  assetId: string
  block: string
  assetSymbol: string
  fromAccountId: string
  toAccountId: string
  amount: string
  timestampInSecond: number
  out: boolean
  decimals: number;
};

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const networkException = () => {
  notification.error({
    key: 'networkException',
    message: 'Network exception',
    description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
    duration: null,
  });
}

export const doGraghQuery = async (query: string) => {
  const obj: any = {};
  obj.operationName = null;
  obj.variables = {};
  obj.query = query;
  return fetch(endpoints, {
    "headers": {
      "content-type": "application/json",
    },
    "body": JSON.stringify(obj),
    "method": "POST"
  });
};

export const NFTIdsOfOwnerDid = async (did: string) => {
  try {
    const query = `query {
    nfts(
      filter: { kolDid: { equalTo: "${did}" } }
    ) {
      nodes {
        id
      }
    }
  }`;
    const res = await doGraghQuery(query);

    // Network exception
    if (!res) {
      networkException();
      return;
    }

    const data = await res.json();
    return data.data.nfts.nodes.map(node => node.id)

  } catch (e) {
    console.error(e)
    return;
  }
}

export const OwnerDidOfNft = async (nftId: any) => {
  try {
    const query = `query {
    nfts(
      filter: { assetId: { equalTo: "${nftId}" } }
    ) {
      nodes {
        kolDid
      }
    }
  }`;
    const res = await doGraghQuery(query);

    // Network exception
    if (!res) {
      networkException();
      return;
    }

    const data = await res.json();
    return data.data.nfts.nodes[0].kolDid;
  } catch (e) {
    console.error(e)
    return;
  }
};

// 7 days 
export const AdvertisementRewards = async (ADid: string) => {
  const query = `query{
		advertisementRewards(
			filter:{
				id:{
						equalTo:"${ADid}"
				}
				timestampInSecond:{
						greaterThan: ${Math.round(Date.now() / 1000 - 60 * 60 * 24 * 7)}
				}
			}
		){
			nodes{
				reward
				award
				timestampInSecond
				createdAt
			}
		}
    }`;
  const res = await doGraghQuery(query);

  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();
  return data.data.advertisementRewards.nodes as any[];
};

// first 50
export const AssetTransactionHistory = async (stashAccount: string) => {
  const query = `query {
		assetTransactions(
			orderBy: TIMESTAMP_IN_SECOND_DESC
			first:50
			filter: { or: [{fromAccountId: { equalTo: "${stashAccount}" }}, {toAccountId: { equalTo: "${stashAccount}" }}] }
      ) {
				nodes {
				block
				assetId
				fromAccountId
				toAccountId
				amount
				timestampInSecond
		}
		}
    }`;
  const res = await doGraghQuery(query);

  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();

  const transactions = data.data.assetTransactions.nodes as AssetTransaction[];

  const assetIds: string[] = Array.from(new Set(transactions.map(asset => asset.assetId))).filter(id => id !== 'AD3');

  const tokens = [{ assetId: 'AD3', assetSymbol: 'AD3', decimals: 18 }];

  if (assetIds.length) {
    // get symbols
    try {
      const tokensArr = await Promise.all(assetIds.map(async assetId => {
        const raw = await window.apiWs.query.assets.metadata(assetId);
        const metadata = raw.toHuman();
        return {
          assetId,
          assetSymbol: metadata.symbol as string,
          decimals: parseInt(metadata.decimals as string, 10)
        };
      }));
      tokens.push(...tokensArr);
    } catch (e) {
      console.error('query asset symbol error', e);
    }
  }

  transactions.forEach(tx => {
    const token = tokens.find(nft => nft.assetId === tx.assetId) ?? {} as { assetSymbol: string; decimals: number };
    tx.assetSymbol = token.assetSymbol || '';
    tx.decimals = token.decimals ?? '18';
    tx.out = tx.fromAccountId === stashAccount
  });

  return transactions;
};

export const getChartsData = async (ADid: string, budget: bigint) => {
  const result = await AdvertisementRewards(ADid);

  if (!result) {
    return;
  }

  const tmp = { time: '', budget: 0, viewer: 0 };
  const data: any[] = [];
  const time: number[] = [];
  // 7 days timestamp
  for (let i = 7; i > 0; i--) {
    time.push(Date.now() / 1000 - 60 * 60 * 24 * i);
  }
  let cost = BigInt(0);
  let viewer = 0;
  let index = 0;
  for (let i = 0; i < result.length; i++) {
    cost += BigInt(result[i].reward?.replaceAll(',', ''));
    cost += BigInt(result[i].award?.replaceAll(',', ''));
    viewer++;
    const timestamp = result[i].timestampInSecond;
    tmp.time = formatTimestamp(timestamp);
    tmp.budget = Number(((budget - cost) / BigInt(1e18)).toString());
    //console.log(((budget - cost)/BigInt(1e18)))
    tmp.viewer = viewer;
    if ((Number(timestamp)) > time[index]) {
      data.push(tmp);
      index++;
    }
  }
  return data;
};

export const getAdViewerCounts = async (ADid: string) => {
  //{"data":{"advertisementRewards":{"totalCount":1}}}
  const query = `query{
		advertisementRewards(
			filter:{
				advertisementId:{
						equalTo:"${ADid}"
				}
			}
		){
			totalCount
		}
	}`;
  const res = await doGraghQuery(query);

  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();
  return data.data.advertisementRewards.totalCount as number;
};

export const getAdvertisementRefererCounts = async (ADid: string) => {
  const query = `query{
		advertisementRewards(filter:{
		id:{
			equalTo:"${ADid}"
		}
		refererDid:{
			notEqualTo:""
		}
		}){
			totalCount
		}
    }`;
  const res = await doGraghQuery(query);

  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();
  return data.data.advertisementRewards.totalCount as number;
};

export async function getStashOfDid(did: string) {
  const query = `query{
    did(id:"${did}"){
        stashAccount
      }
    }`;
  const res = await doGraghQuery(query);
  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();
  return data.data.did.stashAccount;
}

//{ or: [{ fromDid: { equalTo: "${did}" } }, { toDid: { equalTo: "${did}" }}, { fromDid: { equalTo: "${stashAccount}" } }, { toDid: { equalTo: "${stashAccount}" }}] }
export const getAssetsList = async (stashAccount: string) => {
  const query = `query{
		members(
			filter: { accountId: { equalTo:"${stashAccount}"}}
		){
			nodes{
				id
				assetId
			}
		}	
	}`;
  const res = await doGraghQuery(query);

  // Network exception
  if (!res) {
    notification.error({
      key: 'networkException',
      message: 'Network exception',
      description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
      duration: null,
    });
    return;
  }

  const data = await res.json();
  return data.data.members.nodes as any[];
};