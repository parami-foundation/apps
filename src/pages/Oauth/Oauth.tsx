import React, { useEffect } from 'react';
import { useParams, history } from 'umi';
import { notification } from 'antd';
import { parseUrlParams } from '@/utils/url.util';
import { TWITTER_OAUTH_USAGE } from '@/config/constant';

export interface OauthProps { }

type DiscordTicket = {
    access_token: string,
    expires_in: string,
    scope: string,
    token_type: string,
    state: string
}

type TwitterTicket = {
    code: string,
    state: string
}

function Oauth({ }: OauthProps) {
    const params: {
        platform: string;
    } = useParams();

    const parseDiscordTicket = (ticket: DiscordTicket) => {
        switch (ticket.state) {
            case 'airdrop':
                history.push(`/create?platform=Discord&access_token=${ticket.access_token}`);
                break;
            case 'bind':
                history.push(`/profile?platform=Discord&access_token=${ticket.access_token}`);
                break;
            default:
                notification.warning({
                    message: `Discord Oauth Unknown State: ${ticket.state}`
                });
                history.push('');
        }
    }

    const parseTwitterTicket = (ticket: TwitterTicket) => {
        switch (ticket.state) {
            case TWITTER_OAUTH_USAGE.AIRDROP:
                history.push(`/create?platform=Twitter&code=${ticket.code}`);
                break;
            case TWITTER_OAUTH_USAGE.BIND:
                history.push(`/profile?platform=Twitter&code=${ticket.code}`);
                break;
            default:
                if (ticket.state.startsWith(TWITTER_OAUTH_USAGE.CLAIM_HNFT)) {
                    history.push(`/claimHnft/${ticket.state.slice(TWITTER_OAUTH_USAGE.CLAIM_HNFT.length + 1)}?code=${ticket.code}`);
                    break;
                }
                notification.warning({
                    message: `Twitter Oauth Unknown State: ${ticket.state}`
                });
                history.push('');
        }
    }

    useEffect(() => {
        const platform = params.platform;
        const ticket = parseUrlParams();

        console.log('[kai] in oauth', window.location.href);

        switch (platform) {
            case 'discord':
                parseDiscordTicket(ticket as DiscordTicket);
                return;
            case 'twitter':
                parseTwitterTicket(ticket as TwitterTicket);
                return;
            default:
                notification.warning({
                    message: `Unsupported Platform ${platform}`
                });
        }
    }, [params]);

    return <></>;
};

export default Oauth;
