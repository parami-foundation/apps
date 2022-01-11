import { Button, Input, Image } from 'antd';
import React from 'react';
import { useIntl, useModel } from 'umi';
import styles from '../style.less';
import { useState, useEffect } from 'react';
import { GetUserInfo } from '@/services/parami/nft';
import { OwnerDidOfNft } from '@/services/subquery/subquery';
import config from '@/config/config';
import AD3 from '@/components/Token/AD3';
import Token from '@/components/Token/Token';

const SelectAsset: React.FC<{
    setStep: React.Dispatch<React.SetStateAction<string>>,
    setToken: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    AD3Balance: any
}> = ({ setStep, setToken, AD3Balance }) => {
    const apiWs = useModel('apiWs');
    const [keyword, setKeyword] = useState<string>();//TODO: fixit
    const [assetsBalance, setAssetsBalance] = useState<any[]>([]);
    const currentAccount = localStorage.getItem('stashUserAddress');
    const updateAssetsBalance = async (assets: any) => {
        const data: any[] = [];
        if (!!assets) {
            for (const assetsID in assets) {
                const { balance }: any = await window.apiWs.query.assets.account(Number(assetsID), currentAccount);
                if (!!balance && balance > 0 && !assets[assetsID].name.endsWith('LP*')) {
                    const did = await OwnerDidOfNft(assetsID);
                    const info = await GetUserInfo(did);
                    let icon: any;
                    if (info['avatar'].indexOf('ipfs://') > -1) {
                        const hash = info['avatar'].substring(7);
                        icon = config.ipfs.endpoint + hash;
                    };
                    data.push({
                        id: assetsID,
                        token: assets[assetsID].name,
                        symbol: assets[assetsID].symbol,
                        balance: balance,
                        icon,
                    });
                }
            }
            setAssetsBalance(data);
        }
    }
    const updateAssetsInfo = async () => {
        const allEntries = await window.apiWs.query.assets.metadata.entries();
        const tmpAssets = {};
        for (let i = 0; i < allEntries.length; i++) {
            const [key, value] = allEntries[i];
            const shortKey = key.toHuman();
            if (!!shortKey) {
                tmpAssets[shortKey[0]] = value.toHuman();
            }
        }
        updateAssetsBalance(tmpAssets);
    }
    const intl = useIntl();

    const handleSelect = async (symbol: any) => {
        setToken(symbol);
        setStep('InputAmount');
    };

    useEffect(() => {
        if (apiWs) {
            updateAssetsInfo();
        }
    }, [apiWs]);

    return (
        <>
            <div className={styles.searchBar}>
                <Input
                    autoFocus
                    size="large"
                    className={styles.searchInput}
                    onChange={(e) => (setKeyword(e.target.value))}
                    placeholder={intl.formatMessage({
                        id: 'wallet.send.searchAsset',
                    })}
                />
            </div>
            <div className={styles.assetsList}>
                <div className={styles.title}>
                    <span>
                        {intl.formatMessage({
                            id: 'wallet.send.name',
                        })}
                    </span>
                    <span>
                        {intl.formatMessage({
                            id: 'wallet.send.availableBalance',
                        })}
                    </span>
                </div>
                <div
                    className={styles.field}
                    key="ad3"
                    onClick={() => handleSelect({})}
                >
                    <span className={styles.title}>
                        <Image
                            className={styles.icon}
                            src={"/images/logo-round-core.svg"}
                            preview={false}
                        />
                        <span className={styles.name}>
                            AD3
                        </span>
                    </span>
                    <span className={styles.value}>
                        <AD3 value={AD3Balance} />
                    </span>
                </div>
                {
                    assetsBalance.map((item: any) => {
                        return (
                            <div
                                className={styles.field}
                                key={item?.assetsID}
                                onClick={() => {
                                    const tmp: Record<string, number> = {};
                                    tmp[item.symbol] = item?.id;
                                    handleSelect(item)
                                }}
                            >
                                <span className={styles.title}>
                                    <Image
                                        className={styles.icon}
                                        src={item?.icon || "/images/logo-round-core.svg"}
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
            <Button
                block
                type="default"
                shape="round"
                size="large"
                className={styles.button}
                onClick={() => setStep('InputAmount')}
                style={{
                    marginTop: 20,
                }}
            >
                {intl.formatMessage({
                    id: 'common.cancel',
                })}
            </Button>
        </>
    )
}

export default SelectAsset;