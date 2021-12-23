import React, { useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { Card, Typography, Image, Divider, Button, Input, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import AD3 from '@/components/Token/AD3';
import { FloatStringToBigInt } from '@/utils/format';
import Token from '@/components/Token/Token';

const { Title } = Typography;

const Trade: React.FC<{
    avatar: string;
    asset: any;
}> = ({ avatar, asset }) => {
    const [mode, setMode] = useState<string>('ad3ToToken');

    const intl = useIntl();

    return (
        <>
            <Card
                className={styles.card}
                bodyStyle={{
                    width: '100%',
                }}
                style={{
                    marginTop: 50,
                }}
            >
                <div className={style.trade}>
                    <Title
                        level={3}
                        style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}
                        className={styles.title}
                    >
                        {intl.formatMessage({
                            id: 'creator.explorer.trade',
                        })}
                    </Title>
                    <Divider />
                    <div
                        className={style.pairCoins}
                        style={{
                            flexFlow: mode === 'ad3ToToken' ? 'column' : 'column-reverse',
                        }}
                    >
                        <div className={style.pairCoinsItem}>
                            <div className={style.pairCoinsSelect}>
                                <div className={style.pairCoin}>
                                    <Image
                                        src={'/images/logo-round-core.svg'}
                                        preview={false}
                                        className={style.pairCoinsItemIcon}
                                    />
                                    <span className={style.pairCoinsItemLabel}>AD3</span>
                                </div>
                                <Input
                                    autoFocus={false}
                                    size="large"
                                    placeholder={'0'}
                                    bordered={false}
                                    type="number"
                                />
                            </div>
                            <div className={style.pairCoinsBalance}>
                                <span className={style.balance}>
                                    {intl.formatMessage({
                                        id: 'creator.explorer.trade.balance',
                                        defaultMessage: 'Balance'
                                    })}: <AD3 value={FloatStringToBigInt('829500', 18).toString()} />
                                </span>
                                <Button
                                    type='link'
                                    size='middle'
                                    className={style.maxButton}
                                >
                                    {intl.formatMessage({
                                        id: 'creator.explorer.trade.balance.max',
                                        defaultMessage: 'MAX'
                                    })}
                                </Button>
                            </div>
                        </div>
                        <Button
                            type='primary'
                            shape='circle'
                            size='middle'
                            icon={<DownOutlined />}
                            className={style.pairCoinsSwitchButton}
                            onClick={() => { setMode(mode === 'ad3ToToken' ? 'tokenToAd3' : 'ad3ToToken') }}
                        />
                        <div className={style.pairCoinsItem}>
                            <div className={style.pairCoinsSelect}>
                                <div className={style.pairCoin}>
                                    <Image
                                        src={avatar || '/images/logo-round-core.svg'}
                                        preview={false}
                                        className={style.pairCoinsItemIcon}
                                    />
                                    <span className={style.pairCoinsItemLabel}>{asset?.symbol}</span>
                                </div>
                                <Input
                                    autoFocus={false}
                                    size="large"
                                    placeholder={'0'}
                                    bordered={false}
                                    type="number"
                                />
                            </div>
                            <div className={style.pairCoinsBalance}>
                                <span className={style.balance}>
                                    {intl.formatMessage({
                                        id: 'creator.explorer.trade.balance',
                                        defaultMessage: 'Balance'
                                    })}: <Token value={FloatStringToBigInt('3.569', 18).toString()} symbol={asset?.symbol} />
                                </span>
                                <Button
                                    type='link'
                                    size='middle'
                                    className={style.maxButton}
                                >
                                    {intl.formatMessage({
                                        id: 'creator.explorer.trade.balance.max',
                                        defaultMessage: 'MAX'
                                    })}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={style.pairCoinsFlat}>
                        <Space>
                            <AD3 value={FloatStringToBigInt('0.0111', 18).toString()} />
                            <span>=</span>
                            <Token value={FloatStringToBigInt('1', 18).toString()} symbol={asset?.symbol} />
                        </Space>
                    </div>
                    <Button
                        block
                        type='primary'
                        size='large'
                        shape='round'
                        className={style.submitButton}
                    >
                        {intl.formatMessage({
                            id: 'creator.explorer.trade.swap',
                            defaultMessage: 'Swap'
                        })}
                    </Button>
                </div>
            </Card>
        </>
    )
}

export default Trade;
