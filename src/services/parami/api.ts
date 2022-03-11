// @ts-ignore
/* eslint-disable */
import config from '@/config/config';
import { extend } from 'umi-request';

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

/** Login with Airdrop POST /link */
// OK:204, Ticket Err:401, Airdroped:403, Site Err:400
export async function LinkWithAirdrop(body: API.AirdropLink, options?: { [key: string]: any }) {
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

export async function GetAvatar(url: string, options?: { [key: string]: any }) {
    return request(url, {
        method: 'GET',
        responseType: 'blob',
        ...(options || {}),
        getResponse: true,
    });
}

export async function GetTagsMap(options?: { [key: string]: any }) {
    return request(config.main.tagMapConfig, {
        method: 'GET',
        ...(options || {}),
        getResponse: true,
    });
}
