import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { Button, Image, Input, Tooltip, notification } from 'antd';
import style from './style.less';
import { ArrowDownOutlined, PlusOutlined } from '@ant-design/icons';
import { BigNumber, utils } from 'ethers';
import { decodeAddress } from '@polkadot/util-crypto';
import config from './config';
import AD3 from '@/components/Token/AD3';
import { BigIntToFloatString, FloatStringToBigInt } from '@/utils/format';
import { hexToDid } from '@/utils/common';
import { QueryAccountFromDid } from '@/services/parami/Identity';

const Deposit: React.FC<{
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setStep: React.Dispatch<React.SetStateAction<number>>;
	setETHHash: React.Dispatch<React.SetStateAction<string | undefined>>;
	setParamiHash: React.Dispatch<React.SetStateAction<string | undefined>>;
}> = ({ setLoading, setStep, setETHHash, setParamiHash }) => {
	const apiWs = useModel('apiWs');
	const { dashboard } = useModel('currentUser');
	const {
		Account,
		ChainName,
		Provider,
		Signer,
	} = useModel('web3');
	const { Events, SubParamiEvents } = useModel('dashboard.paramiEvents');
	const { DataHash, SubBridgeEvents, UnsubBridgeEvents } = useModel('dashboard.bridgeEvents');
	const { balance } = useModel('dashboard.balance');
	const { Ad3Contract, BridgeContract } = useModel('contracts');
	const [freeBalance, setFreeBalance] = useState<string>('');
	const [txNonce, setTxNonce] = useState<bigint>(BigInt(0));
	const [amount, setAmount] = useState<string>('');
	const [waitingParami, setWaitingParami] = useState<boolean>(false);
	const [destinationAddress, setDestinationAddress] = useState<string>('');

	const intl = useIntl();

	let unsubParami;
	const isDepositSuccessEvent = (item: any, nonce: bigint) => {
		if (`${item.event.section}:${item.event.method}` === 'chainBridge:ProposalSucceeded') {
			if (BigInt(item.event.data[1].toString()) === nonce) {
				return true;
			}
		}
		return false;
	};

	const getBalance = async () => {
		if (!Provider || !Signer) return;
		try {
			const balanceOf = await Ad3Contract?.balanceOf(Account);
			setFreeBalance(BigNumber.from(balanceOf).toString());
		} catch (e: any) {
			notification.error({
				message: e.message || e,
				duration: null,
			});
		}
	};

	const handleSubmit = async () => {
		if (!Provider || !Signer) return;

		let recipient: string = destinationAddress;

		if (destinationAddress.indexOf('did:ad3') > -1) {
			try {
				const user: any = await QueryAccountFromDid(destinationAddress);
				if (!user) {
					notification.error({
						message: 'Invalid DID',
						duration: null,
					});
				}
				recipient = user.account;
			} catch (e: any) {
				notification.error({
					message: e.message || e,
					duration: null,
				});
			}
		}

		recipient = `0x${Buffer.from(decodeAddress(recipient)).toString("hex")}`;

		const data =
			"0x" +
			utils
				.hexZeroPad(
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
			setLoading(true);
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
			setTxNonce(nonce);
			setStep(2);

			// Step 3
			setWaitingParami(true);
			unsubParami = await SubParamiEvents();

			if (BridgeContract) {
				SubBridgeEvents(BridgeContract);
			} else {
				notification.error({
					message: 'No bridge contract',
				});
			};
		} catch (e: any) {
			notification.error({
				message: e.message || e,
				duration: null,
			});
			setLoading(false);
		}
	}

	useEffect(() => {
		if (waitingParami) {
			for (const item of Events) {
				console.log('event', `${item.event.section}:${item.event.method}`);
				if (isDepositSuccessEvent(item, txNonce)) {
					setWaitingParami(false);
					setStep(3);
					unsubParami();
					notification.success({
						message: 'Deposit Success',
					});
					setParamiHash(item.transactionHash);
					if (!!DataHash) {
						setETHHash(DataHash);
					};
					if (BridgeContract) {
						UnsubBridgeEvents(BridgeContract);
					};
				}
			}
		}
	}, [Events, txNonce, waitingParami]);

	useEffect(() => {
		if (!Account || !Ad3Contract) return;
		if (apiWs) {
			getBalance();
		}
	}, [Signer, Provider, Ad3Contract, Account, apiWs]);

	return (
		<>
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
						<span className={style.chainDetailsChainName}>{ChainName}</span>
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
					<Tooltip placement="top" title={BigIntToFloatString(balance?.total, 18)}>
						<span className={style.balanceDetailsBalance}>
							<AD3 value={balance?.total} />
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
						setDestinationAddress(hexToDid(dashboard.did!));
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
