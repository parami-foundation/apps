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
          {intl.formatMessage({
            id: 'square.title',
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
                src={'/images/demo/demo.png'}
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
                src={'/images/demo/demo1.jpg'}
                alt="avatar"
              />
              <div className={style.mask} />
              <div
                className={style.background}
                style={{
                  backgroundImage: 'url(/images/demo/bg1.jpg)',
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
                src={'/images/demo/demo4.jpg'}
                alt="avatar"
              />
              <div className={style.mask} />
              <div
                className={style.background}
                style={{
                  backgroundImage: 'url(/images/demo/bg2.jpg)',
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
                src={'/images/demo/demo2.png'}
                alt="avatar"
              />
              <div className={style.mask} />
              <div
                className={style.background}
                style={{
                  backgroundImage: 'url(/images/demo/bg3.jpg)',
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