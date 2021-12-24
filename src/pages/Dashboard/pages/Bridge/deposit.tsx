import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { Alert, Button, Image, Input, message, Tooltip } from 'antd';
import style from './style.less';
import { ArrowDownOutlined, PlusOutlined } from '@ant-design/icons';
import { BigNumber, utils } from 'ethers';
import { decodeAddress } from '@polkadot/util-crypto';
import config from './config';
import AD3 from '@/components/Token/AD3';
import { BigIntToFloatString, FloatStringToBigInt } from '@/utils/format';
import { hexToDid } from '@/utils/common';
import { QueryAccountFromDid } from '@/services/parami/wallet';

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

const Deposit: React.FC<{
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setLoading }) => {
    const { account, chainName, provider, signer } = useModel('metaMask');
    const { Events,
        SubParamiEvents } = useModel('dashboard.paramiEvents');
    const { stash } = useModel('dashboard.balance');
    const { Ad3Contract, BridgeContract } = useModel('contracts');
    const [errorState, setErrorState] = useState<API.Error>({});
    const [freeBalance, setFreeBalance] = useState<string>('');
    const [waitingParami, setWaitingParami] = useState<boolean>(false);
    const [txNonce, setTxNonce] = useState<bigint>(BigInt(0));
    const [amount, setAmount] = useState<string>('');
    const [destinationAddress, setDestinationAddress] = useState<string>('');


    const Did = localStorage.getItem('dashboardDid') as string;

    const intl = useIntl();
    function isDepositSuccessEvent(item: any, nonce: bigint) {
        if (`${item.event.section}:${item.event.method}` === 'chainBridge:ProposalSucceeded') {
            if (BigInt(item.event.data[1].toString()) === nonce) {
                return true;
            }
        }
        return false;
    }
    useEffect(() => {
        if (waitingParami) {
            for (const item of Events) {
                console.log('event', `${item.event.section}:${item.event.method}`);
                if (isDepositSuccessEvent(item, txNonce)) {
                    setWaitingParami(false);
                    console.log(window.unsubParami);
                    window.unsubParami();
                    message.success('deposit success');
                }
            }
        } else {

        }
    }, [Events, txNonce, waitingParami]);
    const getBalance = async () => {
        if (!provider || !signer) return;
        try {
            const balance = await Ad3Contract?.balanceOf(account);
            setFreeBalance(BigNumber.from(balance).toString());
        } catch (e: any) {
            console.log(e.message);
        }
    }

    const handleSubmit = async () => {
        if (!provider || !signer) return;
        setLoading(true);

        let recipient: string = destinationAddress;
        if (destinationAddress.indexOf('did:ad3') > -1) {
            try {
                const user: any = await QueryAccountFromDid(destinationAddress);
                if (!user) {
                    return;
                }
                recipient = user.account;
            } catch (e: any) {
                message.error(e.message);
            }
        }

        recipient = `0x${Buffer.from(decodeAddress(recipient)).toString("hex")}`;

        const data =
            "0x" +
            utils
                .hexZeroPad(
                    // TODO Wire up dynamic token decimals
                    BigNumber.from(
                        utils.parseUnits(amount, 18)
                    ).toHexString(),
                    32
                )
                .substring(2) + // Deposit Amount (32 bytes)
            utils
                .hexZeroPad(utils.hexlify((recipient.length - 2) / 2), 32)
                .substring(2) + // len(recipientAddress) (32 bytes)
            recipient.substring(2); // recipientAddress (?? bytes)

        try {
            await (
                await Ad3Contract?.approve(
                    config.ERC20HandlerContract.address,
                    BigNumber.from(
                        utils.parseUnits(amount.toString(), 18)
                    )
                )
            ).wait();

            const ethRes = await (
                await BridgeContract?.deposit(
                    config.bridge.destinationChainId,
                    config.resource.id,
                    data,
                )
            ).wait();
            const nonce = BigInt(ethRes.logs[2].topics[3]);
            console.log('nonce', BigInt(ethRes.logs[2].topics[3]))
            setTxNonce(nonce);
            setLoading(false);

            setWaitingParami(true);
            window.unsubParami = await SubParamiEvents();

        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            })
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!account||!Ad3Contract) return;
        getBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signer, provider, Ad3Contract, account]);

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
                        <Tooltip placement="top" title={BigIntToFloatString(freeBalance, 18)}>
                            <span className={style.balanceDetailsBalance}>
                                <AD3 value={freeBalance} />
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
                                setAmount(BigIntToFloatString(freeBalance, 18));
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
                    <Tooltip placement="top" title={BigIntToFloatString(stash.total, 18)}>
                        <span className={style.balanceDetailsBalance}>
                            <AD3 value={stash.total} />
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
                    placeholder='did:ad3:......'
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
                        setDestinationAddress(hexToDid(Did));
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
                disabled={!amount || !destinationAddress || FloatStringToBigInt(amount, 18) <= BigInt(0)}
            >
                {intl.formatMessage({
                    id: 'dashboard.bridge.transfer',
                    defaultMessage: 'Transfer',
                })}
            </Button>
        </>
    )
}

export default Deposit;
