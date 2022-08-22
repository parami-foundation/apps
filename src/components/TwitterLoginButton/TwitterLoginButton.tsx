import styles from './TwitterLoginButton.less';
import config from '@/config/config';

export interface TwitterLoginButtonProps { }

function TwitterLoginButton({ }: TwitterLoginButtonProps) {

    const onClick = async () => {
        window.location.href = `${config.main.airdropServer}/twitterLogin?state=airdrop`;
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
            Create by Twitter
        </button>
    </div>;
};

export default TwitterLoginButton;
