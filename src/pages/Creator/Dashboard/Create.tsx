/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Input, Statistic, Typography } from 'antd';
import { useIntl, history } from 'umi';

import styles from '../style.less';
import { DownOutlined } from '@ant-design/icons';
import { formatBalance } from '@polkadot/types/node_modules/@polkadot/util';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { NftMint } from '@/services/parami/nft';
import { message } from 'antd';
import config from '@/config/config';

const { Title } = Typography;
const keystore = localStorage.getItem('controllerKeystore');

const Create: React.FC<{
    deposit: string,
    reach: boolean,
}> = ({ deposit, reach }) => {
    const [step, setStep] = useState<string>('before');
    const [submitting, setSubmitting] = useState(false);
    const [secModal, setSecModal] = useState(false);
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');

    const intl = useIntl();

    const handleSubmit = async () => {
        if (!!keystore) {
            try {
                setSubmitting(true);
                await NftMint(name, symbol, password, keystore);
                message.success(intl.formatMessage({
                    id: 'creator.create.congratulate',
                }));
                history.replace(config.page.creatorPage);
                setSubmitting(false);
            } catch (e: any) {
                message.error(e.message);
            }
        }
    };
    useEffect(() => {
        if (password != '') {
            handleSubmit();
        }
    }, [password])
    return (
        <>
            <div className={styles.dashboard}>
                {step === 'before' && (
                    <>
                        <div className={styles.header}>
                            <Statistic
                                title={
                                    <span
                                        style={{
                                            fontSize: 18,
                                        }}
                                    >
                                        {intl.formatMessage({
                                            id: 'creator.create.founded',
                                        })}
                                    </span>
                                }
                                // value={deposit.balanceOf} 
                                value={
                                    formatBalance(!!deposit ? deposit : 0, { withUnit: 'AD3' }, 18)
                                }
                                suffix=""
                                valueStyle={{
                                    fontSize: 32,
                                    fontWeight: 900,
                                }}
                                className={styles.statistic}
                            />
                        </div>
                        <div className={styles.buttons}>
                            <Button
                                block
                                type="primary"
                                shape="round"
                                size="large"
                                disabled={!reach}
                                className={styles.buttonContent}
                                style={{
                                    width: '100%',
                                }}
                                onClick={() => setStep('confirm')}
                            >
                                {intl.formatMessage({
                                    id: 'creator.create.becomeKOL',
                                })}
                            </Button>
                        </div>
                    </>
                )}
                {step === 'confirm' && (
                    <>
                        <div className={styles.confirm}>
                            <img
                                src={'/images/icon/vip.svg'}
                                className={styles.topIcon}
                            />
                            <Title
                                level={2}
                                style={{
                                    fontWeight: 'bold',
                                }}
                                className={styles.title}
                            >
                                {intl.formatMessage({
                                    id: 'creator.create.becomeKOL',
                                })}
                            </Title>
                            <div className={styles.field}>
                                <div className={styles.title}>
                                    {intl.formatMessage({
                                        id: 'creator.create.nftName',
                                    })}
                                </div>
                                <div className={styles.value}>
                                    <Input
                                        autoFocus
                                        className={styles.input}
                                        onChange={(a) => { setName(a.target.value) }}
                                        disabled={submitting}
                                    />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <div className={styles.title}>
                                    {intl.formatMessage({
                                        id: 'creator.create.nftSymbol',
                                    })}
                                </div>
                                <div className={styles.value}>
                                    <Input
                                        autoFocus
                                        className={styles.input}
                                        onChange={(a) => { setSymbol(a.target.value) }}
                                        disabled={submitting}
                                    />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <div className={styles.title}>
                                    {intl.formatMessage({
                                        id: 'creator.create.nftReserved',
                                    })}
                                    <br />
                                    <small>
                                        {intl.formatMessage({
                                            id: 'creator.create.belong2u',
                                        })}
                                    </small>
                                </div>
                                <div className={styles.value}>
                                    1,000,000
                                    <br />
                                    {intl.formatMessage({
                                        id: 'creator.create.nft.reserved.unlock',
                                    })}
                                </div>
                            </div>
                            <div className={styles.field}>
                                <div className={styles.title}>
                                    {intl.formatMessage({
                                        id: 'creator.create.nft.liquid',
                                    })}
                                    <br />
                                    <small>
                                        {intl.formatMessage({
                                            id: 'creator.create.nft.add2liquid',
                                        })}
                                    </small>
                                </div>
                                <div className={styles.value}>
                                    1,000,000
                                </div>
                            </div>
                            <div className={styles.field}>
                                <div className={styles.title}>
                                    {intl.formatMessage({
                                        id: 'creator.create.founded',
                                    })}
                                    <br />
                                    <small>
                                        {intl.formatMessage({
                                            id: 'creator.create.nft.add2liquid',
                                        })}
                                    </small>
                                </div>
                                <div className={styles.value}>
                                    {formatBalance(deposit, { withUnit: 'AD3' }, 18)}
                                </div>
                            </div>
                            <DownOutlined
                                style={{
                                    fontSize: 30,
                                    color: '#ff5b00',
                                    marginBottom: 20,
                                }}
                            />
                            <div className={styles.field}>
                                <div className={styles.title}>
                                    {intl.formatMessage({
                                        id: 'creator.create.nft.total',
                                    })}
                                </div>
                                <div className={styles.value}>
                                    10,000,000
                                    <br />
                                    {intl.formatMessage({
                                        id: 'creator.create.nft.total.unlock',
                                    })}
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                <Button
                                    block
                                    type="primary"
                                    shape="round"
                                    size="large"
                                    className={styles.button}
                                    loading={submitting}
                                    onClick={() => setSecModal(true)}
                                >
                                    {intl.formatMessage({
                                        id: 'common.continue',
                                    })}
                                </Button>
                                <Button
                                    block
                                    type="text"
                                    shape="round"
                                    size="large"
                                    className={styles.button}
                                    onClick={() => history.goBack()}
                                >
                                    {intl.formatMessage({
                                        id: 'common.cancel',
                                    })}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <SecurityModal
                visable={secModal}
                setVisable={setSecModal}
                password={password}
                setPassword={setPassword}
            // func={handleSubmit}
            />
        </>
    )
}

export default Create;
