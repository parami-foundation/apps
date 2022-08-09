import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { Image, notification, Typography } from 'antd';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import classNames from 'classnames';
import Deposit from './deposit';
import Withdraw from './withdraw';
import ETHAddress from '../../components/ETHAddress/ETHAddress';
import SelectWallet from '../../components/SelectWallet';
import ProcessModal from './ProcessModal';

const Bridge: React.FC = () => {
    const { Account, connect, ChainId } = useModel('web3');
    const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit');
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);
    const [ethHash, setETHHash] = useState<string>();
    const [paramiHash, setParamiHash] = useState<string>();

    const intl = useIntl();

    const { Title } = Typography;

    useEffect(() => {
        connect();
    }, []);

    useEffect(() => {
        if (ChainId) {
            if (ChainId !== 3) {
                notification.warning({
                    message: 'Parami Bridge currently only supports Ropsten Testnet',
                    description: 'Please switch network in your wallet'
                })
            }
        }
    }, [ChainId])

    return (
        <>
            {Account ? (
                <div className={styles.mainBgContainer}>
                    <div className={styles.contentContainer}>
                        <ETHAddress />
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
                                        <Deposit
                                            setLoading={setLoading}
                                            setStep={setStep}
                                            setETHHash={setETHHash}
                                            setParamiHash={setParamiHash}
                                        />
                                    )}
                                    {tab === 'withdraw' && (
                                        <Withdraw
                                            setLoading={setLoading}
                                            setStep={setStep}
                                            setETHHash={setETHHash}
                                            setParamiHash={setParamiHash}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <SelectWallet />
            )}

            {loading && <ProcessModal
                tab={tab}
                step={step}
                ethHash={ethHash}
                paramiHash={paramiHash}
                onClose={() => {
                    setLoading(false);
                    setStep(1);
                    setETHHash('');
                    setParamiHash('');
                }}
             />}
        </>
    )
}

export default Bridge;
