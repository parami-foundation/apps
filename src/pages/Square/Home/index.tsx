import React, { useRef } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { Avatar, Col, Row } from 'antd';
import { useEffect } from 'react';
import { DollarOutlined } from '@ant-design/icons';

const Home: React.FC = () => {
    const [cardWidth, setCardWidth] = React.useState(0);
    const intl = useIntl();

    const cardRef: any = useRef();

    useEffect(() => {
        setCardWidth(cardRef.current.clientWidth);
    }, [cardRef]);

    return (
        <div className={styles.mainTopContainer}>
            <div className={style.squareContainer}>
                <div className={style.pageHeader}>
                    <img
                        src={"/images/icon/square.svg"}
                        className={style.pageHeaderIcon}
                    />
                    {intl.formatMessage({
                        id: 'wallet.square.title',
                        defaultMessage: 'Square',
                    })}
                </div>
                <Row
                    gutter={[16, 16]}
                    className={style.squareRow}
                >
                    <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                        <div
                            className={style.card}
                            ref={cardRef}
                            style={{
                                height: cardWidth * 16 / 9,
                            }}
                        >
                            <Avatar
                                size="large"
                                className={style.avatar}
                                src={'/images/logo-square-core.svg'}
                                alt="avatar"
                            />
                            <div className={style.mask} />
                            <div
                                className={style.background}
                                style={{
                                    backgroundImage: 'url(https://ipfs.parami.io/ipfs/QmYor8dfYFZEw1mknsh32LUA1rLCPhTUyHYeNH28mmKN6B)',
                                }}
                            />
                            <div className={style.tokenName}>$AD3</div>
                            <div className={style.info}>
                                <div className={style.tokenPrice}>
                                    <DollarOutlined className={style.tokenPriceIcon} />
                                    30 $AD3
                                </div>
                                <div className={style.tokenOwner}>
                                    Hikaru Nakamura
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Home;