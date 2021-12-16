import React, { useCallback, useEffect, useState } from 'react';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Button, Typography, Image, Space, Tooltip, Badge, Spin } from 'antd';
import { DownOutlined, FireOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import Rows from './components/Rows';
import { useModel } from 'umi';
import SelectWallet from '../Bridge/components/selectWallet';
import { ethers } from 'ethers';
import { getAd3EthPrice } from './api/uniswap/pool';

const ICON_AD3 = '/images/logo-round-core.svg';
const ICON_ETH = '/images/crypto/ethereum-circle.svg';
const ICON_USDT = '/images/crypto/usdt-circle.svg';
const ICON_USDC = '/images/crypto/usdc-circle.svg';

const Farm: React.FC = () => {
    const [collapse, setCollapse] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [AD3Price, setAD3Price] = useState('0');
    const [AD3Supply, setSupply] = useState(BigInt(0));
    const [apys, setApys] = useState<any[]>([]);
    const [ad3Approved, setAd3Approved] = useState<boolean>(false);
    const [ad3ApprovedLoading, setAd3ApprovedLoading] = useState<boolean>(false);

    const { Title } = Typography;

    const {
        account,
        chainId,
    } = useModel("metaMask");

    const {
        ad3Contract,
        stakeContract,
        factoryContract
    } = useModel('contracts');

    const handleApproveAd3 = async () => {
        const tx = await ad3Contract?.approve(stakeContract?.address, ethers.constants.MaxUint256)
        setAd3ApprovedLoading(true);
        await tx.wait();
        setAd3Approved(true);
    };

    const updatePrice = async () => {
        if (factoryContract) {
            const price = await getAd3EthPrice(factoryContract);
            setAD3Price(price.toSignificant());
        }
    }

    useEffect(() => {
        if (ad3Contract) {
            ad3Contract.totalSupply().then(res => {
                console.log(res.toString());
                setSupply(res);
            })
        }
    }, [ad3Contract]);

    useEffect(() => {
        updatePrice();
    }, [factoryContract]);

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
                            <div className={style.stakeContainer}>
                                <div className={style.headerContainer}>
                                    <div className={style.titleContainer}>
                                        <Title level={2}>
                                            Liquidity Mining
                                        </Title>
                                        <span className={style.description}>
                                            Stake your AD3 to earn rewards
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
                                        Exchange AD3
                                    </Button>
                                </div>
                                <div className={style.stakeContainer}>
                                    <Badge.Ribbon
                                        text={
                                            <>
                                                <Space>
                                                    <FireOutlined />
                                                    Double reward
                                                </Space>
                                            </>
                                        }
                                    >
                                        <div className={style.stakeItem}>
                                            <div className={style.stakeMain}>
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
                                                                Free Rate
                                                                <strong>0.05%</strong>
                                                            </Space>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={style.tokenAPY}>
                                                    <div className={style.title}>
                                                        APY(1y)
                                                    </div>
                                                    <div className={style.value}>
                                                        2.05%
                                                        <Tooltip
                                                            placement="bottom"
                                                            title={'The APR value is calculated based on the current data, which changes as the user deposition changes.'}
                                                        >
                                                            <InfoCircleOutlined className={style.tipButton} />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <div className={style.tokenLiquidity}>
                                                    <div className={style.title}>
                                                        Liquidity
                                                    </div>
                                                    <div className={style.value}>
                                                        $300,474.57
                                                        <Tooltip
                                                            placement="bottom"
                                                            title={'The APR value is calculated based on the current data, which changes as the user deposition changes.'}
                                                        >
                                                            <InfoCircleOutlined className={style.tipButton} />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <div className={style.tokenRewardRange}>
                                                    <div className={style.title}>
                                                        Reward Range
                                                    </div>
                                                    <div className={style.value}>
                                                        0.95-1.05
                                                        <Tooltip
                                                            placement="bottom"
                                                            title={'The APR value is calculated based on the current data, which changes as the user deposition changes.'}
                                                        >
                                                            <InfoCircleOutlined className={style.tipButton} />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <div className={style.tokenRewards}>
                                                    <div className={style.title}>
                                                        Rewards
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
                                                    <Button
                                                        type="link"
                                                        icon={
                                                            <DownOutlined
                                                                rotate={!collapse[0] ? 0 : -180}
                                                                className={style.expandButtonIcon}
                                                            />
                                                        }
                                                        onClick={() => {
                                                            setCollapse({ ...collapse, 0: !collapse[0] });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <Rows collapse={collapse[0]} />
                                        </div>
                                    </Badge.Ribbon>
                                    <Badge.Ribbon
                                        text={
                                            <>
                                                <Space>
                                                    <FireOutlined />
                                                    Double reward
                                                </Space>
                                            </>
                                        }
                                    >
                                        <div className={style.stakeItem}>
                                            <div className={style.stakeMain}>
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
                                                                Free Rate
                                                                <strong>0.05%</strong>
                                                            </Space>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={style.tokenAPY}>
                                                    <div className={style.title}>
                                                        APY(1y)
                                                    </div>
                                                    <div className={style.value}>
                                                        2.05%
                                                        <Tooltip
                                                            placement="bottom"
                                                            title={'The APR value is calculated based on the current data, which changes as the user deposition changes.'}
                                                        >
                                                            <InfoCircleOutlined className={style.tipButton} />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <div className={style.tokenLiquidity}>
                                                    <div className={style.title}>
                                                        Liquidity
                                                    </div>
                                                    <div className={style.value}>
                                                        $300,474.57
                                                        <Tooltip
                                                            placement="bottom"
                                                            title={'The APR value is calculated based on the current data, which changes as the user deposition changes.'}
                                                        >
                                                            <InfoCircleOutlined className={style.tipButton} />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <div className={style.tokenRewardRange}>
                                                    <div className={style.title}>
                                                        Reward Range
                                                    </div>
                                                    <div className={style.value}>
                                                        0.95-1.05
                                                        <Tooltip
                                                            placement="bottom"
                                                            title={'The APR value is calculated based on the current data, which changes as the user deposition changes.'}
                                                        >
                                                            <InfoCircleOutlined className={style.tipButton} />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <div className={style.tokenRewards}>
                                                    <div className={style.title}>
                                                        Rewards
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
                                                    <Button
                                                        type="link"
                                                        icon={
                                                            <DownOutlined
                                                                rotate={!collapse[1] ? 0 : -180}
                                                                className={style.expandButtonIcon}
                                                            />
                                                        }
                                                        onClick={() => {
                                                            setCollapse({ ...collapse, 1: !collapse[1] });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <Rows collapse={collapse[1]} />
                                        </div>
                                    </Badge.Ribbon>
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

export default Farm;
