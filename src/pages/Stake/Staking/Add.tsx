import BigModal from '@/components/ParamiModal/BigModal';
import { RightOutlined } from '@ant-design/icons';
import { Button, Input, Image, message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '../style.less';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { AddLiquidity } from '@/services/parami/Swap';
import config from '@/config/config';
import { OwnerDidOfNft } from '@/services/subquery/subquery';
import AD3 from '@/components/Token/AD3';
import Token from '@/components/Token/Token';
import { FloatStringToBigInt } from '@/utils/format';
import { DrylyAddLiquidity, GetUserInfo } from '@/services/parami/RPC';
import { isLPAsset } from '@/utils/assets.util';

const SelectAssets: React.FC<{
    setToken: React.Dispatch<React.SetStateAction<any>>,
    setSelectModal: React.Dispatch<React.SetStateAction<boolean>>,
    assetsBalance: any[],
    setTokenBalance: React.Dispatch<React.SetStateAction<any>>,
}> = ({ setToken, setSelectModal, assetsBalance, setTokenBalance }) => {
    const intl = useIntl();

    const handleSelect = async (item: any) => {
        setToken(item);
        console.log(item)
        setTokenBalance(item.balance);
        setSelectModal(false);
    }

    return (
        <div className={styles.selectAssets}>
            <div className={styles.assetsList}>
                <div className={styles.title}>
                    <span>
                        {intl.formatMessage({
                            id: 'stake.add.name',
                        })}
                    </span>
                    <span>
                        {intl.formatMessage({
                            id: 'stake.add.availableBalance',
                        })}
                    </span>
                </div>
                {
                    assetsBalance.map((item: any) => {
                        return (
                            <div
                                className={styles.field}
                                key={item?.id}
                                onClick={() => handleSelect(item)}
                            >
                                <span className={styles.title}>
                                    <Image
                                        className={styles.icon}
                                        src={item?.icon || '/images/logo-round-core.svg'}
                                        fallback='/images/logo-round-core.svg'
                                        preview={false}
                                    />
                                    <span className={styles.name}>
                                        {item?.token}
                                    </span>
                                </span>
                                <span className={styles.value}>
                                    <Token value={item?.balance} symbol={item?.symbol} />
                                </span>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
};

const Add: React.FC<{
    setAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setAddModal }) => {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const { balance: ad3Balance } = useModel('balance');
    const { getTokenList } = useModel('stake');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [targetAd3Number, setNumber] = useState<string>('0');
    const [token, setToken] = useState<Record<string, string>>({});
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const [selectModal, setSelectModal] = useState<boolean>(false);
    const [assetsBalance, setAssetsBalance] = useState<any[]>([]);
    const [tokenAmount, setTokenAmount] = useState<any[]>([]);
    const [tokenBalance, setTokenBalance] = useState<any>();

    const intl = useIntl();

    const updateAssetsBalance = async (assets: any) => {
        if (!apiWs) {
            return;
        }
        const data: any[] = [];
        if (!!assets) {
            for (const assetsID in assets) {
                const res: any = await apiWs.query.assets.account(Number(assetsID), wallet?.account);
                const { balance } = res.toHuman() ?? { balance: '' };
                const balanceBigInt = BigInt(balance.replaceAll(',', ''));

                if (!!balanceBigInt && balanceBigInt > 0 && !isLPAsset(assets[assetsID])) {
                    const did = await OwnerDidOfNft(assetsID).catch(() => null);
                    if (did) {
                        let icon: any;
                        const info = await GetUserInfo(did);
                        if (!!info?.avatar && info?.avatar.indexOf('ipfs://') > -1) {
                            const hash = info?.avatar.substring(7);
                            icon = config.ipfs.endpoint + hash;
                        };
                        data.push({
                            id: assetsID,
                            token: assets[assetsID].name,
                            symbol: assets[assetsID].symbol,
                            balance: balanceBigInt.toString(),
                            icon,
                        });
                    }
                }
            }
            setAssetsBalance(data);
        }
    };

    const updateAssetsInfo = async () => {
        if (!apiWs) {
            return;
        }
        const allEntries = await apiWs.query.assets.metadata.entries();
        const tmpAssets = {};
        for (let i = 0; i < allEntries.length; i++) {
            const [key, value] = allEntries[i];
            const shortKey = key.toHuman();
            if (!!shortKey) {
                const id = shortKey[0].replaceAll(',', '');
                tmpAssets[id] = value.toHuman();
            }
        }
        updateAssetsBalance(tmpAssets);
    };

    const handleSubmit = async (preTx?: boolean, account?: string) => {
        if (!!wallet && !!wallet?.keystore) {
            setSubmitting(true);
            try {
                const info: any = await AddLiquidity(token?.id, FloatStringToBigInt(targetAd3Number, 18).toString(), tokenAmount[1], tokenAmount[0], passphrase, wallet?.keystore, preTx, account);
                setSubmitting(false);
                if (preTx && account) {
                    return info
                }

                getTokenList();
            } catch (e: any) {
                message.error(e);
            }
            setSubmitting(false);
            setAddModal(false);
        } else {
            notification.error({
                key: 'accessDenied',
                message: intl.formatMessage({
                    id: 'error.accessDenied',
                }),
                duration: null,
            })
        }
    };

    useEffect(() => {
        if (apiWs) {
            updateAssetsInfo();
        }
    }, [apiWs]);

    return (
        <>
            <div className={styles.mining}>
                <div className={styles.field}>
                    <div className={styles.label}>
                        {intl.formatMessage({
                            id: 'stake.add.selectAssets',
                        })}
                    </div>
                    <div
                        className={styles.selectAssets}
                        onClick={() => {
                            setNumber('0');
                            setTokenAmount([]);
                            setSelectModal(true)
                        }}
                    >
                        <div className={styles.title}>
                            {token.token && (
                                <>
                                    <Image
                                        className={styles.icon}
                                        src={token?.icon || '/images/logo-round-core.svg'}
                                        fallback='/images/logo-round-core.svg'
                                        preview={false}
                                    />
                                    <span className={styles.name}>{token.token}</span>
                                </>
                            )}
                            {!token.token && (
                                <span className={styles.name}>
                                    {intl.formatMessage({
                                        id: 'stake.add.pleaseSelect',
                                    })}
                                </span>
                            )}
                        </div>
                        <div className={styles.token}>
                            <Token value={tokenBalance} symbol={token?.symbol} />
                            <RightOutlined
                                style={{
                                    color: '#ff5b00',
                                    marginLeft: 10,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.field}>
                    <div
                        className={styles.label}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <span>
                            {intl.formatMessage({
                                id: 'stake.add.number.label',
                            })}
                        </span>
                        <span>
                            {intl.formatMessage({
                                id: 'stake.add.number.available',
                            })}:<AD3 value={ad3Balance?.free} />
                        </span>
                    </div>
                    <div className={styles.inputAndButton}>
                        <Input
                            autoFocus
                            size='large'
                            className={styles.input}
                            placeholder={'0'}
                            value={targetAd3Number}
                            onChange={(e) => {
                                setNumber(e.target.value);
                                DrylyAddLiquidity(token.id, FloatStringToBigInt(e.target.value, 18).toString()).then((res: any) => {
                                    setTokenAmount(res);
                                });
                            }}
                            disabled={submitting || !Object.keys(token).length}
                            type='number'
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.label}>
                        {intl.formatMessage({
                            id: 'stake.add.overview',
                        })}
                    </div>
                    <div className={styles.listBtn}>
                        <div className={styles.field}>
                            <span className={styles.title}>
                                {intl.formatMessage({
                                    id: 'stake.add.tokenAmount',
                                })}
                            </span>
                            <span
                                className={styles.value}
                                style={{
                                    color: 'green',
                                }}
                            >
                                <Token value={tokenAmount[0]} symbol={token.symbol} />
                            </span>
                        </div>
                        <div className={styles.field}>
                            <span className={styles.title}>
                                {intl.formatMessage({
                                    id: 'stake.add.lptokenAmount',
                                })}
                            </span>
                            <span
                                className={styles.value}
                                style={{
                                    color: 'green',
                                }}
                            >
                                <Token value={tokenAmount[1]} />
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.actionButtons}>
                    <Button
                        type='primary'
                        shape='round'
                        size='large'
                        className={styles.button}
                        loading={submitting}
                        disabled={FloatStringToBigInt(targetAd3Number, 18) <= BigInt(0) ||
                            FloatStringToBigInt(targetAd3Number, 18) > BigInt(ad3Balance?.free) ||
                            tokenAmount.length === 0 ||
                            (tokenAmount.length > 0 && BigInt(tokenAmount[0]) > tokenBalance)}
                        onClick={() => {
                            setSubmitting(true);
                            setSecModal(true);
                        }}
                    >
                        {intl.formatMessage({
                            id: 'stake.add.title',
                        })}
                    </Button>
                </div>
            </div>
            <BigModal
                visable={selectModal}
                title={
                    intl.formatMessage({
                        id: 'stake.add.selectAssets',
                    })
                }
                content={
                    <SelectAssets
                        setToken={setToken}
                        setSelectModal={setSelectModal}
                        assetsBalance={assetsBalance}
                        setTokenBalance={setTokenBalance}
                    />
                }
                close={() => { setSelectModal(false) }}
                footer={
                    <Button
                        block
                        type='primary'
                        shape='round'
                        size='large'
                        className={styles.button}
                        onClick={() => setSelectModal(false)}
                    >
                        {intl.formatMessage({
                            id: 'common.close',
                        })}
                    </Button>
                }
            />
            <SecurityModal
                visable={secModal}
                setVisable={setSecModal}
                passphrase={passphrase}
                setPassphrase={setPassphrase}
                func={handleSubmit}
            />
        </>
    );
};

export default Add;
