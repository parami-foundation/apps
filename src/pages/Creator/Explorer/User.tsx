import Did from '@/components/Did/did';
import { Card, Col, Divider, Row, Statistic, Typography, Image } from 'antd';
import React from 'react';
import { useIntl, useModel } from 'umi';
import styles from './style.less';
import { didToHex } from '@/utils/common';

const User: React.FC<{
    avatar: string;
    did: string;
    user: any;
    nftID: string;
    asset: any;
}> = ({ avatar, did, user, nftID, asset }) => {
    const { nftMap } = useModel('nft');

    const intl = useIntl();

    const { Title } = Typography;

    return (
        <>
            <Divider>
                <strong
                    style={{
                        opacity: .5,
                    }}
                >
                    {intl.formatMessage({
                        id: 'creator.explorer.aboutDao',
                        defaultMessage: 'About {name} DAO',
                    }, {
                        name: user?.nickname,
                    })}
                </strong>
            </Divider>
            <Card
                className={styles.userCard}
                bodyStyle={{
                    width: '100%',
                }}
            >
                <div className={styles.user}>
                    <Image
                        src={nftMap.get(nftID)?.tokenURI || avatar}
                        className={styles.avatar}
                        fallback='/images/logo-round-core.svg'
                        preview={false}
                    />
                    <div className={styles.info}>
                        <Title
                            level={3}
                            className={styles.nickname}
                        >
                            {user?.nickname.toString()}
                        </Title>
                        <Did did={didToHex(did)} />
                        {asset && (
                            <>
                                <Divider />
                                <div className={styles.assetsData}>

                                    <Row
                                        gutter={16}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-around',
                                            width: '100%',
                                        }}
                                    >
                                        <Col span={24}>
                                            <Statistic
                                                title={intl.formatMessage({
                                                    id: 'creator.explorer.coinName',
                                                })}
                                                prefix="$"
                                                value={asset?.name}
                                                valueStyle={{
                                                    textAlign: 'center',
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </>
    )
}

export default User;
