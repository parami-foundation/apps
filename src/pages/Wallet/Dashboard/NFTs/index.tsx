import { Button } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useIntl } from 'umi';
import style from './style.less';

const NFTs: React.FC = () => {
    const [coverWidth, setCoverWidth] = React.useState(0);
    const intl = useIntl();

    const coverRef: any = useRef();

    useEffect(() => {
        setCoverWidth(coverRef.current.clientWidth);
    }, [coverRef]);

    return (
        <div className={style.nftsContainer}>
            {/* <div className={style.noNFTs}>
                <img
                    src={'/images/icon/query.svg'}
                    className={style.topImage}
                />
                <div className={style.description}>
                    {intl.formatMessage({
                        id: 'wallet.nfts.empty',
                    })}
                </div>
                <div className={style.buttons}>
                    <Row
                        gutter={[8, 8]}
                        className={style.buttonRow}
                    >
                        <Col span={12}>
                            <Button
                                block
                                type='primary'
                                shape='round'
                                size='large'
                                className={style.button}
                            >
                                {intl.formatMessage({
                                    id: 'wallet.nfts.create',
                                })}
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                block
                                type='primary'
                                shape='round'
                                size='large'
                                className={style.button}
                            >
                                {intl.formatMessage({
                                    id: 'wallet.nfts.import',
                                })}
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div> */}
            <div className={style.nftsList}>
                <div className={style.nftItem}>
                    <div className={style.card}>
                        <div className={style.cardWrapper}>
                            <div className={style.cardBox}>
                                <div
                                    className={style.cover}
                                    ref={coverRef}
                                    style={{
                                        backgroundImage: 'url(https://manofmany.com/wp-content/uploads/2021/09/What-is-an-NFT-1.jpg)',
                                        height: coverWidth,
                                    }}
                                >
                                    <div className={style.nftID}>
                                        #13
                                    </div>
                                </div>
                                <div
                                    className={style.filterImage}
                                />
                                <div className={style.cardDetail}>
                                    <h3 className={style.text}>
                                        MOBLAND Mystery Box
                                    </h3>
                                    <div className={style.status}>
                                        <div className={style.label}>
                                            {intl.formatMessage({
                                                id: 'wallet.nfts.status',
                                                defaultMessage: 'Status',
                                            })}
                                        </div>
                                        <div className={style.value}>
                                            Rasing
                                        </div>
                                    </div>
                                    <div className={style.action}>
                                        <Button
                                            block
                                            type='primary'
                                            shape='round'
                                            size='middle'
                                            disabled
                                        >
                                            {intl.formatMessage({
                                                id: 'wallet.nfts.mint',
                                                defaultMessage: 'Mint',
                                            })}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.nftItem}>
                    <div className={style.card}>
                        <div className={style.cardWrapper}>
                            <div className={style.cardBox}>
                                <div
                                    className={style.cover}
                                    ref={coverRef}
                                    style={{
                                        backgroundImage: 'url(https://manofmany.com/wp-content/uploads/2021/09/What-is-an-NFT-1.jpg)',
                                        height: coverWidth,
                                    }}
                                >
                                    <div className={style.nftID}>
                                        #13
                                    </div>
                                </div>
                                <div
                                    className={style.filterImage}
                                />
                                <div className={style.cardDetail}>
                                    <h3 className={style.text}>
                                        MOBLAND Mystery Box
                                    </h3>
                                    <div className={style.status}>
                                        <div className={style.label}>
                                            {intl.formatMessage({
                                                id: 'wallet.nfts.status',
                                                defaultMessage: 'Status',
                                            })}
                                        </div>
                                        <div className={style.value}>
                                            Can Mint
                                        </div>
                                    </div>
                                    <div className={style.action}>
                                        <Button
                                            block
                                            type='primary'
                                            shape='round'
                                            size='middle'
                                        >
                                            {intl.formatMessage({
                                                id: 'wallet.nfts.mint',
                                                defaultMessage: 'Mint',
                                            })}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.nftItem}>
                    <div className={style.card}>
                        <div className={style.cardWrapper}>
                            <div className={style.cardBox}>
                                <div
                                    className={style.cover}
                                    ref={coverRef}
                                    style={{
                                        backgroundImage: 'url(https://manofmany.com/wp-content/uploads/2021/09/What-is-an-NFT-1.jpg)',
                                        height: coverWidth,
                                    }}
                                >
                                    <div className={style.nftID}>
                                        #13
                                    </div>
                                </div>
                                <div
                                    className={style.filterImage}
                                />
                                <div className={style.cardDetail}>
                                    <h3 className={style.text}>
                                        MOBLAND Mystery Box
                                    </h3>
                                    <div className={style.status}>
                                        <div className={style.label}>
                                            {intl.formatMessage({
                                                id: 'wallet.nfts.status',
                                                defaultMessage: 'Status',
                                            })}
                                        </div>
                                        <div className={style.value}>
                                            Can Mint
                                        </div>
                                    </div>
                                    <div className={style.action}>
                                        <Button
                                            block
                                            type='primary'
                                            shape='round'
                                            size='middle'
                                        >
                                            {intl.formatMessage({
                                                id: 'wallet.nfts.gotoNFTDAO',
                                                defaultMessage: 'NFT DAO',
                                            })}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NFTs;
