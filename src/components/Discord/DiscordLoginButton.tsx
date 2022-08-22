import React from 'react';
import styles from './style.less';
import DISCORD_ICON from './images/discord-white.svg';
import config from '@/config/config';

const DiscordLoginButton: React.FC<{
  clientId: string;
  redirectUri?: string;
}> = ({ clientId, redirectUri }) => {

  let RedirectUri = redirectUri;
  if (!RedirectUri) {
    RedirectUri = window.location.href;
  };

  const onClick = () => {
    window.location.href = `${config.airdropService.discord.oauthEndpoint}?response_type=token&client_id=${clientId}&scope=identify&redirect_uri=${RedirectUri}&state=airdrop`;
  }

  return (
    <div className={styles.discordButton}>
      <button
        className={styles.loginButton}
        onClick={() => { onClick() }}
      >
        <img
          src={DISCORD_ICON}
          className={styles.loginIcon}
        />
        Create by Discord
      </button>
    </div>
  )
}

export default DiscordLoginButton;
