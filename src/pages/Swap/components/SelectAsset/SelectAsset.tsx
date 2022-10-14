import React, { useCallback, useEffect, useRef, useState } from 'react';
import BigModal from '@/components/ParamiModal/BigModal';
import { Image, Input, Spin } from 'antd';
import { useModel } from 'umi';
import style from './SelectAsset.less';
import Token from '@/components/Token/Token';
import { QueryAssets } from '@/services/parami/HTTP';
import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';

const SelectAsset: React.FC<{
    onClose: () => void
    onSelectAsset: (asset) => void
}> = ({ onClose, onSelectAsset }) => {
    const { wallet } = useModel('currentUser');
    const [assets, setAssets] = useState<any[]>();
    const [keyword, setKeyword] = useState<string>();
    const inputRef: any = useRef();

    const queryAssets = useCallback(debounce(async (keyword: string) => {
        const resp = await QueryAssets(wallet.account, keyword);
        setAssets(resp.data.tokens ?? []);
    }, 200), [wallet]);

    useEffect(() => {
        setAssets(undefined);
        queryAssets(keyword ?? '');
    }, [keyword, queryAssets]);

    useEffect(() => {
        inputRef.current.focus({
            cursor: 'start',
        });
    }, []);

    return <BigModal
        visable
        title="Select Asset"
        content={
            <div className={style.assetsContainer}>
                <div className={style.searchInput}>
                    <Input value={keyword} onChange={e => setKeyword(e.target.value)} ref={inputRef}
                        placeholder="Search name or symbol" prefix={<SearchOutlined />}></Input>
                </div>

                {keyword && keyword.length > 0 && !assets && <>
                    <Spin tip='Loading Assets'></Spin>
                </>}

                {keyword && keyword.length > 0 && assets && assets.length === 0 && <>
                    <div className={style.noAssets}>
                        Could not find any assets.
                    </div>
                </>}

                {assets && assets.length > 0 && <>

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
        footer={null}
    />;
};

export default SelectAsset;
