import React from 'react';
import styles from './style.less';
import DISCORD_ICON from './images/discord-white.svg';
import { useEffect } from 'react';
import { useParams } from 'umi';
import qs from 'qs';

const DiscordLoginButton: React.FC<{
    dataOnauth: (response: any) => void;
    clientId: string;
    redirectUri?: string;
    scope?: string;
}> = ({ dataOnauth, clientId, scope = 'identify', redirectUri }) => {
    const handleMessage = (event: MessageEvent) => {
        if (!event.data.target) {
            const url = new URL(event.data);
            const ticket = qs.parse(url.hash.substring(1));
            dataOnauth(ticket);
        }
    };

    const params: {
        platfrom: string;
    } = useParams();

    let RedirectUri = redirectUri;
    if (!RedirectUri) {
        RedirectUri = window.location.href;
    };

    useEffect(() => {
        if (params.platfrom === 'discord') {
            window.opener.postMessage(window.location.href);
            window.close();
        }
    }, []);

    const onClick = () => {
        window.open(`https://discord.com/api/oauth2/authorize?response_type=token&client_id=${clientId}&scope=${scope}&redirect_uri=${RedirectUri}`, 'discordLogin', 'height=700,width=500');
        window.addEventListener('message', handleMessage, false);
    }

    return (
        <>
            <div className={styles.discordButton}>
                <button
                    className={styles.loginButton}
                    onClick={() => { onClick() }}
                >
                    <img
                        src={DISCORD_ICON}
                        className={styles.loginIcon}
                    />
                    Log in with Discord
                </button>
            </div>
        </>
    )
}

export default DiscordLoginButton;
