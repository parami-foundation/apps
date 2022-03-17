import React from 'react';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { useIntl } from 'umi';
import { Badge } from 'antd';

const Following: React.FC = () => {
    const intl = useIntl();

    return (
        <div className={styles.mainTopContainer}>
            <div className={style.followContainer}>
                <div className={style.pageHeader}>
                    {intl.formatMessage({
                        id: 'square.following',
                        defaultMessage: 'Following',
                    })}
                </div>
                <div className={style.followList}>
                    <div className={style.subTitle}>
                        {intl.formatMessage({
                            id: 'square.following.available',
                            defaultMessage: 'Available',
                        })}
                    </div>
                    <Badge
                        count={intl.formatMessage({
                            id: 'square.following.earnMore',
                            defaultMessage: 'Earn More',
                        })}
                        className={style.badgeContainer}
                        offset={[-20, 0]}
                    >
                        <div className={style.followItem}>
                            <div className={style.baseInfo}>
                                <img
                                    src={'/images/crypto/bitcoin-btc-logo.svg'}
                                    className={style.avatar}
                                />
                                <div className={style.followName}>
                                    <div className={style.tokenName}>
                                        HIK
                                    </div>
                                    <div className={style.kolName}>
                                        Hikaru Nakamura
                                    </div>
                                </div>
                            </div>
                            <div className={style.followValue}>
                                <div className={style.value}>
                                    233 $HIK
                                </div>
                            </div>
                        </div>
                    </Badge>
                    <Badge
                        count={intl.formatMessage({
                            id: 'square.following.earnMore',
                            defaultMessage: 'Earn More',
                        })}
                        className={style.badgeContainer}
                        offset={[-20, 0]}
                    >
                        <div className={style.followItem}>
                            <div className={style.baseInfo}>
                                <img
                                    src={'/images/crypto/eth-circle.svg'}
                                    className={style.avatar}
                                />
                                <div className={style.followName}>
                                    <div className={style.tokenName}>
                                        HIK
                                    </div>
                                    <div className={style.kolName}>
                                        Hikaru Nakamura
                                    </div>
                                </div>
                            </div>
                            <div className={style.followValue}>
                                <div className={style.value}>
                                    233 $HIK
                                </div>
                            </div>
                        </div>
                    </Badge>
                </div>
                <div className={style.followList}>
                    <div className={style.subTitle}>
                        {intl.formatMessage({
                            id: 'square.following.forwardOnly',
                            defaultMessage: 'Forward Only',
                        })}
                    </div>
                    <Badge
                        count={intl.formatMessage({
                            id: 'sqaure.follow.forward',
                            defaultMessage: 'Forward',
                        })}
                        className={style.badgeContainer}
                        offset={[-20, 0]}
                    >
                        <div className={style.followItem}>
                            <div className={style.baseInfo}>
                                <img
                                    src={'/images/crypto/litecoin-ltc-logo.svg'}
                                    className={style.avatar}
                                />
                                <div className={style.followName}>
                                    <div className={style.tokenName}>
                                        HIK
                                    </div>
                                    <div className={style.kolName}>
                                        Hikaru Nakamura
                                    </div>
                                </div>
                            </div>
                            <div className={style.followOnlyValue}>
                                <div className={style.value}>
                                    233 $HIK
                                </div>
                            </div>
                        </div>
                    </Badge>
                    <Badge
                        count={intl.formatMessage({
                            id: 'sqaure.follow.forward',
                            defaultMessage: 'Forward',
                        })}
                        className={style.badgeContainer}
                        offset={[-20, 0]}
                    >
                        <div className={style.followItem}>
                            <div className={style.baseInfo}>
                                <img
                                    src={'/images/crypto/monero-xmr-logo.svg'}
                                    className={style.avatar}
                                />
                                <div className={style.followName}>
                                    <div className={style.tokenName}>
                                        HIK
                                    </div>
                                    <div className={style.kolName}>
                                        Hikaru Nakamura
                                    </div>
                                </div>
                            </div>
                            <div className={style.followOnlyValue}>
                                <div className={style.value}>
                                    233 $HIK
                                </div>
                            </div>
                        </div>
                    </Badge>
                </div>
            </div>
        </div>
    )
}

export default Following;
