import { Button, Image } from 'antd';
import React from 'react';
import styles from './style.less';

const DiscordLoginButton: React.FC = () => {

    return (
        <>
            <div className={styles.discordButton}>
                <Button
                    type='default'
                    size='large'
                    shape='round'
                    icon={
                        <Image
                            src={'/images/sns/discord-white.svg'}
                            preview={false}
                            className={styles.loginIcon}
                        />
                    }
                    className={styles.loginButton}
                >
                    Log in with Discord
                </Button>
            </div>
        </>
    )
}

export default DiscordLoginButton;
