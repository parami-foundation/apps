/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Button, Col, Input, InputNumber, message, Row, Alert, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { didToHex, formatWithoutUint, hexToDid, parseAmount } from '@/utils/common';
import loadImg from '@/utils/decode';
import Marquee from 'react-fast-marquee';
import { BidSlot, GetAssetInfo, GetSlotAdOf, GetSlotsOf, GetValueOf } from '@/services/parami/dashboard';
import config from '@/config/config';
import { formatBalance } from '@polkadot/util';
import { GetNFTMetaStore, GetUserInfo } from '@/services/parami/nft';

const { Dragger } = Upload;

const CurrentAccount = localStorage.getItem('dashboardCurrentAccount') as string;

const Message: React.FC<{
    content: string;
}> = ({ content }) => (
    <Alert
        style={{
            marginBottom: 24,
        }}
        message={content}
        type="error"
        showIcon
    />
);

const Avatar: React.FC<{
    did: string,
}> = ({ did }) => {
    const apiWs = useModel('apiWs');
    const [avatar, setAvatar] = useState<string>();

    const getInfo = async () => {
        //TODO: check it
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
                    window.open(`https://wallet.parami.io/creator/${did}`);
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
    setErrorState: React.Dispatch<React.SetStateAction<API.Error>>,
}> = ({ slotsOf, setErrorState }) => {
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
                    GetNFTMetaStore(id).then((res) => (
                        <Avatar did={res?.owner} />
                    ))
                }
                )}
            </Row>
        </div>
    )
}

const Add: React.FC<{
    setErrorState: React.Dispatch<React.SetStateAction<API.Error>>,
    adItem: any,
    setLaunchModal: React.Dispatch<React.SetStateAction<boolean>>,
}> = ({ setErrorState, adItem, setLaunchModal }) => {
    const [did, setDid] = useState<string>();
    const [isUser, setIsUser] = useState<boolean>(false);
    const [haveOffer, setHaveOffer] = useState<boolean>(false);
    const [price, setPrice] = useState<number>();
    const [currentAccount, setCurrentAccount] = useState<any[]>([]);
    const [currentAd, setCurrentAd] = useState<any>({});
    const [NftInfo, setNftInfo] = useState<Record<string, any>>({});
    const [assetsID, setAssetsID] = useState<string>('');
    const [valueOfAD3, setValueOfAD3] = useState<string>('');

    const intl = useIntl();

    const onChange = async (info: any) => {
        if (info.event) {
            loadImg(URL.createObjectURL(info.file.originFileObj))
                .then((result) => {
                    if (result === 'error') {
                        message.error(
                            intl.formatMessage({
                                id: 'error.decodeDidFromImg.notFound',
                            })
                        );
                        return;
                    }
                    setDid(`${hexToDid(result)}`);
                });
        }
    };

    const getValueOf = async (ad: any) => {
        const res = await GetValueOf(assetsID, ad?.remain.toString().replaceAll(',', ''));
        setValueOfAD3(formatWithoutUint(res));
    };

    const getSlotAdOf = async () => {
        const didHexString = didToHex(did as string);
        try {
            const ad = await GetSlotAdOf(didHexString);
            if (ad?.ad) {
                setCurrentAd(ad);
                await getValueOf(ad);
                setHaveOffer(true);
            }
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    };

    const queryDid = async () => {
        const didHexString = didToHex(did as string);

        GetUserInfo(didHexString).then(async (res: any) => {
            if (res.isEmpty) {
                message.error(
                    intl.formatMessage({
                        id: 'error.account.notFound',
                    }),
                );
                return;
            } else {
                const user = res.toHuman() as any;
                if (user.nft !== null) {
                    setIsUser(true);
                    await getSlotAdOf();
                    setCurrentAccount(JSON.parse(CurrentAccount));
                    setAssetsID(user.nft);
                    const nftInfo = await GetAssetInfo(user.nft);
                    setNftInfo(nftInfo.toHuman());
                } else {
                    message.error(
                        intl.formatMessage({
                            id: 'error.account.notKOL',
                        }),
                    );
                    return;
                };
            }
        });
    };

    const handleSubmit = async () => {
        const didHexString = didToHex(did as string);

        try {
            await BidSlot(adItem.id, didHexString, parseAmount((price as number).toString()), currentAccount);
            setLaunchModal(false);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    };

    return (
        <>
            <div
                className={styles.modalBody}
            >
                {!isUser && (
                    <>
                        <div className={styles.field}>
                            <Dragger
                                accept="image/*"
                                showUploadList={false}
                                onChange={onChange}
                            >
                                <div
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">
                                        {intl.formatMessage({
                                            id: 'dashboard.ads.launch.upload.title',
                                        })}
                                    </p>
                                    <p className="ant-upload-hint">
                                        {intl.formatMessage({
                                            id: 'dashboard.ads.launch.upload.desc',
                                        })}
                                    </p>
                                </div>
                            </Dragger>
                        </div>
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
                )}
            </div>
        </>
    )
}

const Launch: React.FC<{
    adItem: any,
    setLaunchModal: React.Dispatch<React.SetStateAction<boolean>>,
}> = ({ adItem, setLaunchModal }) => {
    const apiWs = useState('apiWs');
    const [tab, setTab] = useState('list');
    const [errorState, setErrorState] = useState<API.Error>({});
    const [slotsOf, setSlotsOf] = useState<any>({});

    const getSlotsAdOf = async (adID: string) => {
        try {
            const res = await GetSlotsOf(adID);
            setSlotsOf(res);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
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
                {errorState.Message && <Message content={errorState.Message} />}
                {tab === 'add' && (
                    <Add setErrorState={setErrorState} adItem={adItem} setLaunchModal={setLaunchModal} />
                )}
                {tab === 'list' && (
                    <List slotsOf={slotsOf} setErrorState={setErrorState} />
                )}
            </div>
        </>
    )
}

export default Launch;
