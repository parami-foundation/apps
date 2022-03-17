import React, { useState } from 'react';
import styles from '@/pages/wallet.less';
import style from './style.less';
import Home from '../Home';
import { useIntl } from 'umi';
import { RiUserFollowFill } from 'react-icons/ri';
import { MdRadar } from 'react-icons/md';
import classNames from 'classnames';
import Following from '../Following';

const Sqaure: React.FC = () => {
    const [tab, setTab] = useState<string>('following');

    const intl = useIntl();

    return (
        <div className={styles.mainTopContainer}>
            {tab === 'home' && (
                <Home />
            )}
            {tab === 'following' && (
                <Following />
            )}

            <div className={style.bottomBar}>
                <div
                    className={classNames(style.buttonItem, tab === 'home' ? style.active : '')}
                    onClick={() => {
                        setTab('home');
                    }}
                >
                    <MdRadar className={style.buttonIcon} />
                    <span>
                        {intl.formatMessage({
                            id: 'square.title',
                            defaultMessage: 'Square',
                        })}
                    </span>
                </div>
                <div className={style.walletButton}>
                    <img
                        src={'/images/logo-square-core.svg'}
                    />
                </div>
                <div
                    className={classNames(style.buttonItem, tab === 'following' ? style.active : '')}
                    onClick={() => {
                        setTab('following');
                    }}
                >
                    <RiUserFollowFill className={style.buttonIcon} />
                    <span>
                        {intl.formatMessage({
                            id: 'square.following',
                            defaultMessage: 'Following',
                        })}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Sqaure;