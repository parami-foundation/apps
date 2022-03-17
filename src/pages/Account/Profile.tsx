import React from 'react';
import styles from '@/pages/wallet.less';
import style from './style.less';
import AccountDetails from './AccountDetails/AccountDetails';
import Security from './Security/Security';
import Avatar from './Avatar/Avatar';
import ExportController from './Export/ExportController';
import Bind from './Bind';

const Profile: React.FC = () => {
    return (
        <>
            <div className={styles.mainTopContainer}>
                <div className={style.profileContainer}>
                    <div className={style.left}>
                        <div className={style.section}>
                            <AccountDetails />
                        </div>
                        <div className={style.section}>
                            <Bind />
                        </div>
                    </div>
                    <div className={style.right}>
                        <div className={style.section}>
                            <Avatar />
                        </div>
                        <div className={style.section}>
                            <Security />
                        </div>
                        <div className={style.section}>
                            <ExportController />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;
