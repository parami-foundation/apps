import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import { Image, Spin, Typography } from 'antd';
import SelectWallet from './components/selectWallet';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import classNames from 'classnames';
import Deposit from './deposit';
import Withdraw from './withdraw';
import { LoadingOutlined } from '@ant-design/icons';

const Bridge: React.FC = () => {
    const [tab, setTab] = useState<string>('deposit');
    const [loading, setLoading] = useState<boolean>(false);

    const {
        account,
    } = useModel("metaMask");

    const intl = useIntl();

    const { Title } = Typography;

    return (
        <>
            {account ? (
                <Spin
                    indicator={
                        <LoadingOutlined style={{ fontSize: 60 }} spin />
                    }
                    spinning={loading}
                >
                    <div className={styles.mainBgContainer}>
                        <div className={styles.contentContainer}>
                            <div className={style.bridgeContainer}>
                                <div className={style.leftContainer}>
                                    <div className={style.innerWrapper}>
                                        <Title level={2}>
                                            {intl.formatMessage({
                                                id: 'dashboard.bridge.title',
                                                defaultMessage: 'Parami Bridge',
                                            })}
                                        </Title>
                                        <span className={style.description}>
                                            {intl.formatMessage({
                                                id: 'dashboard.bridge.description',
                                                defaultMessage: 'The safe, fast and most secure way to bring cross-chain assets to Parami chain.',
                                            })}
                                        </span>
                                        <div className={style.points}>
                                            <a>
                                                {intl.formatMessage({
                                                    id: 'dashboard.bridge.howItWorks',
                                                    defaultMessage: 'How it works?',
                                                })}
                                            </a>
                                            <a>
                                                {intl.formatMessage({
                                                    id: 'dashboard.bridge.faq',
                                                    defaultMessage: 'FAQ',
                                                })}
                                            </a>
                                            <a>
                                                {intl.formatMessage({
                                                    id: 'dashboard.bridge.userGuide',
                                                    defaultMessage: 'User guide',
                                                })}
                                            </a>
                                        </div>
                                    </div>
                                    <div className={style.bottomSection}>
                                        <Image
                                            src='/images/background/chainbridge.svg'
                                            preview={false}
                                            className={style.background}
                                        />
                                    </div>
                                </div>
                                <div className={style.rightContainer}>
                                    <div className={style.bridgeTabs}>
                                        <div
                                            className={classNames(style.bridgeTabsItem, tab === 'deposit' ? style.active : '')}
                                            onClick={() => setTab('deposit')}
                                        >
                                            {intl.formatMessage({
                                                id: 'dashboard.bridge.deposit',
                                                defaultMessage: 'Deposit',
                                            })}
                                        </div>
                                        <div
                                            className={classNames(style.bridgeTabsItem, tab === 'withdraw' ? style.active : '')}
                                            onClick={() => setTab('withdraw')}
                                        >
                                            {intl.formatMessage({
                                                id: 'dashboard.bridge.withdraw',
                                                defaultMessage: 'Withdraw',
                                            })}
                                        </div>
                                    </div>
                                    <div className={style.bridgeBody}>
                                        {tab === 'deposit' && (
                                            <Deposit setLoading={setLoading} />
                                        )}
                                        {tab === 'withdraw' && (
                                            <Withdraw setLoading={setLoading} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
            ) : (
                <SelectWallet />
            )}
        </>
    )
}

export default Bridge;
