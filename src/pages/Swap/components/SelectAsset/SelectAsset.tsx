import React, { useEffect, useState } from 'react';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Image, Input, Spin } from 'antd';
import { useIntl, useModel } from 'umi';
import { OwnerDidOfNft } from '@/services/subquery/subquery';
import { GetUserInfo } from '@/services/parami/RPC';
import config from '@/config/config';
import style from './SelectAsset.less';
import Token from '@/components/Token/Token';
import { GetAllAssets } from '@/services/parami/Assets';
import { QueryAssets } from '@/services/parami/HTTP';

const SelectAsset: React.FC<{
    onClose: () => void
    onSelectAsset: (asset) => void
}> = ({ onClose, onSelectAsset }) => {
    const intl = useIntl();
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const [assets, setAssets] = useState<any[]>();
    const [keyword, setKeyword] = useState<string>();

    const queryAssets = async (keyword: string) => {
        // const resp = await fetch(`http://localhost:8080/tokens?did=${wallet?.account}`);

        const resp = await QueryAssets(wallet.account, keyword);

        setAssets(resp.data.tokens ?? []);

        console.log(resp);

        // if (apiWs) {
        //     const assets = await GetAllAssets();

        //     const items = await Promise.all(assets.map(async asset => {
        //         const accountRes: any = await apiWs.query.assets.account(Number(asset!.id), wallet?.account);
        //         const { balance } = accountRes.toHuman() ?? { balance: '' };
        //         balance.replaceAll(',', '')

        //         try {
        //             const did = await OwnerDidOfNft(asset!.id);
        //             const info = await GetUserInfo(did);
        //             let icon = '';

        //             if (!!info?.avatar && info?.avatar.indexOf('ipfs://') > -1) {
        //                 const hash = info?.avatar.substring(7);
        //                 icon = config.ipfs.endpoint + hash;
        //             }

        //             return {
        //                 ...asset,
        //                 icon,
        //                 balance: balance.replaceAll(',', '')
        //             }
        //         } catch (_e) {
        //             return null;
        //         }
        //     }));

        //     setAssets(items.filter(Boolean));
        // }
    }

    useEffect(() => {
        queryAssets(keyword ?? '');
    }, [keyword])


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
                    <div>
                        <Input value={keyword} onChange={e => setKeyword(e.target.value)}></Input>
                    </div>
                    <div className={style.title}>
                        <span>Token</span>
                        <span>Available Balance</span>
                    </div>

                    {assets?.map(asset => {
                        return <>
                            <div
                                className={style.field}
                                key={asset.id}
                                onClick={() => onSelectAsset(asset)}
                            >
                                <span className={style.title}>
                                    <Image
                                        className={style.icon}
                                        src={asset.icon || '/images/logo-round-core.svg'}
                                        fallback='/images/logo-round-core.svg'
                                        preview={false}
                                    />
                                    <span className={style.name}>
                                        {asset.symbol}
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
