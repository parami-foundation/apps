import React from 'react';
import { useIntl } from 'umi';
import { Typography, Image, Card, Button, Input, Alert } from 'antd';
import styles from '@/pages/wallet.less';
import style from '../style.less';

const { TextArea } = Input;

const did = localStorage.getItem('did') as string;
const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

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

const Blockchain: React.FC = () => {
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
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
                                })}
                            </Button>
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            <img className={style.icon} src="/images/crypto/bitcoin-btc-logo.svg" />
                            <span className={style.label}>BTC</span>
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
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
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
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
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
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
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
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
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
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
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
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
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'profile.sns.bind',
                                    defaultMessage: 'Bind'
                                })}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default Blockchain;
