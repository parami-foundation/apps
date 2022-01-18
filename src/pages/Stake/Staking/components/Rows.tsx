import React from 'react';
import { useIntl } from 'umi';
import style from '../style.less';
import { Divider, Space, Image, Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

const Rows: React.FC<{
    collapse: boolean;
}> = ({ collapse }) => {
    const intl = useIntl();

    return (
        <>
            <div
                className={style.rowsContainer}
                style={{
                    maxHeight: collapse ? '100vh' : 0,
                }}
            >
                <Divider />
                <div className={style.rowsContentContainer}>
                    <div className={style.nftList}>
                        <div className={style.nftItem}>
                            <div className={style.nftInfo}>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        {intl.formatMessage({
                                            id: 'stake.nftList.nftID',
                                            defaultMessage: 'NFTId',
                                        })}
                                    </div>
                                    <div className={style.value}>
                                        <Space>
                                            <LinkOutlined /> 123
                                        </Space>
                                    </div>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        Liquidity
                                    </div>
                                    <div className={style.value}>
                                        12
                                    </div>
                                </div>
                            </div>
                            <div className={style.nftButtons}>
                                <div className={style.nftReward}>
                                    <div className={style.nftItemBlock}>
                                        <div className={style.title}>
                                            Reward(AD3)
                                        </div>
                                        <div className={style.value}>
                                            123
                                        </div>
                                    </div>
                                    <Button
                                        size='middle'
                                        shape='round'
                                        type='primary'
                                        onClick={() => handleClaim(item.tokenId, rewards.filter((reward) => { return reward.tokenId === item.tokenId })[0]?.reward, item.incentiveIndex)}
                                    >
                                        Harvest
                                    </Button>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <Button
                                        danger
                                        size='middle'
                                        shape='round'
                                        type='primary'
                                        className={style.stakeButton}
                                        onClick={() => handleUnstake(item.tokenId, item.incentiveIndex)}
                                    >
                                        Unstake
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className={style.nftItem}>
                            <div className={style.nftInfo}>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        {intl.formatMessage({
                                            id: 'stake.nftList.nftID',
                                            defaultMessage: 'NFTId',
                                        })}
                                    </div>
                                    <div className={style.value}>
                                        <Space>
                                            <LinkOutlined /> 123
                                        </Space>
                                    </div>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <div className={style.title}>
                                        Liquidity
                                    </div>
                                    <div className={style.value}>
                                        12
                                    </div>
                                </div>
                            </div>
                            <div className={style.nftButtons}>
                                <div className={style.nftReward}>
                                    <div className={style.nftItemBlock}>
                                        <div className={style.title}>
                                            Reward(AD3)
                                        </div>
                                        <div className={style.value}>
                                            123
                                        </div>
                                    </div>
                                    <Button
                                        size='middle'
                                        shape='round'
                                        type='primary'
                                        onClick={() => handleClaim(item.tokenId, rewards.filter((reward) => { return reward.tokenId === item.tokenId })[0]?.reward, item.incentiveIndex)}
                                    >
                                        Harvest
                                    </Button>
                                </div>
                                <div className={style.nftItemBlock}>
                                    <Button
                                        danger
                                        size='middle'
                                        shape='round'
                                        type='primary'
                                        className={style.stakeButton}
                                        onClick={() => handleUnstake(item.tokenId, item.incentiveIndex)}
                                    >
                                        Unstake
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Rows;
