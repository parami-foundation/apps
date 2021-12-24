import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { Card, Typography, Image, Divider, Button, Input, Space, Alert } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import AD3 from '@/components/Token/AD3';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';
import Token from '@/components/Token/Token';

const { Title } = Typography;

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

const Trade: React.FC<{
    avatar: string;
    asset: any;
    user: any;
    stashUserAddress: string;
    controllerKeystore: string;
}> = ({ avatar, asset, user, stashUserAddress, controllerKeystore }) => {
    const [submitting, setSubmitting] = useState(false);
    const [errorState, setErrorState] = useState<API.Error>({});
    const [mode, setMode] = useState<string>('ad3ToToken');
    const [ad3Number, setAd3Number] = useState<string>('0');
    const [tokenNumber, setTokenNumber] = useState<string>('0');

    const [FreeBalance, setFreeBalance] = useState<any>(null);
    const [FreeAssetBalance, setFreeAssetBalance] = useState<any>(null);

    const [secModal, setSecModal] = useState(false);
    const [password, setPassword] = useState('');

    const [costOf, setCostOf] = useState<any>(0);
    const [valueOf, setValueOf] = useState<any>(0);

    const { assetsArr } = useModel('assets');
    const { stash } = useModel('balance');

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
                                    value={ad3Number}
                                />
                            </div>
                            <div className={style.pairCoinsBalance}>
                                <span className={style.balance}>
                                    {intl.formatMessage({
                                        id: 'creator.explorer.trade.balance',
                                        defaultMessage: 'Balance'
                                    })}: <AD3 value={stash.free} />
                                </span>
                                <Button
                                    type='link'
                                    size='middle'
                                    className={style.maxButton}
                                    onClick={() => {
                                        setAd3Number(BigIntToFloatString(stash.free, 18));
                                    }}
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
                                    value={tokenNumber}
                                />
                            </div>
                            <div className={style.pairCoinsBalance}>
                                <span className={style.balance}>
                                    {intl.formatMessage({
                                        id: 'creator.explorer.trade.balance',
                                        defaultMessage: 'Balance'
                                    })}: <Token value={assetsArr[user?.nft]?.balance} symbol={asset?.symbol} />
                                </span>
                                <Button
                                    type='link'
                                    size='middle'
                                    className={style.maxButton}
                                    onClick={() => {
                                        setTokenNumber(BigIntToFloatString(assetsArr[user?.nft]?.balance, 18))
                                    }}
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
