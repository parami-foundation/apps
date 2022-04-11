import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Button, Col, Input, InputNumber, Row, Alert, notification, message } from 'antd';
import classNames from 'classnames';
import { didToHex, formatWithoutUint, parseAmount } from '@/utils/common';
import Marquee from 'react-fast-marquee';
import { BidSlot, GetSlotAdOf, GetSlotsOf, GetValueOf } from '@/services/parami/dashboard';
import config from '@/config/config';
import { formatBalance } from '@polkadot/util';
import { GetUserInfo } from '@/services/parami/Info';
import { GetAssetInfo, GetNFTMetaData, GetPreferedNFT } from '@/services/parami/nft';

const CurrentAccount = localStorage.getItem('dashboardCurrentAccount') as string;

const Avatar: React.FC<{
    did: string,
}> = ({ did }) => {
    const apiWs = useModel('apiWs');
    const [avatar, setAvatar] = useState<string>();

    const getInfo = async () => {
        const info = await GetUserInfo(did);

        if (info?.avatar?.indexOf('ipfs://') > -1) {
            const hash = info?.avatar?.substring(7);

            setAvatar(config.ipfs.endpoint + hash)
        }
    }

    useEffect(() => {
        if (apiWs) {
            getInfo();
        }
    }, [apiWs]);

    return (
        <>
            <Col xs={12} sm={12} md={12} lg={6} xl={6}
                onClick={() => {
                    window.open(`${window.location.origin}/creator/${did}`);
                }}
            >
                <div className={style.avatar}>
                    <img src={avatar || '/images/logo-square-core.svg'} />
                </div>
            </Col>
        </>
    )
}

const List: React.FC<{
    slotsOf: any[],
}> = ({ slotsOf }) => {
    const intl = useIntl();

    return (
        <div className={styles.field}>
            {!slotsOf.length && (
                <div className={styles.noAssets}>
                    <img
                        src={'/images/icon/query.svg'}
                        className={styles.topImage}
                    />
                    <span>
                        {intl.formatMessage({
                            id: 'dashboard.ads.slot.empty',
                        })}
                    </span>
                </div>
            )}
            <Row gutter={[16, 16]}>
                {slotsOf.length && slotsOf?.map((id) => {
                    GetNFTMetaData(id).then((nftInfoData) => {
                        const nftInfo: any = nftInfoData?.toHuman();
                        return (
                            <Avatar did={nftInfo?.owner} />
                        )
                    })
                }
                )}
            </Row>
        </div>
    )
}

const Add: React.FC<{
    adItem: any,
    setLaunchModal: React.Dispatch<React.SetStateAction<boolean>>,
}> = ({ adItem, setLaunchModal }) => {
    const [did, setDid] = useState<string>();
    const [nftInfo, setNftInfo] = useState<any>({});
    const [nftId, setNftId] = useState<string>();
    const [assetInfo, setAssetInfo] = useState<any>({});
    const [price, setPrice] = useState<number>();
    const [currentAccount, setCurrentAccount] = useState<any[]>([]);
    const [currentAd, setCurrentAd] = useState<any>({});
    const [assetsID, setAssetsID] = useState<string>('');
    const [valueOfAD3, setValueOfAD3] = useState<string>('');

    const intl = useIntl();
    const { Search } = Input;

    const queryDid = async () => {
        const didHexString = didToHex(did as string);

        const nftID = await GetPreferedNFT(didHexString);
        if (nftID.isEmpty) {
            notification.error({
                key: 'userNotFound',
                message: intl.formatMessage({
                    id: 'error.identity.notFound',
                }),
                duration: null,
            });
            return;
        };
        const nftMetadataRaw = await GetNFTMetaData(nftID.toString());
        const nftMetadata: any = nftMetadataRaw?.toHuman();
        if (nftMetadataRaw.isEmpty || !nftMetadata?.minted) {
            notification.error({
                message: intl.formatMessage({
                    id: 'error.nft.notFound',
                }),
                duration: null,
            });
            return;
        };
        const assetDataRaw = await GetAssetInfo(nftMetadata?.tokenAssetId);
        const assetData: any = assetDataRaw?.toHuman();
        if (assetDataRaw.isEmpty) {
            notification.error({
                message: intl.formatMessage({
                    id: 'error.nft.notFound',
                }),
                duration: null,
            });
            return;
        }
        console.log(assetData)
        setNftId(nftID.toString());
        setNftInfo(nftMetadata);
        setAssetInfo(assetData);
    };

    const getSlotAdOf = async () => {
        const didHexString = didToHex(did as string);
        try {
            const ad = await GetSlotAdOf(didHexString);
            if (ad?.ad) {
                setCurrentAd(ad);
                await getValueOf(ad);
            }
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
            return;
        }
    };

    const getValueOf = async (ad: any) => {
        const res = await GetValueOf(assetsID, ad?.remain.toString().replaceAll(',', ''));
        setValueOfAD3(formatWithoutUint(res));
    };

    const handleSubmit = async () => {
        const didHexString = didToHex(did as string);

        try {
            await BidSlot(adItem.id, didHexString, parseAmount((price as number).toString()), currentAccount);
            setLaunchModal(false);
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
            return;
        }
    };

    return (
        <>
            <div
                className={styles.modalBody}
            >
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.ads.launch.did',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Search
                            key={nftInfo?.id}
                            size='large'
                            className="tag-input"
                            enterButton={intl.formatMessage({
                                id: 'common.confirm',
                            })}
                            onChange={(e) => {
                                setDid(e.target.value);
                            }}
                            onSearch={async () => {
                                if (!did) {
                                    message.error('Please Input DID');
                                    return;
                                }
                                await queryDid();
                            }}
                            placeholder={'did:ad3:......'}
                            value={did}
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.ads.launch.nftID',
                        })} *
                    </div>
                    <div className={styles.value}>
                        <Input
                            size='large'
                            onChange={(e) => {
                                setNftId(e.target.value);
                            }}
                            value={nftId}
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.ads.launch.currentPrice',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Input
                            readOnly
                            disabled
                            size='large'
                            value={`${formatBalance(currentAd?.remain, { withUnit: nftInfo.symbol }, 18)} ≈ ${valueOfAD3} AD3`}
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.ads.launch.offer',
                        })}
                        <br />
                        <small>
                            {intl.formatMessage({
                                id: 'dashboard.ads.launch.offer.tip',
                            })}
                        </small>
                    </div>
                    <div className={styles.value}>
                        <InputNumber
                            value={price}
                            className={styles.withAfterInput}
                            placeholder={(Number(valueOfAD3) * 1.2).toString()}
                            size='large'
                            type='number'
                            min={Number(valueOfAD3) * 1.2}
                            onChange={(e) => { setPrice(e) }}
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <Alert
                        banner
                        message={
                            <Marquee pauseOnHover gradient={false}>
                                {intl.formatMessage({
                                    id: 'dashboard.ads.launch.tip',
                                })}
                            </Marquee>
                        }
                    />
                </div>
                <div className={styles.field}>
                    <Button
                        block
                        type="primary"
                        shape="round"
                        size="large"
                        className={styles.button}
                        onClick={() => { queryDid() }}
                    >
                        {intl.formatMessage({
                            id: 'common.submit',
                        })}
                    </Button>
                </div>
                {/* {!isUser && (
                    <>
                        <div className={styles.field}>
                            <div className={styles.title}>
                                {intl.formatMessage({
                                    id: 'dashboard.ads.launch.did',
                                })}
                            </div>
                            <div className={styles.value}>
                                <Input
                                    size='large'
                                    onChange={(e) => (
                                        setDid(e.target.value)
                                    )}
                                    value={did}
                                />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <Button
                                block
                                type="primary"
                                shape="round"
                                size="large"
                                className={styles.button}
                                onClick={() => { queryDid() }}
                            >
                                {intl.formatMessage({
                                    id: 'common.submit',
                                })}
                            </Button>
                        </div>
                    </>
                )}
                {isUser && haveOffer && (
                    <>
                        <div className={styles.field}>
                            <div className={styles.title}>
                                {intl.formatMessage({
                                    id: 'dashboard.ads.launch.did',
                                })}
                            </div>
                            <div className={styles.value}>
                                <Input
                                    readOnly
                                    disabled
                                    size='large'
                                    value={did}
                                />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.title}>
                                {intl.formatMessage({
                                    id: 'dashboard.ads.launch.currentPrice',
                                })}
                            </div>
                            <div className={styles.value}>
                                <Input
                                    readOnly
                                    disabled
                                    size='large'
                                    value={`${formatBalance(currentAd?.remain, { withUnit: NftInfo.symbol }, 18)} ≈ ${valueOfAD3} AD3`}
                                />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.title}>
                                {intl.formatMessage({
                                    id: 'dashboard.ads.launch.offer',
                                })}
                                <br />
                                <small>
                                    {intl.formatMessage({
                                        id: 'dashboard.ads.launch.offer.tip',
                                    })}
                                </small>
                            </div>
                            <div className={styles.value}>
                                <InputNumber
                                    value={price}
                                    className={styles.withAfterInput}
                                    placeholder={(Number(valueOfAD3) * 1.2).toString()}
                                    size='large'
                                    type='number'
                                    min={Number(valueOfAD3) * 1.2}
                                    onChange={(e) => { setPrice(e) }}
                                />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <Alert
                                banner
                                message={
                                    <Marquee pauseOnHover gradient={false}>
                                        {intl.formatMessage({
                                            id: 'dashboard.ads.launch.tip',
                                        })}
                                    </Marquee>
                                }
                            />
                        </div>
                        <div className={styles.field}>
                            <Button
                                block
                                type="primary"
                                shape="round"
                                size="large"
                                className={styles.button}
                                onClick={() => { handleSubmit() }}
                            >
                                {intl.formatMessage({
                                    id: 'common.submit',
                                })}
                            </Button>
                        </div>
                    </>
                )}

                {isUser && !haveOffer && (
                    <>
                        <div className={styles.field}>
                            <div className={styles.title}>
                                {intl.formatMessage({
                                    id: 'dashboard.ads.launch.did',
                                })}
                            </div>
                            <div className={styles.value}>
                                <Input
                                    readOnly
                                    disabled
                                    size='large'
                                    value={did}
                                />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.title}>
                                {intl.formatMessage({
                                    id: 'dashboard.ads.launch.offer',
                                })}
                                <br />
                                <small>
                                    {intl.formatMessage({
                                        id: 'dashboard.ads.launch.offer.tip',
                                    })}
                                </small>
                            </div>
                            <div className={styles.value}>
                                <InputNumber
                                    className={styles.withAfterInput}
                                    placeholder="0.00"
                                    size='large'
                                    type='number'
                                    min={0}
                                    value={price}
                                    onChange={(e) => { setPrice(e) }}
                                />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <Alert
                                banner
                                message={
                                    <Marquee pauseOnHover gradient={false}>
                                        {intl.formatMessage({
                                            id: 'dashboard.ads.launch.tip',
                                        })}
                                    </Marquee>
                                }
                            />
                        </div>
                        <div className={styles.field}>
                            <Button
                                block
                                type="primary"
                                shape="round"
                                size="large"
                                className={styles.button}
                                onClick={() => { handleSubmit() }}
                            >
                                {intl.formatMessage({
                                    id: 'common.submit',
                                })}
                            </Button>
                        </div>
                    </>
                )} */}
            </div>
        </>
    )
}

const Launch: React.FC<{
    adItem: any,
    setLaunchModal: React.Dispatch<React.SetStateAction<boolean>>,
}> = ({ adItem, setLaunchModal }) => {
    const apiWs = useState('apiWs');
    const [tab, setTab] = useState('add');
    const [slotsOf, setSlotsOf] = useState<any>({});

    const getSlotsAdOf = async (adID: string) => {
        try {
            const res = await GetSlotsOf(adID);
            setSlotsOf(res);
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
            return;
        }
    };

    const intl = useIntl();

    useEffect(() => {
        if (apiWs) {
            getSlotsAdOf(adItem.id);
        }
    }, [apiWs]);

    return (
        <>
            <div className={styles.tabSelector}>
                <div
                    className={classNames(styles.tabItem, tab === 'add' ? '' : styles.inactive)}
                    onClick={() => setTab('add')}
                >
                    {intl.formatMessage({
                        id: 'dashboard.ads.launch.add',
                        defaultMessage: 'Add',
                    })}
                </div>
                <div
                    className={classNames(styles.tabItem, tab === 'list' ? '' : styles.inactive)}
                    onClick={() => setTab('list')}
                >
                    {intl.formatMessage({
                        id: 'dashboard.ads.launch.list',
                    })}
                </div>
            </div>
            <div
                className={styles.modalBody}
                style={{
                    padding: 24,
                    width: '100%',
                }}
            >
                {tab === 'add' && (
                    <Add adItem={adItem} setLaunchModal={setLaunchModal} />
                )}
                {tab === 'list' && (
                    <List slotsOf={slotsOf} />
                )}
            </div>
        </>
    )
}

export default Launch;
