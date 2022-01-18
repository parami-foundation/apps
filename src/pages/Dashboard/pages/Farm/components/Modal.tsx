import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { Button, Input, Slider, Typography, Image } from 'antd';
import style from './Modal.less';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { contractAddresses } from '../config';
import { FloatStringToBigInt } from '@/utils/format';

const AddModal: React.FC<{
    pair: Farm.Pair;
    setVisiable: React.Dispatch<React.SetStateAction<boolean>>;
    currentPrice: bigint;
}> = ({ pair, setVisiable, currentPrice }) => {
    const {
        chainId,
    } = useModel("metaMask");
    const intl = useIntl();
    const [APYIndex, setAPYIndex] = React.useState(0);
    const { Title } = Typography;

    useEffect(() => {
        if (currentPrice) {
            for (let i = 0; i < pair.incentives.length; i++) {
                const min = FloatStringToBigInt(pair.incentives[i].minPrice, 18);
                const max = FloatStringToBigInt(pair.incentives[i].maxPrice, 18);
                if (min <= currentPrice && currentPrice <= max) {
                    setAPYIndex(i);
                }
            }
        }
    }, [currentPrice]);

    const marks = {
        0: '100%',
        1: '150%',
        2: '200%',
    };

    return (
        <>
            <div className={style.modalContainer}>
                <Title
                    level={5}
                    className={style.title}
                >
                    Select APY
                </Title>
                <Slider
                    min={0}
                    max={2}
                    marks={marks}
                    step={null}
                    defaultValue={APYIndex}
                    className={style.slider}
                    onChange={(value) => {
                        setAPYIndex(value);
                    }}
                />
                <div className={style.rangeBlocks}>
                    <div className={style.block}>
                        <div className={style.blockBody}>
                            <span className={style.title}>
                                {intl.formatMessage({
                                    id: 'dashboard.stake.minPrice',
                                    defaultMessage: 'Min Price',
                                })}
                            </span>
                            <div className={style.control}>
                                <Button
                                    disabled
                                    size='middle'
                                    shape='circle'
                                    type="default"
                                    icon={<MinusOutlined />}
                                />
                                <Input
                                    disabled
                                    placeholder='0.0'
                                    className={style.input}
                                    bordered={false}
                                    value={pair.incentives[APYIndex].minPrice}
                                />
                                <Button
                                    disabled
                                    size='middle'
                                    shape='circle'
                                    type="default"
                                    icon={<PlusOutlined />}
                                />
                            </div>
                            <span className={style.rate}>
                                {intl.formatMessage({
                                    id: 'dashboard.stake.rateDesc',
                                    defaultMessage: '{from} per {to}',
                                }, {
                                    from: 'AD3',
                                    to: 'ETH',
                                })}
                            </span>
                        </div>
                    </div>
                    <div className={style.block}>
                        <div className={style.blockBody}>
                            <span className={style.title}>
                                {intl.formatMessage({
                                    id: 'dashboard.stake.maxPrice',
                                    defaultMessage: 'Max Price',
                                })}
                            </span>
                            <div className={style.control}>
                                <Button
                                    disabled
                                    size='middle'
                                    shape='circle'
                                    type="default"
                                    icon={<MinusOutlined />}
                                />
                                <Input
                                    disabled
                                    placeholder='0.0'
                                    className={style.input}
                                    bordered={false}
                                    value={pair.incentives[APYIndex].maxPrice}
                                />
                                <Button
                                    disabled
                                    size='middle'
                                    shape='circle'
                                    type="default"
                                    icon={<PlusOutlined />}
                                />
                            </div>
                            <span className={style.rate}>
                                {intl.formatMessage({
                                    id: 'dashboard.stake.rateDesc',
                                    defaultMessage: '{from} per {to}',
                                }, {
                                    from: 'AD3',
                                    to: 'ETH',
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={style.fullrange}>
                    <Button
                        block
                        disabled
                        size='middle'
                        shape='round'
                    >
                        {intl.formatMessage({
                            id: 'dashboard.stake.fullRange',
                            defaultMessage: 'Full Range',
                        })}
                    </Button>
                </div>
                <div className={style.gotoUniswap}>
                    <Button
                        block
                        size='large'
                        shape='round'
                        type='primary'
                        icon={
                            <Image
                                src='/images/crypto/uniswap-icon.svg'
                                height={'100%'}
                                preview={false}
                                style={{
                                    marginRight: 20
                                }}
                            />
                        }
                        onClick={() => {
                            setVisiable(false);
                            window.open(
                                `https://app.uniswap.org/#/add/${pair.coin === 'ETH'
                                    ? 'ETH'
                                    : pair.coinAddress}/${contractAddresses.ad3[chainId]}/3000`
                            )
                        }}
                    >
                        {intl.formatMessage({
                            id: 'dashboard.stake.gotoUniswap',
                            defaultMessage: 'Goto Uniswap',
                        })}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AddModal;
