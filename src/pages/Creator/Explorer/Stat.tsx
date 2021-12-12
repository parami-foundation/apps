import { Card, Col, Row, Statistic, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import Token from '@/components/Token/Token';
import AD3 from '@/components/Token/AD3';

const { Title } = Typography;

const Stat: React.FC<{
    asset: any,
    assetPrice: string,
    totalSupply: bigint,
    viewer: any,
    member: any,
}> = ({ asset, assetPrice, totalSupply, viewer, member }) => {
    const intl = useIntl();

    return (
        <>
            <Title
                level={5}
                style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10,
                }}
                className={styles.title}
            >
                {intl.formatMessage({
                    id: 'creator.explorer.stat',
                })}
            </Title>
            <Card
                className={styles.card}
                bodyStyle={{
                    width: '100%',
                }}
            >
                <div className={style.stat}>
                    <Row gutter={[16, 16]}>
                        <Col xs={12} sm={12} md={8} lg={8} xl={4}>
                            <Statistic
                                title={'1 ' + asset?.symbol}
                                formatter={() => (<AD3 value={assetPrice} />)}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={8} lg={8} xl={4}>
                            <Statistic
                                title={intl.formatMessage({
                                    id: 'creator.explorer.totalIssues',
                                })}
                                formatter={() => (<Token value={totalSupply.toString()} symbol={asset?.symbol} />)}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={8} lg={8} xl={4}>
                            <Statistic
                                title={intl.formatMessage({
                                    id: 'creator.explorer.totalValue',
                                })}
                                formatter={() => (<AD3 value={(BigInt(assetPrice) * BigInt(3000000)).toString()} />)}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={8} lg={8} xl={4}>
                            <Statistic
                                title={intl.formatMessage({
                                    id: 'creator.explorer.reservedValue',
                                })}
                                formatter={() => (<AD3 value={(BigInt(assetPrice) * BigInt(1000000)).toString()} />)}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={8} lg={8} xl={4}>
                            <Statistic
                                title={intl.formatMessage({
                                    id: 'creator.explorer.members',
                                })}
                                value={member?.length}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={8} lg={8} xl={4}>
                            <Statistic
                                title={intl.formatMessage({
                                    id: 'creator.explorer.viewers',
                                })}
                                value={viewer}
                            />
                        </Col>
                    </Row>
                </div>
            </Card>
        </>
    )
}

export default Stat;
