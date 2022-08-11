import React, { useEffect, useState } from 'react';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Image, Spin } from 'antd';
import { useIntl, useModel } from 'umi';
import { OwnerDidOfNft } from '@/services/subquery/subquery';
import { GetUserInfo } from '@/services/parami/RPC';
import config from '@/config/config';
import style from './SelectAsset.less';
import Token from '@/components/Token/Token';

const SelectAsset: React.FC<{
    onClose: () => void
    onSelectAsset: (assetId: string) => void
}> = ({ onClose, onSelectAsset }) => {
    const intl = useIntl();
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const [assets, setAssets] = useState<any[]>();

    const queryAssets = async () => {
        if (apiWs) {
            const entries = await apiWs.query.assets.metadata.entries();
            const assets = (entries ?? []).map(entry => {
                const [key, value] = entry;
                const assetId = key.toHuman();
                if (assetId) {
                    return {
                        ...value.toHuman(),
                        id: assetId[0]
                    }
                }
                return null;
            }).filter(Boolean);

            const items = await Promise.all(assets.map(async asset => {
                const accountRes: any = await apiWs.query.assets.account(Number(asset!.id), wallet?.account);
                const { balance } = accountRes.toHuman() ?? { balance: '' };
                balance.replaceAll(',', '')

                let icon = '';
                try {
                    const did = await OwnerDidOfNft(asset!.id);
                    const info = await GetUserInfo(did);

                    if (!!info?.avatar && info?.avatar.indexOf('ipfs://') > -1) {
                        const hash = info?.avatar.substring(7);
                        icon = config.ipfs.endpoint + hash;
                    }
                } catch (e) {
                    console.error('Fetch Token Icon Error: assetId', asset!.id);
                }

                return {
                    ...asset,
                    icon,
                    balance: balance.replaceAll(',', '')
                }
            }));

            setAssets(items);
        }
    }

    useEffect(() => {
        if (apiWs) {
            queryAssets();
        }
    }, [apiWs])


    return <BigModal
        visable
        title="Select Asset"
        content={
            <div className={style.assetsContainer}>
                {!assets && <>
                    <Spin tip='Loading Assets'></Spin>
                </>}

                {assets && assets.length === 0 && <>
                    <div className={style.noAssets}>
                        Could not find any assets.
                    </div>
                </>}

                {assets && assets.length > 0 && <>
                    <div className={style.title}>
                        <span>Name</span>
                        <span>Available Balance</span>
                    </div>

                    {assets?.map(asset => {
                        return <>
                            <div
                                className={style.field}
                                key={asset.id}
                                onClick={() => onSelectAsset(asset.id)}
                            >
                                <span className={style.title}>
                                    <Image
                                        className={style.icon}
                                        src={asset.icon || '/images/logo-round-core.svg'}
                                        fallback='/images/logo-round-core.svg'
                                        preview={false}
                                    />
                                    <span className={style.name}>
                                        {asset.name}
                                    </span>
                                </span>
                                <span className={style.value}>
                                    <Token value={asset.balance} symbol={asset.symbol} />
                                </span>
                            </div>
                        </>;
                    })}
                </>}

            </div>
        }
        close={onClose}
        footer={
            <Button
                block
                type='primary'
                shape='round'
                size='large'
                onClick={onClose}
            >
                {intl.formatMessage({
                    id: 'common.close',
                })}
            </Button>
        }
    />;
};

export default SelectAsset;
