import React, { useEffect, useState } from 'react';
import { useIntl, useModel, history } from 'umi';
import { Typography, Image, Card, Button, Spin } from 'antd';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { LoadingOutlined } from '@ant-design/icons';
import BigModal from '@/components/ParamiModal/BigModal';
import config from '@/config/config';
import BindModal from './BindModal';

const Blockchain: React.FC = () => {
    const linkedInfo = useModel('sns');
    const [bindModal, setBindModal] = useState<boolean>(false);
    const [blockchain, setBlockchain] = useState<string>('');

    const intl = useIntl();

    const { query } = history.location;
    const { type, from } = query as { type: string, from: string };

    const { Title } = Typography;

    useEffect(() => {
        if (from && type === 'blockchain') {
            setBindModal(true);
            setBlockchain(from);
        }
    }, [from, type]);

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
                    id: 'profile.blockchain.title',
                    defaultMessage: 'Blockchain'
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
                                        setBlockchain('Ethereum');
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
                                    setBlockchain('Bitcoin');
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
                            <img className={style.icon} src="/images/crypto/binance-bsc-logo.svg" />
                            <span className={style.label}>BSC</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                disabled
                                size='large'
                                shape='round'
                                type='primary'
                                onClick={() => {
                                    setBindModal(true);
                                    setBlockchain('Binance');
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
                                    setBlockchain('Eosio');
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
                                        setBlockchain('Solana');
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
                                    setBlockchain('Kusama');
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
                                    setBlockchain('Polkadot');
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
                                    setBlockchain('Tron');
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

            <BigModal
                visable={bindModal}
                title={intl.formatMessage({
                    id: 'social.bind.blockchain.title',
                }, {
                    blockchain: blockchain,
                })}
                content={
                    <BindModal
                        blockchain={blockchain}
                        setBindModal={setBindModal}
                    />}
                close={() => {
                    setBindModal(false);
                    history.replace(config.page.accountPage);
                }}
                footer={
                    <>
                        <Button
                            block
                            shape='round'
                            size='large'
                            onClick={() => {
                                setBindModal(false);
                            }}
                        >
                            {intl.formatMessage({
                                id: 'common.close',
                            })}
                        </Button>
                    </>
                }
            />
        </>
    )
}

export default Blockchain;
