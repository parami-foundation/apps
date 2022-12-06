import FormErrorMsg from '@/components/Form/FormErrorMsg';
import Token from '@/components/Token/Token';
import { Asset } from '@/services/parami/typings';
import { stringToBigInt } from '@/utils/common';
import { Button, Input, notification, Select, Table, Tooltip } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import style from './BidSection.less';
import { BigIntToFloatString, deleteComma, FloatStringToBigInt } from '@/utils/format';
import { useModel, useParams } from 'umi';
import { GetSlotOfNft } from '@/services/parami/Advertisement';
import { GetBalanceOfBudgetPot } from '@/services/parami/Assets';
import { getNumberOfHolders } from '@/services/subquery/subquery';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { QueryAssetById, QueryAssets } from '@/services/parami/HTTP';
import { DrylyBuyToken } from '@/services/parami/RPC';
import AD3 from '@/components/Token/AD3';

interface BidTarget {
    id: string;
    price: string;
    buyTokenAmount: string;
    ad3Amount: string;
}

export interface BidSectionProps {
    formValid: boolean;
    onBid: (targets: BidTarget[]) => void
}

function BidSection({ onBid, formValid }: BidSectionProps) {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const { balance } = useModel('balance');

    const [searchText, setSearchText] = useState<string>('');
    const [searchAssets, setSearchAssets] = useState<Asset[]>([]);
    const [assetOptions, setAssetOptions] = useState<{value: string; label: string; data?: Asset; disabled?: boolean}[]>([]);
    const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
    const [hnfts, setHnfts] = useState<any[]>([]);
    const [bidTargets, setBidTargets] = useState<BidTarget[]>([]);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [ad3Amount, setAd3Amount] = useState<string>('');

    const params: {
        nftId: string;
    } = useParams();

    const queryDefaultHNFT = async (assetId: string) => {
        const { data } = await QueryAssetById(assetId);
        if (!data?.token) {
            console.log('Query asset by id error', assetId);
            notification.error({
                message: 'Network Error',
                description: `Please retry later...`
            });
            return;
        }

        const accountRes: any = await apiWs!.query.assets.account(assetId, wallet.account);
        const { balance } = accountRes.toHuman() ?? { balance: '' };
        setSelectedAssets([{ ...data.token, balance }])
    }

    useEffect(() => {
        if (params.nftId && apiWs && wallet) {
            queryDefaultHNFT(params.nftId);
        }
    }, [params, apiWs, wallet]);

    useEffect(() => {
        const id2Option = new Map<string, Asset>();
        [...selectedAssets, ...searchAssets].forEach(asset => id2Option.set(asset.id, asset));
        setAssetOptions([{ disabled: true, value: '-1', label: 'Search HNFT by name' }, ...[...id2Option.values()].map(token => ({ label: token.name, value: token.id, data: token }))])
    }, [searchAssets, selectedAssets])

    const queryAssetOptions = useCallback(debounce(async (keyword: string) => {
        setSearchAssets([]);
        if (keyword) {
            const resp = await QueryAssets(wallet.account, keyword);
            const tokens = resp.data.tokens ?? [];
            setSearchAssets(tokens);
        }
    }, 200), [wallet]);

    useEffect(() => {
        queryAssetOptions(searchText);
    }, [searchText, queryAssetOptions]);

    const queryHnftPriceInfo = async (asset: Asset) => {
        const hnft = hnfts.find(nft => nft.id === asset.id);
        const budgetBalance = await getCurrentBudgetBalance(asset.id);
        const numHolders = await getNumberOfHolders(asset.id);
        const minPrice = Math.ceil(Math.max(Number(BigIntToFloatString(deleteComma(budgetBalance), 18)) * 1.2, 1, numHolders));

        return {
            ...asset,
            ...hnft,
            currentPrice: budgetBalance,
            numHolders,
            minPrice,
            price: Math.max(hnft?.price ?? 0, minPrice)
        }
    }

    useEffect(() => {
        setTableLoading(true);
        Promise.all(selectedAssets.map(asset => {
            return queryHnftPriceInfo(asset);
        })).then(hnfts => {
            setTableLoading(false);
            setHnfts(hnfts)
        })
    }, [selectedAssets])

    const getCurrentBudgetBalance = async (nftId: string) => {
        const slot = await GetSlotOfNft(nftId);

        if (!slot) {
            return '0';
        }

        const budget = await GetBalanceOfBudgetPot(slot.budgetPot, slot.fractionId);
        if (!budget) {
            return '0';
        }

        return deleteComma(budget.balance);
    }

    const handleChange = (value: string[], options) => {
        const selected = (options ?? []).map(option => option.data);
        setSelectedAssets(selected);
    };

    const handleSearch = (value) => {
        setSearchText(value);
    }

    const updatePrice = (id: string, price?: number) => {
        setHnfts(hnfts.map(hnft => {
            if (hnft.id === id) {
                return {
                    ...hnft,
                    price,
                }
            }
            return hnft
        }))
    }

    const updatePriceSummary = async () => {
        const bidTargets = await Promise.all(hnfts.map(async hnft => {
            let buyTokenAmount, ad3Amount;
            const swapTokenAmountBigInt = FloatStringToBigInt(`${hnft.price ?? '0'}`, 18) - stringToBigInt(hnft.balance);
            if (swapTokenAmountBigInt > 0) {
                buyTokenAmount = swapTokenAmountBigInt.toString();
                ad3Amount = await DrylyBuyToken(hnft.id, buyTokenAmount);
            }

            return {
                id: hnft.id,
                price: FloatStringToBigInt(`${hnft.price ?? '0'}`, 18).toString(),
                buyTokenAmount,
                ad3Amount
            }
        }));

        const ad3Amount = bidTargets.reduce((pre, cur) => {
            return (BigInt(pre) + BigInt(cur.ad3Amount ?? '0')).toString();
        }, '');
        setAd3Amount(ad3Amount);
        setBidTargets(bidTargets);
    }

    useEffect(() => {
        updatePriceSummary();
    }, [hnfts]);

    const columns = [
        {
            title: 'HNFT',
            dataIndex: 'name',
            key: 'name',
            render: (_, { id, name }) => {
                return <>
                    <a href={`/ad/?nftId=${id}`} target="_blank">{`${name} `}
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </>
            }
        }, {
            title: 'DAO Members',
            dataIndex: 'numHolders',
            key: 'numHolders'
        }, {
            title: <>
                {`Min Price `}
                <Tooltip
                    title={'Bid requires a minimal price based on the current price and the number of DAO members'}
                >
                    <ExclamationCircleOutlined />
                </Tooltip>
            </>,
            dataIndex: 'minPrice',
            key: 'minPrice',
            render: (_, hnft) => {
                return <Token value={FloatStringToBigInt(`${hnft.minPrice}`, 18).toString()} symbol={hnft.symbol} />
            }
        }, {
            title: 'Offer a price',
            dataIndex: 'price',
            key: 'price',
            render: (_, hnft) => {
                return <>
                    <div>
                        <Input type='number' value={hnft.price} onChange={e => {
                            updatePrice(hnft.id, e.target.value ? parseFloat(e.target.value) : undefined);
                        }}></Input>
                    </div>
                    {hnft.price < hnft.minPrice && <>
                        <FormErrorMsg msg={'price too low'} />
                    </>}
                </>
            }
        }
    ]

    return <>
        <div className={style.bidSectionContainer}>

            <div style={{ width: '100%' }}>
                <div className={style.title}>
                    HNFTs
                </div>
                <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Please select HNFTs"
                    value={selectedAssets.map(asset => asset.id)}
                    onChange={handleChange}
                    onSearch={handleSearch}
                    optionLabelProp={'label'}
                    filterOption={false}
                    onBlur={() => {
                        setSearchText('');
                    }}
                    options={assetOptions}
                >
                </Select>
            </div>

            {(hnfts.length > 0 || tableLoading) && <>
                <div className={style.hnftTable}>
                    <Table columns={columns} dataSource={hnfts} pagination={false} size={'small'} loading={tableLoading} />
                </div>
            </>}

            {BigInt(ad3Amount) > 0 && <>
                <div className={style.ad3Price}>
                    <div>
                        {`Additional AD3 Price `}
                        <Tooltip
                            title={'Additional AD3 is needed for swapping HNFT powers'}
                        >
                            <ExclamationCircleOutlined />
                        </Tooltip>
                        {` :`} <AD3 value={ad3Amount}></AD3>
                    </div>
                    <div>
                        Balance: <AD3 value={balance?.free} />
                    </div>
                </div>
            </>}

            <div
                className={style.bidBtnContainer}
            >
                <Button
                    block
                    size='large'
                    shape='round'
                    type='primary'
                    disabled={!bidTargets.length || tableLoading || !formValid}
                    onClick={() => {
                        onBid(bidTargets);
                    }}
                >
                    Bid
                </Button>
            </div>
        </div>
    </>;
};

export default BidSection;
