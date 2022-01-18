import React, { useState } from 'react';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { Button, Card, Image, Tooltip } from 'antd';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Rows from './Rows';
const ICON_AD3 = '/images/logo-round-core.svg';

const PairItem: React.FC<{
    logo: string;
}> = ({ logo }) => {
    const [Collapse, setCollapse] = useState<boolean>(true);

    return (
        <>
            <div className={style.stakeItem}>
                <Card
                    className={styles.card}
                    bodyStyle={{
                        padding: 15,
                        width: '100%',
                    }}
                >

                    <div className={style.stakeMain}>
                        <div className={style.stakeInfo}>
                            <div className={style.tokenPair}>
                                <div className={style.tokenIcons}>
                                    <Image
                                        src={ICON_AD3}
                                        preview={false}
                                        className={style.icon}
                                    />
                                    <Image
                                        src={logo}
                                        preview={false}
                                        className={style.icon}
                                    />
                                </div>
                                <div className={style.tokenNameAndRate}>
                                    <div className={style.tokenName}>
                                        ETH-AD3
                                    </div>
                                </div>
                            </div>
                            <div className={style.tokenLiquidity}>
                                <div className={style.title}>
                                    Total Liquidity(AD3)
                                </div>
                                <div className={style.value}>
                                    21.321
                                    <Tooltip
                                        placement="bottom"
                                        title={'The liquidity value is an estimation that only calculates the liquidity lies in the reward range.'}
                                    >
                                        <InfoCircleOutlined className={style.tipButton} />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <div className={style.expandButton}>
                            <Button
                                type="link"
                                icon={
                                    <DownOutlined
                                        rotate={!Collapse ? 0 : -180}
                                        className={style.expandButtonIcon}
                                    />
                                }
                                onClick={() => {
                                    setCollapse(prev => !prev);
                                }}
                            />
                        </div>
                    </div>
                    <Rows
                        collapse={Collapse}
                    />
                </Card>
            </div>
        </>
    )
}

export default PairItem;
