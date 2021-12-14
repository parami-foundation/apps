/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, Button, Input } from 'antd';
import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/dashboard.less';
import AD3 from '@/components/Token/AD3';
import Token from '@/components/Token/Token';
import { BigNumber, ethers, utils } from 'ethers';
import BRIDGE_ABI from './abi/Bridge.json';
import config from './config';
import { contractAddresses } from '../Stake/config';
import { FloatStringToBigInt } from '@/utils/format';
import AD3Abi from '@/pages/Dashboard/pages/Stake/abi/ERC20.json';
import { decodeAddress } from '@polkadot/util-crypto';
import { useEffect } from 'react';

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

const Ethereum: React.FC<{
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setLoading }) => {
    const { account, chainName, provider, signer } = useModel('metaMask');
    const [errorState, setErrorState] = useState<API.Error>({});
    const [freeBalance, setFreeBalance] = useState<string>('');

    const [amount, setAmount] = useState<string>('');
    const [destinationAddress, setDestinationAddress] = useState<string>('');

    const intl = useIntl();

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

    const handleSubmit = async () => {
        if (!provider || !signer) return;
        setLoading(true);

        const recipient = `0x${Buffer.from(decodeAddress(destinationAddress)).toString(
            "hex"
        )}`;
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
            const ad3 = new ethers.Contract(contractAddresses.ad3[4], AD3Abi, provider);
            const ad3_rw = ad3.connect(signer);
            await (
                await ad3_rw.approve(
                    config.ERC20HandlerContract.address,
                    BigNumber.from(
                        utils.parseUnits(amount.toString(), 18)
                    )
                )
            ).wait();

            const bridge = new ethers.Contract(config.bridge.address, BRIDGE_ABI, provider);
            const bridge_rw = bridge.connect(signer);
            await (
                await bridge_rw.deposit(
                    config.bridge.destinationChainId,
                    config.resource.id,
                    data,
                )
            ).wait();
            setLoading(false);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            })
            setLoading(false);
        }
    }

    useEffect(() => {
        getBalance();
    }, [signer]);

    return (
        <>
            <div className={styles.windowCardBody}>
                {errorState.Message && <Message content={errorState.Message} />}
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.homeNetwork',
                            defaultMessage: 'Home network',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Input
                            bordered={true}
                            size='large'
                            value={chainName}
                            disabled
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.fromAccount',
                            defaultMessage: 'From Account',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Input
                            bordered={true}
                            size='large'
                            value={account}
                            disabled
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.destinationNetwork',
                            defaultMessage: 'Destination network',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Input
                            bordered={true}
                            size='large'
                            value={'Parami'}
                            disabled
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.amount',
                            defaultMessage: 'Amount',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Input
                            className={'after'}
                            bordered={true}
                            size='large'
                            onChange={(e) => {
                                setAmount(e.target.value);
                            }}
                            value={amount}
                            type='number'
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.destinationAddress',
                            defaultMessage: 'Destination Address',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Input
                            className={'after'}
                            bordered={true}
                            size='large'
                            onChange={(e) => {
                                setDestinationAddress(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className={styles.rowField}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.availableBalance',
                            defaultMessage: 'Available Balance',
                        })}
                    </div>
                    <div className={styles.value}>
                        <AD3 value={freeBalance} />
                    </div>
                </div>
                <div className={styles.rowField}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.bridge.bridgeFee',
                            defaultMessage: 'Bridge Fee',
                        })}
                    </div>
                    <div className={styles.value}>
                        <Token value={'0'} symbol='ETH' />
                    </div>
                </div>
                <div className={styles.field}>
                    <Button
                        block
                        type='primary'
                        size='large'
                        shape='round'
                        onClick={() => {
                            handleSubmit();
                        }}
                        disabled={!amount || !destinationAddress || FloatStringToBigInt(amount, 18) <= BigInt(0)}
                    >
                        {intl.formatMessage({
                            id: 'common.submit',
                        })}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Ethereum;
