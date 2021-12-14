import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/dashboard.less';
import { Button, Card, Spin } from 'antd';
import classNames from 'classnames';
import { ArrowRightOutlined, LinkOutlined } from '@ant-design/icons';
import BigModal from '@/components/ParamiModal/BigModal';
import SelectWallet from './components/selectWallet';
import Ethereum from './ethereum';
import Parami from './parami';

const Bridge: React.FC = () => {
    const [tab, setTab] = useState<string>('ETHToAD3');
    const [selectModal, setSelectModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const {
        account,
    } = useModel("metaMask");

    const intl = useIntl();

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.contentContainer}>
                    <Spin
                        tip={intl.formatMessage({
                            id: 'common.submitting',
                        })}
                        wrapperClassName={styles.contentContainer}
                        spinning={loading}
                    >
                        <Card
                            style={{
                                padding: 0
                            }}
                            bodyStyle={{
                                padding: 0,
                                width: '100%',
                            }}
                            className={styles.windowCard}
                        >
                            <div className={styles.tabSelector}>
                                <div
                                    className={classNames(styles.tabItem, tab === 'ETHToAD3' ? '' : styles.inactive)}
                                    onClick={() => setTab('ETHToAD3')}
                                >
                                    {intl.formatMessage({
                                        id: 'dashboard.bridge.ethtoad3',
                                        defaultMessage: 'ETH{icon}AD3',
                                    }, {
                                        icon: <ArrowRightOutlined />
                                    })}
                                </div>
                                <div
                                    className={classNames(styles.tabItem, tab === 'AD3ToETH' ? '' : styles.inactive)}
                                    onClick={() => setTab('AD3ToETH')}
                                >
                                    {intl.formatMessage({
                                        id: 'pages.liquidity.ad3toeth',
                                        defaultMessage: 'AD3{icon}ETH',
                                    }, {
                                        icon: <ArrowRightOutlined />
                                    })}
                                </div>
                            </div>
                            {tab === 'ETHToAD3' && !account && (
                                <div className={styles.windowCardBody}>
                                    <Button
                                        block
                                        type='primary'
                                        size='large'
                                        shape='round'
                                        icon={<LinkOutlined />}
                                        onClick={() => {
                                            setSelectModal(true);
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'dashboard.bridge.connectETH',
                                            defaultMessage: 'Connect ETH',
                                        })}
                                    </Button>
                                </div>
                            )}
                            {tab === 'ETHToAD3' && account && (
                                <Ethereum setLoading={setLoading} />
                            )}
                            {tab === 'AD3ToETH' && (
                                <Parami setLoading={setLoading} />
                            )}
                        </Card>
                    </Spin>
                </div>
            </div>
            <BigModal
                visable={selectModal}
                title={intl.formatMessage({
                    id: 'dashboard.bridge.selectAWallet',
                    defaultMessage: 'Select a Wallet',
                })}
                content={
                    <SelectWallet setSelectModal={setSelectModal} />
                }
                footer={false}
                close={() => setSelectModal(false)}
            />
        </>
    )
}

export default Bridge;
