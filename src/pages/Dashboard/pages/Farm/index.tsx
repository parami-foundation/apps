import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Button, Typography, Image, Space, Tooltip } from 'antd';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';

const ICON_AD3 = '/images/logo-round-core.svg';
const ICON_ETH = '/images/crypto/ethereum-circle.svg';
const ICON_USDT = '/images/crypto/usdt-circle.svg';
const ICON_USDC = '/images/crypto/usdc-circle.svg';

const Farm: React.FC = () => {
    const intl = useIntl();

    const { Title } = Typography;

    return (
        <>
            <div className={styles.mainBgContainer}>
                <div className={styles.contentContainer}>
                    <div className={style.stakeContainer}>
                        <div className={style.headerContainer}>
                            <div className={style.titleContainer}>
                                <Title level={2}>
                                    {intl.formatMessage({
                                        id: 'dashboard.farm.title',
                                        defaultMessage: 'Liquidity Mining',
                                    })}
                                </Title>
                                <span className={style.description}>
                                    {intl.formatMessage({
                                        id: 'dashboard.farm.description',
                                        defaultMessage: 'Stake your AD3 to earn rewards',
                                    })}
                                </span>
                            </div>
                            <Button
                                shape='round'
                                type='primary'
                                size='large'
                                onClick={() => {
                                    window.open();
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'dashboard.farm.exchangeAD3',
                                    defaultMessage: 'Exchange AD3',
                                })}
                            </Button>
                        </div>
                        <div className={style.stakeContainer}>
                            <div className={style.stakeItem}>
                                <div className={style.tokenPair}>
                                    <div className={style.tokenIcons}>
                                        <Image
                                            src={ICON_ETH}
                                            preview={false}
                                            className={style.icon}
                                        />
                                        <Image
                                            src={ICON_AD3}
                                            preview={false}
                                            className={style.icon}
                                        />
                                    </div>
                                    <div className={style.tokenNameAndRate}>
                                        <div className={style.tokenName}>
                                            ETH/AD3
                                        </div>
                                        <div className={style.tokenRate}>
                                            <Space>
                                                {intl.formatMessage({
                                                    id: 'dashboard.farm.freeRate',
                                                    defaultMessage: 'Free Rate',
                                                })}
                                                <strong>0.05%</strong>
                                            </Space>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.tokenAPY}>
                                    <div className={style.title}>
                                        {intl.formatMessage({
                                            id: 'dashboard.farm.apy',
                                            defaultMessage: 'APY(1y)',
                                        })}
                                    </div>
                                    <div className={style.value}>
                                        2.05%
                                        <Tooltip
                                            placement="bottom"
                                            title={intl.formatMessage({
                                                id: 'dashboard.farm.apyTip',
                                                defaultMessage: 'The APR value is calculated based on the current data, which changes as the user deposition changes.'
                                            })}
                                        >
                                            <InfoCircleOutlined className={style.tipButton} />
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className={style.tokenLiquidity}>
                                    <div className={style.title}>
                                        {intl.formatMessage({
                                            id: 'dashboard.farm.liquidity',
                                            defaultMessage: 'Liquidity',
                                        })}
                                    </div>
                                    <div className={style.value}>
                                        $300,474.57
                                        <Tooltip
                                            placement="bottom"
                                            title={intl.formatMessage({
                                                id: 'dashboard.farm.apyTip',
                                                defaultMessage: 'The APR value is calculated based on the current data, which changes as the user deposition changes.'
                                            })}
                                        >
                                            <InfoCircleOutlined className={style.tipButton} />
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className={style.tokenRewardRange}>
                                    <div className={style.title}>
                                        {intl.formatMessage({
                                            id: 'dashboard.farm.rewardRange',
                                            defaultMessage: 'Reward Range',
                                        })}
                                    </div>
                                    <div className={style.value}>
                                        0.95-1.05
                                        <Tooltip
                                            placement="bottom"
                                            title={intl.formatMessage({
                                                id: 'dashboard.farm.apyTip',
                                                defaultMessage: 'The APR value is calculated based on the current data, which changes as the user deposition changes.'
                                            })}
                                        >
                                            <InfoCircleOutlined className={style.tipButton} />
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className={style.tokenRewards}>
                                    <div className={style.title}>
                                        {intl.formatMessage({
                                            id: 'dashboard.farm.rewards',
                                            defaultMessage: 'Rewards',
                                        })}
                                    </div>
                                    <div className={style.value}>
                                        <Image
                                            src={'/images/logo-round-core.svg'}
                                            preview={false}
                                            className={style.icon}
                                        />
                                        10 AD3/block
                                    </div>
                                </div>
                                <div className={style.expandButton}>
                                    <Button type="link" icon={<DownOutlined />} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Farm;
