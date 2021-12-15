import Did from '@/components/Did/did';
import { Card, Col, Divider, Row, Statistic, Typography, Image } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import styles from './style.less';
import { didToHex } from '@/utils/common';

const User: React.FC<{
    avatar: string,
    did: string,
    user: any,
    asset: any,
}> = ({ avatar, did, user, asset }) => {
    const intl = useIntl();

    const { Title } = Typography;

    return (
        <>
            <Card
                className={styles.userCard}
                bodyStyle={{
                    width: '100%',
                }}
            >
                <div className={styles.user}>
                    <Image
                        src={avatar || '/images/logo-round-core.svg'}
                        className={styles.avatar}
                        fallback='/images/logo-round-core.svg'
                        preview={false}
                    />
                    <div className={styles.info}>
                        <Title
                            level={3}
                            className={styles.nickname}
                        >
                            {user?.nickname}
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
