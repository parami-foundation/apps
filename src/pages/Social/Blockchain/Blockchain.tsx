import BigModal from '@/components/ParamiModal/BigModal';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { LinkBlockChain } from '@/services/parami/linker';
import { Alert, Button, Divider, Input, message, notification, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useIntl, useModel, history } from 'umi';
import styles from '../style.less';
import { hexToDid } from '@/utils/common';
import { signPersonalMessage } from '@/services/walletconnect/walletconnect';
import { signPolkadotMessage, signSolanaMessage } from '@/services/tokenpocket/tokenpocket';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { convertUtf8ToHex } from '@walletconnect/utils';
import config from '@/config/config';

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

const BindModal: React.FC<{
	blockchain: string,
	setBindModal: React.Dispatch<React.SetStateAction<boolean>>,
}> = ({ blockchain, setBindModal }) => {
	const stmap = localStorage.getItem('stamp');
	const [errorState, setErrorState] = useState<API.Error>({});
	const [origin, setOrigin] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [signed, setSigned] = useState<string>('');
	const [password, setPassword] = useState<string>(stmap || '');
	const [secModal, setSecModal] = useState(false);
	const [type, setType] = useState<string>('');
	const [collapse, setCollapse] = useState<boolean>(false);
	const [WConnected, setWConnected] = useState<boolean>(false);
	const [connector, setConnector] = useState<any>(null);

	async function sign() {
		const signedMsg = await connector.signPersonalMessage([convertUtf8ToHex('asddasdas'), address])
		console.log(signedMsg)
	};

	const intl = useIntl();

	const handleSubmit = async () => {
		switch (type) {
			case 'walletconnect':
				console.log(password)
				try {
					const { account, signedMsg } = await signPersonalMessage(origin);
					notification.info({
						message: 'Got an signed message',
						description: signedMsg,
						duration: 2
					})
					await LinkBlockChain(blockchain, account, signedMsg, password, controllerKeystore);
					setBindModal(false);
				} catch (e: any) {
					message.error(e.message);
					return;
				}
			case 'tokenpocket':
				try {
					let res: {
						address: string,
						result: string,
					} = { address: '', result: '' }
					switch (blockchain) {
						case 'Solana':
							res = await signSolanaMessage(origin);
						case 'Polkadot':
							res = await signPolkadotMessage(origin);
					}
					await LinkBlockChain(blockchain, res.address, res.result, password, controllerKeystore);
					setBindModal(false);
				} catch (e: any) {
					message.error(e.message);
					return;
				}
			default:
				let Signed = signed;
				if (Signed.indexOf('0x') < 0) {
					message.error(intl.formatMessage({
						id: 'error.bind.signWrong',
					}));
					return;
				};
				if (blockchain === 'Polkadot' || blockchain === 'Solana') {
					Signed = `0x00${signed.substring(2)}`;
				};
				try {
					await LinkBlockChain(blockchain, address, Signed, password, controllerKeystore);
				} catch (e: any) {
					setErrorState({
						Type: 'chain error',
						Message: e.message,
					});
					return;
				}
				setBindModal(false);
				setSecModal(false);
		}
	};

	useEffect(() => {
		setOrigin(`Link: ${hexToDid(did)}`);
	}, []);

	useEffect(() => {
		if (blockchain === 'Ethereum' || blockchain === 'Polkadot' || blockchain === 'Solana' || blockchain === 'Tron') {
			setCollapse(true);
		} else {
			setCollapse(false);
		};
	}, [blockchain, password]);

	useEffect(() => {
		console.log('Connection status changed')
		if (WConnected) {
			sign();
		}
	}, [WConnected]);

	return (
		<>
			<div className={styles.bindModal}>
				{errorState.Message && <Message content={errorState.Message} />}
				{blockchain === 'Ethereum' && (
					<>
						<Button
							block
							type='primary'
							size='large'
							shape='round'
							className={styles.iconButton}
							style={{
								backgroundColor: '#3B99FC',
							}}
							onClick={() => {
								setType('walletconnect');
								setSecModal(true);
							}}
						>
							{intl.formatMessage({
								id: 'social.blockchain.walletconnet',
							})}
						</Button>
						<div
							style={{
								display: 'flex',
								width: '100%',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							onClick={() => {
								setCollapse(!collapse);
							}}
						>
							<Divider>
								{intl.formatMessage({
									id: 'social.blockchain.manual',
								})}
								<Button
									type="link"
									icon={
										<DownOutlined
											rotate={!collapse ? 0 : -180}
											className={styles.expandButtonIcon}
										/>
									}
									onClick={() => {
										setCollapse(!collapse);
									}}
								/>
							</Divider>
						</div>
					</>
				)}
				{(blockchain === 'Polkadot' || blockchain === 'Solana' || blockchain === 'Tron') && (
					<>
						<Button
							block
							type='primary'
							size='large'
							shape='round'
							className={styles.iconButton}
							style={{
								backgroundColor: '#2980FE',
							}}
							onClick={() => {
								setType('tokenpocket');
								setSecModal(true);
							}}
						>
							{intl.formatMessage({
								id: 'social.blockchain.tokenpocket',
							})}
						</Button>
						<div
							style={{
								display: 'flex',
								width: '100%',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							onClick={() => {
								setCollapse(!collapse);
							}}
						>
							<Divider>
								{intl.formatMessage({
									id: 'social.blockchain.manual',
								})}
								<Button
									type="link"
									icon={
										<DownOutlined
											rotate={!collapse ? 0 : -180}
											className={styles.expandButtonIcon}
										/>
									}
									onClick={() => {
										setCollapse(!collapse);
									}}
								/>
							</Divider>
						</div>
					</>
				)}
				<div
					className={styles.manualContainer}
					style={{
						maxHeight: !collapse ? '100vh' : 0,
					}}
				>
					<div className={styles.field}>
						<div className={styles.title}>
							{intl.formatMessage({
								id: 'social.blockchain.originText',
							})}
						</div>
						<div className={styles.value}>
							<CopyToClipboard
								text={origin}
								onCopy={() => message.success(
									intl.formatMessage({
										id: 'common.copied',
									})
								)}
							>
								<Input
									readOnly
									size='large'
									value={origin}
								/>
							</CopyToClipboard>
						</div>
					</div>
					<Divider>
						{intl.formatMessage({
							id: 'social.blockchain.tip',
						})}
					</Divider>
					<div className={styles.field}>
						<div className={styles.title}>
							{intl.formatMessage({
								id: 'social.blockchain.signed',
							})}
						</div>
						<div className={styles.value}>
							<TextArea
								size='large'
								rows={4}
								value={signed}
								onChange={(e) => { setSigned(e.target.value) }}
							/>
						</div>
					</div>
					<div className={styles.field}>
						<div className={styles.title}>
							{intl.formatMessage({
								id: 'social.blockchain.address',
							})}
						</div>
						<div className={styles.value}>
							<Input
								size='large'
								onChange={(e) => { setAddress(e.target.value) }}
							/>
						</div>
					</div>
					<div className={styles.field}>
						<Button
							block
							size='large'
							type='primary'
							shape='round'
							onClick={() => {
								setPassword('');
								setSecModal(true);
							}}
							disabled={!address || !signed}
						>
							{intl.formatMessage({
								id: 'common.submit',
							})}
						</Button>
					</div>
				</div>
			</div>

			<SecurityModal
				visable={secModal}
				setVisable={setSecModal}
				password={password}
				setPassword={setPassword}
				func={handleSubmit}
			/>
		</>
	)
}

const Blockchain: React.FC<{
	from: string;
}> = ({ from }) => {
	const [bindModal, setBindModal] = useState<boolean>(false);
	const [blockchain, setBlockchain] = useState<string>('');

	const linkedInfo = useModel('sns');

	const intl = useIntl();

	useEffect(() => {
		if (from) {
			setBindModal(true);
			setBlockchain(from);
		}
	}, [from]);

	return (
		<>
			<div className={styles.snsList}>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/crypto/ethereum-eth-logo.svg" />
						<span className={styles.label}>ETH</span>
					</span>
					<span className={styles.value}>
						<Spin
							indicator={
								<LoadingOutlined spin />
							}
							spinning={!Object.keys(linkedInfo).length}
						>
							<Button
								disabled={null !== linkedInfo.Ethereum}
								type="primary"
								shape="round"
								onClick={() => {
									setBindModal(true);
									setBlockchain('Ethereum');
								}}
							>
								{!linkedInfo.Ethereum ?
									intl.formatMessage({
										id: 'social.bind',
									}) :
									intl.formatMessage({
										id: 'social.binded',
									})
								}
							</Button>
						</Spin>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/crypto/bitcoin-btc-logo.svg" />
						<span className={styles.label}>BTC</span>
					</span>
					<span className={styles.value}>
						<Spin
							indicator={
								<LoadingOutlined spin />
							}
							spinning={!Object.keys(linkedInfo).length}
						>
							<Button
								disabled
								// disabled={null !== linkedInfo.Bitcoin}
								type="primary"
								shape="round"
								onClick={() => {
									setBindModal(true);
									setBlockchain('Bitcoin');
								}}
							>
								{/* {!linkedInfo.Bitcoin ?
									intl.formatMessage({
										id: 'social.bind',
									}) :
									intl.formatMessage({
										id: 'social.binded',
									})
								} */}
								{intl.formatMessage({
									id: 'social.coming',
								})}
							</Button>
						</Spin>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/crypto/binance-bsc-logo.svg" />
						<span className={styles.label}>BSC</span>
					</span>
					<span className={styles.value}>
						<Spin
							indicator={
								<LoadingOutlined spin />
							}
							spinning={!Object.keys(linkedInfo).length}
						>
							<Button
								disabled
								// disabled={null !== linkedInfo.Binance}
								type="primary"
								shape="round"
								onClick={() => {
									setBindModal(true);
									setBlockchain('Binance');
								}}
							>
								{/* {!linkedInfo.Bitcoin ?
									intl.formatMessage({
										id: 'social.bind',
									}) :
									intl.formatMessage({
										id: 'social.binded',
									})
								} */}
								{intl.formatMessage({
									id: 'social.coming',
								})}
							</Button>
						</Spin>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/crypto/eos-eos-logo.svg" />
						<span className={styles.label}>EOS</span>
					</span>
					<span className={styles.value}>
						<Spin
							indicator={
								<LoadingOutlined spin />
							}
							spinning={!Object.keys(linkedInfo).length}
						>
							<Button
								disabled
								// disabled={null !== linkedInfo.Eosio}
								type="primary"
								shape="round"
								onClick={() => {
									setBindModal(true);
									setBlockchain('Eosio');
								}}
							>
								{/* {!linkedInfo.Eosio ?
									intl.formatMessage({
										id: 'social.bind',
									}) :
									intl.formatMessage({
										id: 'social.binded',
									})
								} */}
								{intl.formatMessage({
									id: 'social.coming',
								})}
							</Button>
						</Spin>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/crypto/solana-sol-logo.svg" />
						<span className={styles.label}>SOL</span>
					</span>
					<span className={styles.value}>
						<Spin
							indicator={
								<LoadingOutlined spin />
							}
							spinning={!Object.keys(linkedInfo).length}
						>
							<Button
								disabled
								// disabled={null !== linkedInfo.Solana}
								type="primary"
								shape="round"
								onClick={() => {
									setBindModal(true);
									setBlockchain('Solana');
								}}
							>
								{/* {!linkedInfo.Solana ?
									intl.formatMessage({
										id: 'social.bind',
									}) :
									intl.formatMessage({
										id: 'social.binded',
									})
								} */}
								{intl.formatMessage({
									id: 'social.coming',
								})}
							</Button>
						</Spin>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/crypto/kusama-ksm-logo.svg" />
						<span className={styles.label}>KSM</span>
					</span>
					<span className={styles.value}>
						<Spin
							indicator={
								<LoadingOutlined spin />
							}
							spinning={!Object.keys(linkedInfo).length}
						>
							<Button
								disabled
								// disabled={null !== linkedInfo.Kusama}
								type="primary"
								shape="round"
								onClick={() => {
									setBindModal(true);
									setBlockchain('Kusama');
								}}
							>
								{/* {!linkedInfo.Kusama ?
									intl.formatMessage({
										id: 'social.bind',
									}) :
									intl.formatMessage({
										id: 'social.binded',
									})
								} */}
								{intl.formatMessage({
									id: 'social.coming',
								})}
							</Button>
						</Spin>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/crypto/polkadot-new-dot-logo.svg" />
						<span className={styles.label}>DOT</span>
					</span>
					<span className={styles.value}>
						<Spin
							indicator={
								<LoadingOutlined spin />
							}
							spinning={!Object.keys(linkedInfo).length}
						>
							<Button
								disabled
								// disabled={null !== linkedInfo.Polkadot}
								type="primary"
								shape="round"
								onClick={() => {
									setBindModal(true);
									setBlockchain('Polkadot');
								}}
							>
								{/* {!linkedInfo.Polkadot ?
									intl.formatMessage({
										id: 'social.bind',
									}) :
									intl.formatMessage({
										id: 'social.binded',
									})
								} */}
								{intl.formatMessage({
									id: 'social.coming',
								})}
							</Button>
						</Spin>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/crypto/tron-trx-logo.png" />
						<span className={styles.label}>TRX</span>
					</span>
					<span className={styles.value}>
						<Spin
							indicator={
								<LoadingOutlined spin />
							}
							spinning={!Object.keys(linkedInfo).length}
						>
							<Button
								disabled
								// disabled={null !== linkedInfo.Tron}
								type="primary"
								shape="round"
								onClick={() => {
									setBindModal(true);
									setBlockchain('Tron');
								}}
							>
								{/* {!linkedInfo.Tron ?
									intl.formatMessage({
										id: 'social.bind',
									}) :
									intl.formatMessage({
										id: 'social.binded',
									})
								} */}
								{intl.formatMessage({
									id: 'social.coming',
								})}
							</Button>
						</Spin>
					</span>
				</div>
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
					history.push(config.page.socialPage);
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
	);
};

export default Blockchain;
