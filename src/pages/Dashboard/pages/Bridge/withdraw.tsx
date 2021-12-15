import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { Alert, Button, Image, Input, message, Tooltip } from 'antd';
import style from './style.less';
import { ArrowDownOutlined, PlusOutlined } from '@ant-design/icons';
import { AD3ToETH } from '@/services/parami/bridge';
import { isETHAddress } from '@/utils/checkAddress';
import { BigNumber, ethers } from 'ethers';
import { contractAddresses } from '../Stake/config';
import AD3Abi from '@/pages/Dashboard/pages/Stake/abi/ERC20.json';
import AD3 from '@/components/Token/AD3';
import { BigIntToFloatString, FloatStringToBigInt } from '@/utils/format';

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

const Withdraw: React.FC<{
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setLoading }) => {
    const { account, chainName, provider, signer } = useModel('metaMask');
    const { stash } = useModel('dashboard.balance');
    const [errorState, setErrorState] = useState<API.Error>({});
    const [freeBalance, setFreeBalance] = useState<any>(null);

    const [amount, setAmount] = useState<string>('');
    const [destinationAddress, setDestinationAddress] = useState<string>();

    const intl = useIntl();

    const currentAccount = localStorage.getItem('dashboardCurrentAccount') as string;

    const handleSubmit = async () => {
        setLoading(true);
        if (!isETHAddress(destinationAddress)) {
            message.error('Please input ETH Address!');
            setLoading(false);
            return;
        }

        try {
            await AD3ToETH(JSON.parse(currentAccount), FloatStringToBigInt(amount, 18).toString(), destinationAddress as string);
            setLoading(false);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e,
            });
            setLoading(false);
        }
    }

    const getBalance = async () => {
        if (!provider || !signer) return;
        try {
            const ad3 = new ethers.Contract(contractAddresses.ad3[4], AD3Abi, provider);
            const ad3_rw = await ad3.connect(signer);
            const balance = await ad3_rw.balanceOf(account);
            setFreeBalance(BigNumber.from(balance).toString());
        } catch (e: any) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        getBalance();
    }, [signer]);

    return (
        <>
            {errorState.Message && <Message content={errorState.Message} />}
            <div className={style.fromLabel}>
                {intl.formatMessage({
                    id: 'dashboard.bridge.from',
                    defaultMessage: 'From',
                })}
            </div>
            <div className={style.formSection}>
                <div className={style.chainAndBalanceDetails}>
                    <div className={style.chainDetails}>
                        <Image
                            src='/images/logo-core-colored-fit-into-round.svg'
                            preview={false}
                            className={style.chainIcon}
                        />
                        <span className={style.chainDetailsChainName}>Parami chain</span>
                    </div>
                    <div className={style.balanceDetails}>
                        <span className={style.balanceDetailsLabel}>
                            {intl.formatMessage({
                                id: 'dashboard.bridge.balance',
                                defaultMessage: 'Balance',
                            })}:
                        </span>
                        <Tooltip placement="top" title={'0.00'}>
                            <span className={style.balanceDetailsBalance}>
                                <AD3 value={stash.total} />
                            </span>
                        </Tooltip>
                    </div>
                </div>
                <div className={style.tokenAndAmountDetails}>
                    <div className={style.tokenDetails}>
                        <Image
                            src='/images/logo-round-core.svg'
                            preview={false}
                            className={style.chainIcon}
                        />
                        <span className={style.tokenDetailsTokenName}>AD3</span>
                    </div>
                    <div className={style.amountDetails}>
                        <Input
                            placeholder='0.00'
                            type='number'
                            size='large'
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                            }}
                        />
                        <Button
                            className={style.amountDetailsMaxButton}
                            type='link'
                            size='small'
                            onClick={() => {
                                setAmount(BigIntToFloatString(stash.total, 18));
                            }}
                        >
                            {intl.formatMessage({
                                id: 'dashboard.bridge.max',
                                defaultMessage: 'MAX',
                            })}
                        </Button>
                    </div>
                </div>
            </div>
            <div className={style.downArrowSection}>
                <ArrowDownOutlined />
            </div>
            <div className={style.toLabel}>
                {intl.formatMessage({
                    id: 'dashboard.bridge.to',
                    defaultMessage: 'To',
                })}
            </div>
            <div className={style.toChainAndBalanceDetails}>
                <div className={style.chainDetails}>
                    <Image
                        src='/images/crypto/ethereum-eth-logo.svg'
                        preview={false}
                        className={style.chainIcon}
                    />
                    <span className={style.chainDetailsChainName}>{chainName}</span>
                </div>
                <div className={style.balanceDetails}>
                    <span className={style.balanceDetailsLabel}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.balance',
                            defaultMessage: 'Balance',
                        })}:
                    </span>
                    <Tooltip placement="top" title={'0.00'}>
                        <span className={style.balanceDetailsBalance}>
                            <AD3 value={freeBalance} />
                        </span>
                    </Tooltip>
                </div>
            </div>
            <div className={style.downArrowSection}>
                <PlusOutlined />
            </div>
            <div className={style.destinationLabel}>
                {intl.formatMessage({
                    id: 'dashboard.bridge.destinationAddress',
                    defaultMessage: 'Destination Address',
                })}
            </div>
            <div className={style.destinationDetails}>
                <Input
                    placeholder='0x......'
                    type='text'
                    size='large'
                    value={destinationAddress}
                    onChange={(e) => {
                        setDestinationAddress(e.target.value);
                    }}
                />
                <Button
                    className={style.destinationMyAddressButton}
                    type='default'
                    size='small'
                    onClick={() => {
                        setDestinationAddress(account);
                    }}
                >
                    {intl.formatMessage({
                        id: 'dashboard.bridge.me',
                        defaultMessage: 'ME',
                    })}
                </Button>
            </div>
            <Button
                block
                type='primary'
                size='large'
                shape='round'
                className={style.transferButton}
                onClick={() => {
                    handleSubmit();
                }}
                disabled={!amount || !destinationAddress || FloatStringToBigInt(amount, 18) <= BigInt(0) || FloatStringToBigInt(amount, 18) > BigInt(freeBalance)}
            >
                {intl.formatMessage({
                    id: 'dashboard.bridge.transfer',
                    defaultMessage: 'Transfer',
                })}
            </Button>
        </>
    )
}

export default Withdraw;
