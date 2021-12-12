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

/** Login with Telegram POST /feed */
// OK:200, Ticket Err:401, Airdroped:403, Site Err:400
export async function LoginWithTelegram(body: API.TelegramLogin, options?: { [key: string]: any }) {
    const airdrop = 'https://airdrop.parami.io'
    return request(`${airdrop}/feed`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
        getResponse: true,
    });
}

/** Login with Telegram POST /link */
// OK:204, Ticket Err:401, Airdroped:403, Site Err:400
export async function LinkWithTelegram(body: API.TelegramLink, options?: { [key: string]: any }) {
    const airdrop = 'https://airdrop.parami.io'
    return request(`${airdrop}/link`, {
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
