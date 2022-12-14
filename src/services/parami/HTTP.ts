import config from '@/config/config';
import { extend } from 'umi-request';
import { AdScore, AdScoreInfo, API } from './typings';

const errorHandler = (error: any) => {
    const { response = {}, data = {} } = error;
    return {
        response,
        data
    } as API.Resp;
}
const request = extend({
    errorHandler, // 默认错误处理
    credentials: 'same-origin', // 默认请求是否带上cookie
});

/** Login with Airdrop POST /feed */
// OK:200, Ticket Err:401, Airdroped:403, Site Err:400
export async function LoginWithAirdrop(body: API.AirdropLogin, options?: { [key: string]: any }) {
    return request(`${config.main.airdropServer}/feed`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
        getResponse: true,
    });
}

export async function BindSocialAccount(body: API.BindSocial, options?: { [key: string]: any }) {
    return request(`${config.main.airdropServer}/bind`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
        getResponse: true,
    });
}

/** Login Account POST /link */
// OK:204, Ticket Err:401, Airdroped:403, Site Err:400
export async function LinkAccount(body: API.AirdropLink, options?: { [key: string]: any }) {
    return request(`${config.main.airdropServer}/link`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
        getResponse: true,
    });
}

export async function GetCurrentScoresOfAd(adId: string, nftId: string, did: string, options?: { [key: string]: any }) {
    return request(`${config.main.airdropServer}/advertisers/scores?ad=${adId}&nft=${nftId}&did=${did}`, {
        method: 'GET',
        ...(options || {}),
        getResponse: true,
    });
}

export async function GetAvatar(url: string, options?: { [key: string]: any }) {
    return request(url, {
        method: 'GET',
        responseType: 'blob',
        ...(options || {}),
        getResponse: true,
    });
}

export async function GetChainBridgeTokenInfo(options?: { [key: string]: any }) {
    return request(config.main.chainBridgeConfig, {
        method: 'GET',
        ...(options || {}),
        getResponse: true,
    });
}

export async function ApplyClaimHNFT(body: API.ClaimHNFT, options?: { [key: string]: any }) {
    return request(`${config.main.airdropServer}/api/claim/hnft`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
        getResponse: true
    });
}

export async function QueryAssetById(id: string) {
    return request(`${config.main.airdropServer}/api/token?id=${id}`, {
        method: 'GET',
        getResponse: true,
    });
}

export async function QueryAssets(did: string, keyword?: string) {
    return request(`${config.main.airdropServer}/api/tokens?did=${did}${keyword ? `&keyword=${keyword}` : ''}`, {
        method: 'GET',
        getResponse: true,
    })
}

export async function RateScore(adId: string, did: string, score: {tag: string; score: number}) {
    return request(`${config.main.airdropServer}/advertisers/rates`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            ad: adId,
            did,
            scores: [score]
        },
        getResponse: true
    });
}

export async function retrieveOpenseaAsset(address: string, tokenId: number) {
    const options = { method: 'GET' };
    return fetch(`https://ipfs.parami.io/api/os/asset/${address}/${tokenId}?chainId=1`, options)
      .then(response => response.json())
      .catch(err => console.error(err));
}
