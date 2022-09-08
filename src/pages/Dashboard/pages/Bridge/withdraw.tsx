import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { Button, Image, Input, message, notification, Tooltip } from 'antd';
import style from './style.less';
import { ArrowDownOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ERC20TokenToETH, getTokenBalanceOnEth, getTokenBalanceOnParami } from '@/services/parami/xAssets';
import { isETHAddress } from '@/utils/checkAddress';
import { BigIntToFloatString, FloatStringToBigInt } from '@/utils/format';
import SelectToken from './SelectToken';
import TransactionFeeModal from './TransactionFeeModal';
import Token from '@/components/Token/Token';
import { ChainBridgeToken } from '@/models/chainbridge';
import { ethers } from 'ethers';
import BRIDGE_ABI from '@/pages/Dashboard/pages/Bridge/abi/Bridge.json';

const Withdraw: React.FC<{
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setStep: React.Dispatch<React.SetStateAction<number>>;
	setETHHash: React.Dispatch<React.SetStateAction<string | undefined>>;
	setParamiHash: React.Dispatch<React.SetStateAction<string | undefined>>;
}> = ({ setLoading, setStep, setETHHash, setParamiHash }) => {
	const apiWs = useModel('apiWs');
	const {
		Account,
		ChainName,
		Provider,
		Signer,
	} = useModel('web3');
	const { dashboard } = useModel('currentUser');
	const { SubBridgeEvents, UnsubBridgeEvents, ProposalEvent } = useModel('dashboard.bridgeEvents');
	const [txNonce, setTxNonce] = useState<bigint>(BigInt(0));
	const [amount, setAmount] = useState<string>('');
	const [destinationAddress, setDestinationAddress] = useState<string>();
	const [selectModal, setSelectModal] = useState<boolean>(false);
	const [transferFeeModal, setTransferFeeModal] = useState<boolean>(false);
	const [bridgeContract, setBridgeContract] = useState<ethers.Contract>();

	const { tokens, contractAddresses } = useModel('chainbridge');

	const [selectedToken, setSelectedToken] = useState<ChainBridgeToken>();
	const [balanceOnParami, setBalanceOnParami] = useState<string>('');
	const [balanceOnEth, setBalanceOnEth] = useState<string>('');

	useEffect(() => {
		if (tokens?.length) {
			setSelectedToken(tokens[0]);
		}
	}, [tokens])

	useEffect(() => {
		if (contractAddresses?.bridge && Signer) {
			setBridgeContract(new ethers.Contract(contractAddresses?.bridge, BRIDGE_ABI, Signer));
		}
	}, [contractAddresses, Signer]);

	const intl = useIntl();

	useEffect(() => {
		if (selectedToken && Signer && Account) {
			getTokenBalanceOnEth(selectedToken, Signer, Account).then(balance => {
				setBalanceOnEth(balance);
			});
		}
	}, [selectedToken, Signer, Account]);

	useEffect(() => {
		if (selectedToken && apiWs && dashboard?.account) {
			getTokenBalanceOnParami(selectedToken, dashboard.account).then(balance => {
				setBalanceOnParami(balance.free);
			});
		}
	}, [selectedToken, apiWs, dashboard]);

	const handleSubmit = async () => {
		if (!Provider || !Signer) return;

		if (!isETHAddress(destinationAddress)) {
			message.error('Please input ETH Address!');
			setLoading(false);
			return;
		}

		setTransferFeeModal(true);
	};

	const withdraw = async () => {
		try {
			setLoading(true);

			const paramiRes: any = await ERC20TokenToETH(selectedToken!, JSON.parse(dashboard.accountMeta!), FloatStringToBigInt(amount, selectedToken!.decimals).toString(), destinationAddress as string);
			setTxNonce(BigInt(paramiRes.chainBridge.FungibleTransfer[0][1]));
			setParamiHash(paramiRes.blockHash);
			setStep(2);

			if (bridgeContract) {
				SubBridgeEvents(bridgeContract);
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
		if (ProposalEvent?.depositNonce === txNonce && ProposalEvent?.status === 'Executed') {
			setStep(3);
			setTxNonce(BigInt(0));
			notification.success({
				message: 'Withdraw Success',
			});
			if (ProposalEvent.txHash) {
				setETHHash(ProposalEvent.txHash);
			};
			if (bridgeContract) {
				UnsubBridgeEvents(bridgeContract);
			}
			setSelectedToken({ ...selectedToken! });
		}
	}, [bridgeContract, ProposalEvent, UnsubBridgeEvents, txNonce]);

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
								defaultMessage: 'Balance Available',
							})}:
						</span>
						<Tooltip placement="top" title={BigIntToFloatString(balanceOnParami, selectedToken?.decimals ?? 18)}>
							<span className={style.balanceDetailsBalance}>
								<Token value={balanceOnParami} symbol={selectedToken?.symbol} decimals={selectedToken?.decimals} />
							</span>
						</Tooltip>
					</div>
				</div>
				<div className={style.tokenAndAmountDetails}>
					<div
						className={style.tokenDetails}
						onClick={() => {
							setSelectModal(true);
						}}
					>
						<Image
							src={selectedToken?.icon}
							preview={false}
							className={style.chainIcon}
						/>
						<span className={style.tokenDetailsTokenName}>{selectedToken?.name}</span>
						<DownOutlined className={style.tokenDetailsArrow} />
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
								setAmount(BigIntToFloatString(balanceOnParami, selectedToken?.decimals ?? 18));
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
					<span className={style.chainDetailsChainName}>{ChainName}</span>
				</div>
				<div className={style.balanceDetails}>
					<span className={style.balanceDetailsLabel}>
						{intl.formatMessage({
							id: 'dashboard.bridge.balance',
							defaultMessage: 'Balance',
						})}:
					</span>
					<Tooltip placement="top" title={BigIntToFloatString(balanceOnEth, selectedToken?.decimals ?? 18)}>
						<span className={style.balanceDetailsBalance}>
							<Token value={balanceOnEth} symbol={selectedToken?.symbol} decimals={selectedToken?.decimals} />
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
						setDestinationAddress(Account);
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
				disabled={!amount || !destinationAddress || FloatStringToBigInt(amount, selectedToken?.decimals ?? 18) <= BigInt(0) || FloatStringToBigInt(amount, selectedToken?.decimals ?? 18) > BigInt(balanceOnParami)}
			>
				{intl.formatMessage({
					id: 'dashboard.bridge.transfer',
					defaultMessage: 'Transfer',
				})}
			</Button>

			{selectModal && <SelectToken
				onClose={() => setSelectModal(false)}
				onSelectToken={(token) => {
					setSelectedToken(token);
					setSelectModal(false);
				}}
				chain={'parami'}
			/>}

			{transferFeeModal && selectedToken && (
				<TransactionFeeModal
					onCancel={() => setTransferFeeModal(false)}
					onConfirm={() => {
						setTransferFeeModal(false);
						withdraw();
					}}
					amount={amount}
					token={selectedToken}
				/>
			)}
		</>
	)
}

export default Withdraw;
