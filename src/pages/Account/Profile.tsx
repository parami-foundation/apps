import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';

const Profile: React.FC = () => {
    const intl = useIntl();

    return (
        <>
            <div className={styles.mainTopContainer}>
                <div className={style.indexContainer}>
                    <div className={style.left}>
                        <div className={style.section}>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;
