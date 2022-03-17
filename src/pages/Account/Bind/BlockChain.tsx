import React from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { LoadingOutlined } from '@ant-design/icons';
import { Typography, Image, Card, Button, Spin } from 'antd';

const BlockChain: React.FC<{
    setBindModal: React.Dispatch<React.SetStateAction<boolean>>;
    setBindPlatform: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setBindModal, setBindPlatform }) => {
    const linkedInfo = useModel('sns');

    const intl = useIntl();

    const { Title } = Typography;

    return (
        <>
            <Title
                level={3}
                className={style.sectionTitle}
            >
                <Image
                    src='/images/icon/chain.svg'
                    className={style.sectionIcon}
                    preview={false}
                />
                {intl.formatMessage({
                    id: 'account.blockchain.title',
                })}
            </Title>
            <div className={style.bind}>
                <Card
                    className={`${styles.card} ${style.bindCard}`}
                    bodyStyle={{
                        padding: 0,
                        width: '100%',
                    }}
                >
                    <div className={style.field}>
                        <div className={style.title}>
                            <Image
                                className={style.icon}
                                src="/images/crypto/ethereum-eth-logo.svg"
                                preview={false}
                            />
                            <span className={style.label}>ETH</span>
                        </div>
                        <div className={style.button}>
                            <Spin
                                indicator={
                                    <LoadingOutlined spin />
                                }
                                spinning={!Object.keys(linkedInfo).length}
                            >
                                <Button
                                    disabled={null !== linkedInfo.Ethereum}
                                    size='large'
                                    shape='round'
                                    type='primary'
                                    onClick={() => {
                                        setBindModal(true);
                                        setBindPlatform('Ethereum');
                                    }}
                                >
                                    {!linkedInfo.Ethereum &&
                                        intl.formatMessage({
                                            id: 'social.bind',
                                        })
                                    }
                                    {linkedInfo.Ethereum === 'linked' &&
                                        intl.formatMessage({
                                            id: 'social.binded',
                                        })
                                    }
                                    {linkedInfo.Ethereum === 'verifing' &&
                                        intl.formatMessage({
                                            id: 'social.verifing',
                                        })
                                    }
                                </Button>
                            </Spin>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/crypto/solana-sol-logo.svg" />
                            <span className={style.label}>SOL</span>
                        </div>
                        <div className={style.button}>
                            <Spin
                                indicator={
                                    <LoadingOutlined spin />
                                }
                                spinning={!Object.keys(linkedInfo).length}
                            >
                                <Button
                                    disabled={null !== linkedInfo.Solana}
                                    size='large'
                                    shape='round'
                                    type='primary'
                                    onClick={() => {
                                        setBindModal(true);
                                        setBindPlatform('Solana');
                                    }}
                                >
                                    {!linkedInfo.Solana &&
                                        intl.formatMessage({
                                            id: 'social.bind',
                                        })
                                    }
                                    {linkedInfo.Solana === 'linked' &&
                                        intl.formatMessage({
                                            id: 'social.binded',
                                        })
                                    }
                                    {linkedInfo.Solana === 'verifing' &&
                                        intl.formatMessage({
                                            id: 'social.verifing',
                                        })
                                    }
                                </Button>
                            </Spin>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/crypto/binance-bsc-logo.svg" />
                            <span className={style.label}>BSC</span>
                        </div>
                        <div className={style.button}>
                            <Spin
                                indicator={
                                    <LoadingOutlined spin />
                                }
                                spinning={!Object.keys(linkedInfo).length}
                            >
                                <Button
                                    disabled={null !== linkedInfo.Binance}
                                    size='large'
                                    shape='round'
                                    type='primary'
                                    onClick={() => {
                                        setBindModal(true);
                                        setBindPlatform('Binance');
                                    }}
                                >
                                    {!linkedInfo.Binance &&
                                        intl.formatMessage({
                                            id: 'social.bind',
                                        })
                                    }
                                    {linkedInfo.Binance === 'linked' &&
                                        intl.formatMessage({
                                            id: 'social.binded',
                                        })
                                    }
                                    {linkedInfo.Binance === 'verifing' &&
                                        intl.formatMessage({
                                            id: 'social.verifing',
                                        })
                                    }
                                </Button>
                            </Spin>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/crypto/bitcoin-btc-logo.svg" />
                            <span className={style.label}>BTC</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                disabled
                                size='large'
                                shape='round'
                                type='primary'
                                onClick={() => {
                                    setBindModal(true);
                                    setBindPlatform('Bitcoin');
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'social.coming',
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/crypto/eos-eos-logo.svg" />
                            <span className={style.label}>EOS</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                disabled
                                size='large'
                                shape='round'
                                type='primary'
                                onClick={() => {
                                    setBindModal(true);
                                    setBindPlatform('Eosio');
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'social.coming',
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/crypto/kusama-ksm-logo.svg" />
                            <span className={style.label}>KSM</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                disabled
                                size='large'
                                shape='round'
                                type='primary'
                                onClick={() => {
                                    setBindModal(true);
                                    setBindPlatform('Kusama');
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'social.coming',
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/crypto/polkadot-new-dot-logo.svg" />
                            <span className={style.label}>DOT</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                disabled
                                size='large'
                                shape='round'
                                type='primary'
                                onClick={() => {
                                    setBindModal(true);
                                    setBindPlatform('Polkadot');
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'social.coming',
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/crypto/tron-trx-logo.png" />
                            <span className={style.label}>TRX</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                disabled
                                size='large'
                                shape='round'
                                type='primary'
                                onClick={() => {
                                    setBindModal(true);
                                    setBindPlatform('Tron');
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'social.coming',
                                })}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default BlockChain;
