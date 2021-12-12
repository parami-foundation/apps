import React from 'react';
import { useEffect } from 'react';
import { Button, Card, Divider, Input, message, Tag, Typography } from 'antd';
import { useIntl } from 'umi';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import BigModal from '@/components/ParamiModal/BigModal';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, SyncOutlined } from '@ant-design/icons';
import {
    ChangeController,
    CreateAccount,
    GetStableAccount,
    QueryDid,
    QueryStableAccountByMagic,
    RestoreAccount,
} from '@/services/parami/wallet';
import { guid } from '@/utils/common';
import { mnemonicGenerate } from '@polkadot/util-crypto';


const { Title } = Typography;

const goto = (haveDid: boolean) => {
    setTimeout(() => {
        if (!haveDid) {
            window.location.href = config.page.createPage;
        }
        const redirect = sessionStorage.getItem('redirect');
        window.location.href = redirect || config.page.walletPage;
        sessionStorage.removeItem('redirect');
    }, 10);
};

const BypassPasswd: React.FC<{
    mnemonic: string;
}> = ({ mnemonic }) => {
    const [modalVisable, setModalVisable] = useState(false);
    const [ControllerUserAddress, setControllerUserAddress] = useState<string>('');
    const [MagicUserAddress, setMagicUserAddress] = useState<string>('');
    const [MagicKeystore, setMagicKeystore] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const intl = useIntl();

    useEffect(() => {

    }, []);

    async function Create() {
        const pswd = guid().substring(0, 6);
        const magicData = await RestoreAccount(
            pswd,
            mnemonic,
        );
        console.log(magicData)
        setMagicKeystore(magicData?.keystore as string);
        // Set Magic Address
        const controllerMnemonic = mnemonicGenerate(12);
        const newControllerData = await CreateAccount(
            controllerMnemonic,
            pswd,
        );
        const oldControllerAddress = await QueryStableAccountByMagic(
            magicData?.userAddress as string
        );
        if (oldControllerAddress == null) {
            goto(false);
            return;
        }
        console.log(oldControllerAddress);
        const existAccounts = await GetStableAccount(oldControllerAddress);
        if (existAccounts == null) {
            goto(false);
            return;
        }
        console.log(existAccounts);
        const didData = await QueryDid(existAccounts?.stashAccount);
        if (didData !== null) {
            localStorage.setItem('did', didData as string);
        } else {
            goto(false);
            return;
        }
        setControllerUserAddress(newControllerData.userAddress);
        setMagicKeystore(magicData?.keystore as string);
        setMagicUserAddress(magicData?.userAddress as string);
        setPassword(pswd);
        localStorage.setItem('stamp', pswd);
        localStorage.setItem('magicUserAddress', magicData?.userAddress as string);
        localStorage.setItem('controllerUserAddress', newControllerData.userAddress as string);
        localStorage.setItem('controllerKeystore', newControllerData.keystore as string);
        localStorage.setItem('stashUserAddress', existAccounts?.stashAccount as string);
        //localStorage.setItem('magicKeystore', magicData?.keystore as string);
    }
    useEffect(() => {
        if (Password !== '') {
            console.log(MagicUserAddress)
            fetchChargeStatus();
        }
    }, [Password]);
    useEffect(() => {
        Create();
    }, []);

    const fetchChargeStatus = async () => {
        setTimeout(async () => {
            try {
                await ChangeController(
                    Password,
                    MagicKeystore,
                    ControllerUserAddress,
                );
                const existAccounts = await GetStableAccount(ControllerUserAddress);
                if (existAccounts == null) {
                    return;
                }
                // Query DID
                const didData = await QueryDid(existAccounts?.stashAccount);
                if (didData !== null) {
                    localStorage.setItem('did', didData as string);
                    goto(true);
                    return;
                }
            } catch (e: any) {
                console.log(e.message);
            }
            await fetchChargeStatus();
        }, 2000);
    };


    return (
        <>
            <Card className={styles.card}>
                <img src={'/images/icon/transaction.svg'} className={style.topIcon} />
                <Title
                    level={2}
                    style={{
                        fontWeight: 'bold',
                    }}
                    className={style.title}
                >
                    {intl.formatMessage({
                        id: 'account.recoverDeposit.title',
                    })}
                </Title>
                <p className={style.description}>
                    {intl.formatMessage({
                        id: 'account.recoverDeposit.description',
                    })}
                </p>
                <Divider />
                <Button
                    type="link"
                    onClick={() => {
                        setModalVisable(true);
                    }}
                >
                    {intl.formatMessage({
                        id: 'account.initialDeposit.whereToBuy',
                    })}
                </Button>
                <div className={style.listBtn}>
                    <div
                        className={style.field}
                        style={{
                            flexDirection: 'column',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginBottom: 10,
                            }}
                        >
                            <span className={style.title}>
                                {intl.formatMessage({
                                    id: 'account.recoverDeposit.magicAddress',
                                })}
                            </span>
                            <span className={style.value}>
                                <CopyToClipboard
                                    text={MagicUserAddress}
                                    onCopy={() =>
                                        message.success(
                                            intl.formatMessage({
                                                id: 'common.copied',
                                            }),
                                        )
                                    }
                                >
                                    <Button type="link" icon={<CopyOutlined />}>
                                        {intl.formatMessage({
                                            id: 'common.copy',
                                        })}
                                    </Button>
                                </CopyToClipboard>
                            </span>
                        </div>
                        <CopyToClipboard
                            text={MagicUserAddress}
                            onCopy={() =>
                                message.success(
                                    intl.formatMessage({
                                        id: 'common.copied',
                                    }),
                                )
                            }
                        >
                            <Input
                                size="small"
                                readOnly
                                value={MagicUserAddress}
                            />
                        </CopyToClipboard>
                    </div>
                    <div className={style.field}>
                        <span className={style.title}>
                            {intl.formatMessage({
                                id: 'account.initialDeposit.status',
                            })}
                        </span>
                        <span className={style.value}>
                            <Tag color="processing" icon={<SyncOutlined spin />}>
                                {intl.formatMessage({
                                    id: 'account.initialDeposit.status.pending',
                                })}
                            </Tag>
                        </span>
                    </div>
                    <div className={style.field}>
                        <span className={style.title}>
                            {intl.formatMessage({
                                id: 'account.initialDeposit.minCharge',
                            })}
                        </span>
                        <span className={style.value}>2 AD3</span>
                    </div>
                    <a
                        style={{
                            textDecoration: 'underline',
                            color: 'rgb(114, 114, 122)',
                        }}
                        onClick={() => {
                            localStorage.clear();
                            sessionStorage.clear();
                            window.location.href = config.page.homePage;
                        }}
                    >
                        {intl.formatMessage({
                            id: 'account.restart',
                        })}
                    </a>
                </div>
            </Card>
            <BigModal
                visable={modalVisable}
                title={intl.formatMessage({
                    id: 'account.initialDeposit.buyAD3',
                })}
                content={
                    <>
                        <div className={style.exchanges}>
                            <a href="https://www.binance.com/" target="_blank" rel="noreferrer">
                                <img src="/images/exchange/binance-logo.svg" alt="BINANCE" />
                            </a>
                            <a href="https://www.gate.io/" target="_blank" rel="noreferrer">
                                <img src="/images/exchange/gate-io-logo.svg" alt="GATE" />
                            </a>
                        </div>
                    </>
                }
                footer={
                    <>
                        <Button
                            block
                            shape='round'
                            size='large'
                            onClick={() => {
                                setModalVisable(false);
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
    );
};

export default BypassPasswd;
