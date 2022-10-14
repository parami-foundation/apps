import styles from './TwitterLoginButton.less';
import config from '@/config/config';

export interface TwitterLoginButtonProps {
    state?: string;
    buttonText?: string;
}

function TwitterLoginButton({state = 'airdrop', buttonText = 'Create by Twitter'}: TwitterLoginButtonProps) {

    const onClick = async () => {
        window.location.href = `${config.main.airdropServer}/twitterLogin?state=${state}`;
    }

    return <div className={styles.twitterBtn}>
        <button
            className={styles.loginButton}
            onClick={() => { onClick() }}
        >
            <img
                src="/images/sns/twitter-white.svg"
                className={styles.loginIcon}
            />
            {buttonText}
        </button>
    </div>;
};

export default TwitterLoginButton;
