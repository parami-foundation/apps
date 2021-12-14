import { useCallback, useEffect, useState } from 'react';
import { Button, Card, PageHeader, Table, Tooltip, Row, Col, Statistic, Image, Typography } from 'antd';
import { pairs } from './config';
import Rows from './components/Rows';
import { useModel, useIntl } from 'umi';
import { ethers } from 'ethers';
import { contractAddresses } from '@/pages/Dashboard/pages/Stake/config';
import { pairsData } from '@/pages/Dashboard/pages/Stake/config';
import { BigIntToFloatString } from '@/utils/format';
import { getIncentiveId } from './api/parami/util';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { LinkOutlined, RightOutlined } from '@ant-design/icons';
import BigModal from '@/components/ParamiModal/BigModal';
import SelectWallet from '../Bridge/components/selectWallet';
import AddModal from './components/Modal';

const ICON_AD3 = '/images/logo-round-core.svg';
const ICON_ETH = '/images/crypto/ethereum-circle.svg';
const ICON_USDT = '/images/crypto/usdt-circle.svg';
const ICON_USDC = '/images/crypto/usdc-circle.svg';

const { Title } = Typography;

const Stake: React.FC = () => {
    const [AD3Price, setAD3Price] = useState(BigInt(0));
    const [AD3Supply, setSupply] = useState(BigInt(0));
    const [apys, setApys] = useState<any[]>([]);
    const [selectModal, setSelectModal] = useState<boolean>(false);
    const [addModal, setAddModal] = useState<boolean>(false);
    const {
        account,
        ad3Contract,
        stakeContract,
        chainId,
    } = useModel("metaMask");

    const intl = useIntl();

    const handleApproveAd3 = async () => {
        await ad3Contract?.approve(stakeContract?.address, ethers.constants.MaxUint256)
    };

    const fetchIncentive = useCallback(async () => {
        const pools = pairsData;
        if (pools.length) {
            const promises = pools.map(async (pool: any) => {
                // console.log(encode)
                const incentiveKey = {
                    rewardToken: pool.tokenAddresses[chainId],
                    pool: pool.poolAddresses[chainId],
                    startTime: pool.startTime,
                    endTime: pool.endTime,
                }
                console.log(incentiveKey);
                const incentiveId = getIncentiveId(incentiveKey);
                // console.log(incentiveId)
                const incentive = await stakeContract?.incentives(incentiveId);
                console.log('incentive', incentive);
                console.log('pool', pool);
                // console.log(new BigNumber(incentive.totalRewardUnclaimed).dividedBy(new BigNumber(10).pow(15)).toNumber())
                const time = ((Date.now() / 1000) | 0) - pool.startTime;
                // console.log(time)
                const apy = (pool.totalReward - Number(BigIntToFloatString(incentive.totalRewardUnclaimed, 18))) / time * 365 * 24 * 60 * 60 / pool.totalReward * 100;
                // console.log(apy)

                return `${apy > 0 ? apy.toFixed(2) : '0.00'}%`
            })

            const newApys = await Promise.all(promises);
            setApys(newApys);
        }
    }, [stakeContract]);

    useEffect(() => {
        if (!stakeContract) return;
        console.log(account)
        fetchIncentive();
    }, [stakeContract]);

    const columns = [
        {
            title: 'Assets',
            dataIndex: 'name',
            key: 'lp',
            render: (_: string, record: any) => (
                <>
                    <div className={style.tokenPair}>
                        <div className={style.tokenIcon}>
                            {record.token === 'AD3' ? <Image className={style.icon} src={ICON_AD3} preview={false} /> : null}
                            {record.coin === 'ETH' ? <Image className={`${style.icon} ${style.last}`} src={ICON_ETH} preview={false} /> : null}
                            {record.coin === 'USDT' ? <Image className={`${style.icon} ${style.last}`} src={ICON_USDT} preview={false} /> : null}
                            {record.coin === 'USDC' ? <Image className={`${style.icon} ${style.last}`} src={ICON_USDC} preview={false} /> : null}
                        </div>
                        <div className={style.info}>
                            <span className={style.pair}>Uniswap V3: {record.name}</span>
                            <span className={style.range}>Reward Range: $ {record.minPrice}-$ {record.maxPrice}</span>
                        </div>
                    </div>
                </>
            )
        },
        {
            title: 'APY',
            dataIndex: 'apy',
            key: 'apy',
            render: (text: string, record: any) => (
                <strong>{record.apy}</strong>
            )
        },
        {
            title: 'Liquidity',
            dataIndex: 'actions',
            key: 'liquidity',
            render: (text: string, record: any) => (
                <Tooltip title={
                    <>
                        <Title
                            level={5}
                            style={{
                                color: '#fff',
                            }}
                        >
                            {intl.formatMessage({
                                id: 'dashboard.stake.tip.incentiveLiquidity',
                                defaultMessage: 'Incentive Liquidity',
                            })}
                        </Title>
                        <small>Fee tier: 0.3%</small>
                        <br />
                        <small>Price Range: $ {record.minPrice} - $ {record.maxPrice}</small>
                    </>
                }>
                    <Button
                        size='large'
                        shape='round'
                        type='primary'
                        onClick={() => {
                            window.open(
                                `https://app.uniswap.org/#/add/${record.coin === 'ETH'
                                    ? 'ETH'
                                    : record.coinAddress}/${record.tokenAddress}/3000`
                            )
                        }}
                    >
                        Add
                    </Button>
                </Tooltip>
            ),
        },
        // { title: '', dataIndex: '', key: 'expand', width: 1 },
    ]

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.contentContainer}>
                    <Card
                        style={{
                            padding: 0,
                        }}
                        bodyStyle={{
                            padding: 0,
                            width: '100%',
                        }}
                        className={styles.dashboardCard}
                    >
                        {account ? (
                            <div className={styles.windowCardBody}>
                                <PageHeader
                                    ghost={false}
                                    title={intl.formatMessage({
                                        id: 'dashboard.bridge.overview',
                                        defaultMessage: 'Overview',
                                    })}
                                    extra={[
                                        <Button
                                            shape='round'
                                            type='primary'
                                            size='large'
                                            onClick={() => {
                                                window.open(`https://app.uniswap.org/#/swap?outputCurrency=${contractAddresses.ad3[chainId]}`);
                                            }}
                                        >
                                            {intl.formatMessage({
                                                id: 'dashboard.bridge.exchangeAD3',
                                                defaultMessage: 'Exchange AD3',
                                            })}
                                        </Button>,
                                    ]}
                                />
                                <div className={style.statistic}>
                                    <Row
                                        gutter={[16, 16]}
                                        style={{
                                            width: '100%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                            <Statistic
                                                title={intl.formatMessage({
                                                    id: 'pages.uniswap.totalSupply',
                                                    defaultMessage: 'Total Supply',
                                                })}
                                                value={99938.75}
                                            />
                                        </Col>
                                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                            <Statistic
                                                title={intl.formatMessage({
                                                    id: 'pages.uniswap.tvl',
                                                    defaultMessage: 'TVL',
                                                })}
                                                prefix={'$'}
                                                value={37523.80}
                                            />
                                        </Col>
                                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                            <Statistic
                                                title={intl.formatMessage({
                                                    id: 'pages.uniswap.ad3CurrentPrice',
                                                    defaultMessage: 'AD3 Current Price',
                                                })}
                                                prefix={'$'}
                                                value={0.000000000000308402}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <Table
                                    expandIconColumnIndex={columns.length}
                                    bordered={false}
                                    columns={columns}
                                    dataSource={pairs(4, apys)}
                                    pagination={false}
                                    expandIcon={({ expanded, onExpand, record }) => (
                                        <RightOutlined
                                            key={record.name}
                                            onClick={(e) => onExpand(record, e)}
                                            rotate={!expanded ? 0 : 90}
                                        />
                                    )}
                                    expandable={{
                                        expandedRowRender: (record, i) => (
                                            <Rows
                                                key={i}
                                                row={record}
                                            />
                                        ),
                                    }}
                                />
                            </div>
                        ) : (
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
                        )}
                    </Card>
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
            <BigModal
                visable={addModal}
                title={intl.formatMessage({
                    id: 'dashboard.stake.addLiquidity',
                    defaultMessage: 'Add Liquidity',
                })}
                content={
                    <AddModal />
                }
                footer={false}
                close={() => setAddModal(false)}
            />
        </>
    )
}

export default Stake
