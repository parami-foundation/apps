import styles from './TwitterLoginButton.less';
import config from '@/config/config';

export interface TwitterLoginButtonProps { }

function TwitterLoginButton({ }: TwitterLoginButtonProps) {

    const onClick = async () => {
        const resp = await fetch(`${config.main.airdropServer}/twitterLogin?redirect=${window.location}/twitter`, {
            method: 'GET'
        });
        const url = await resp.json();

        window.location.href = url;
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
