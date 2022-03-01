import config from '@/config/config';

const endpoints = config.main.subqueryServer;

export type AssetTransaction = {
    assetId: string
    block: string
    assetSymbol: string
    fromDid: string
    toDid: string
    amount: string
    timestampInSecond: number
};

function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
};

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

export const OwnerDidOfNft = async (nftId: any) => {
    const query = `query{
        asset(id: "${nftId}") {
            ownerDid
        }
    }`;
    const res = await doGraghQuery(query);
    const data = await res.json();
    return data.data.asset.ownerDid;
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
    const data = await res.json();
    return data.data.advertisementRewards.nodes as any[];
};

//first 50
export const AssetTransactionHistory = async (did: string) => {
    const query = `query {
        assetTransactions(
            orderBy: TIMESTAMP_IN_SECOND_DESC
            first:50
            filter: 
            { or: [{ fromDid: { equalTo: "${did}" } }, { toDid: { equalTo: "${did}" }}] }) {
                nodes {
                block
                assetId
                assetSymbol
                fromDid
                toDid
                amount
                timestampInSecond
            }
        }
    }`;
    const res = await doGraghQuery(query);
    const data = await res.json();
    console.log(data.data.assetTransactions.nodes);
    return data.data.assetTransactions.nodes as AssetTransaction[];
};

export const getChartsData = async (ADid: string, budget: bigint) => {
    const result = await AdvertisementRewards(ADid);
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
        cost += BigInt(result[i].reward.replaceAll(',', ''));
        cost += BigInt(result[i].award.replaceAll(',', ''));
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
    console.log(data);
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
    const data = await res.json();
    return data.data.advertisementRewards.totalCount as number;
};