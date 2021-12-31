import SmallModal from '@/components/ParamiModal/SmallModal';
import BigModal from '@/components/ParamiModal/BigModal';
import { InfoCircleOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Input, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '../style.less';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { DrylyRemoveLiquidity, RemoveLiquidity } from '@/services/parami/swap';
import AD3 from '@/components/Token/AD3';
import Token from '@/components/Token/Token';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';

const SelectAssets: React.FC<{
	setToken: React.Dispatch<React.SetStateAction<any>>,
	setSelectModal: React.Dispatch<React.SetStateAction<boolean>>,
	assetsBalance: any[],
	setTokenBalance: React.Dispatch<React.SetStateAction<any>>,
}> = ({ setToken, setSelectModal, assetsBalance, setTokenBalance }) => {
	const [keyword, setKeyword] = useState<string>();

	const intl = useIntl();

	const handleSelect = async (item: any) => {
		setToken(item);
		setTokenBalance(item.balance);
		setSelectModal(false);
	}

	return (
		<div className={styles.selectAssets}>
			<div className={styles.searchBar}>
				<Input
					autoFocus
					size='large'
					className={styles.searchInput}
					onChange={(e) => (setKeyword(e.target.value))}
					placeholder={'0'}
				/>
			</div>
			<div className={styles.assetsList}>
				<div className={styles.title}>
					<span>
						{intl.formatMessage({
							id: 'miner.add.name',
						})}
					</span>
					<span>
						{intl.formatMessage({
							id: 'miner.add.availableBalance',
						})}
					</span>
				</div>
				{
					assetsBalance.map((item: any) => {
						return (
							<div
								className={styles.field}
								key={item?.id}
								onClick={() => handleSelect(item)}
							>
								<span className={styles.title}>
									<Image
										className={styles.icon}
										src={item?.icon || '/images/logo-round-core.svg'}
										fallback='/images/logo-round-core.svg'
										preview={false}
									/>
									<span className={styles.name}>
										{item?.token}
									</span>
								</span>
								<span className={styles.value}>
									<Token value={item?.balance} />
								</span>
							</div>
						);
					})
				}
			</div>
		</div>
	)
};

const Redeem: React.FC = () => {
	const apiWs = useModel('apiWs');
	const [submitting, setSubmitting] = useState(false);
	const [number, setNumber] = useState<string>('0');
	const [token, setToken] = useState<Record<string, string>>({});
	const [secModal, setSecModal] = useState(false);
	const [password, setPassword] = useState('');
	const [infoModal, setInfoModal] = useState(false);
	const [selectModal, setSelectModal] = useState(false);
	const [assetsBalance, setAssetsBalance] = useState<any[]>([]);
	const [tokenAmount, setTokenAmount] = useState<any[]>([]);
	const [tokenBalance, setTokenBalance] = useState<any>();

	const intl = useIntl();

	const controllerKeystore = localStorage.getItem('controllerKeystore');
	const currentAccount = localStorage.getItem('stashUserAddress');

	const updateAssetsBalance = async (assets: any) => {
		if (!apiWs) {
			return;
		}
		const data: any[] = [];
		if (!!assets) {
			for (const assetsID in assets) {
				const { balance }: any = await apiWs.query.assets.account(Number(assetsID), currentAccount);
				if (!!balance && balance > 0 && assets[assetsID].name.endsWith('LP*')) {
					data.push({
						id: assetsID,
						token: assets[assetsID].name,
						symbol: assets[assetsID].symbol,
						balance: balance.toString(),
					});
				}
			}
			setAssetsBalance(data);
		}
	};

	const updateAssetsInfo = async () => {
		if (!apiWs) {
			return;
		}
		const allEntries = await apiWs.query.assets.metadata.entries();
		const tmpAssets = {};
		for (let i = 0; i < allEntries.length; i++) {
			const [key, value] = allEntries[i];
			const shortKey = key.toHuman();
			if (!!shortKey) {
				const id = shortKey[0].replaceAll(',', '');
				tmpAssets[id] = value.toHuman();
			}
		}
		updateAssetsBalance(tmpAssets);
	};

	const handleSubmit = async () => {
		setSubmitting(true);
		//todo: check input
		await RemoveLiquidity(tokenAmount[0], FloatStringToBigInt(number, 18).toString(), tokenAmount[3], tokenAmount[1], password, controllerKeystore as string).then(() => {
			setSubmitting(false);
		});
	};

	useEffect(() => {
		if (apiWs) {
			updateAssetsInfo();
		}
	}, [apiWs]);

	return (
		<>
			<div className={styles.mining}>
				<div className={styles.header}>
					<span className={styles.title}>
						{intl.formatMessage({
							id: 'miner.add.flowability.title',
						})}
					</span>
					<div className={styles.buttons}>
						<Button
							type='primary'
							shape='circle'
							size='large'
							icon={<InfoCircleOutlined />}
							onClick={() => {
								setInfoModal(true);
							}}
						/>
					</div>
				</div>
				<div className={styles.field}>
					<div className={styles.label}>
						{intl.formatMessage({
							id: 'miner.add.flowability.select',
						})}
					</div>
					<div className={styles.selectAssets} onClick={() => {
						setNumber('0');
						setTokenAmount([]);
						setSelectModal(true)

					}}>
						<div className={styles.title}>
							{token.token && (
								<>
									<Image
										className={styles.icon}
										src={'/images/logo-round-core.svg'}
										preview={false}
									/>
									<span className={styles.name}>{token.token}</span>
								</>
							)}
							{!token.token && (
								<span className={styles.name}>
									{intl.formatMessage({
										id: 'miner.add.pleaseSelect',
									})}
								</span>
							)}
						</div>
						<div className={styles.token}>
							<Token value={tokenBalance} />
							<RightOutlined
								style={{
									color: '#ff5b00',
									marginLeft: 10,
								}}
							/>
						</div>
					</div>
				</div>
				<div className={styles.field}>
					<div
						className={styles.label}
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							width: '100%',
						}}
					>
						<span>
							{intl.formatMessage({
								id: 'miner.add.number.label',
							})}
						</span>
						<span>
							{intl.formatMessage({
								id: 'miner.add.number.available',
							})}:
							<Token value={token.balance} />
						</span>
					</div>
					<div className={styles.inputAndButton}>
						<Input
							autoFocus
							size='large'
							className={styles.input}
							placeholder={'0'}
							value={number}
							onChange={(e) => {
								setNumber(e.target.value);
								DrylyRemoveLiquidity(token.id, FloatStringToBigInt(e.target.value, 18).toString()).then((res: any) => {
									console.log(res);
									setTokenAmount(res);
								});
							}}
							disabled={submitting || !Object.keys(token).length}
							type='number'
						/>
						<Button
							size='large'
							type='primary'
							shape='round'
							onClick={() => {
								console.log(BigIntToFloatString(token.balance, 18))
								setNumber(BigIntToFloatString(token.balance, 18));
								DrylyRemoveLiquidity(token.id, token.balance).then((res: any) => {
									console.log(res);
									setTokenAmount(res);
								});
							}}
						>
							{intl.formatMessage({
								id: 'miner.all',
							})}
						</Button>
					</div>
				</div>
				<div className={styles.field}>
					<div className={styles.label}>
						{intl.formatMessage({
							id: 'miner.add.overview',
						})}
					</div>
					<div className={styles.listBtn}>
						<div className={styles.field}>
							<span className={styles.title}>
								{intl.formatMessage({
									id: 'miner.add.tokenAmount',
								})}
							</span>
							<span
								className={styles.value}
								style={{
									color: 'red',
								}}
							>
								<Token value={tokenAmount[1]} />
							</span>
						</div>
						<div className={styles.field}>
							<span className={styles.title}>
								{intl.formatMessage({
									id: 'miner.redeem.ad3tokenAmount',
								})}
							</span>
							<span
								className={styles.value}
								style={{
									color: 'red',
								}}
							>
								<AD3 value={tokenAmount[3]} />
							</span>
						</div>
					</div>
				</div>
				<div className={styles.actionButtons}>
					<Button
						type='primary'
						shape='round'
						size='large'
						className={styles.button}
						loading={submitting}
						disabled={FloatStringToBigInt(number, 18) <= BigInt(0) || FloatStringToBigInt(number, 18) > BigInt(token.balance || 0)}
						onClick={() => {
							setSubmitting(true);
							setSecModal(true);
						}}
					>
						{intl.formatMessage({
							id: 'miner.mining.redeem',
						})}
					</Button>
				</div>
			</div>
			<SmallModal
				visable={infoModal}
				content={intl.formatMessage({
					id: 'miner.add.information',
				})}
				footer={
					<Button
						block
						type='primary'
						size='large'
						shape='round'
						onClick={() => {
							setInfoModal(false);
						}}
					>
						{intl.formatMessage({
							id: 'common.confirm',
						})}
					</Button>
				}
			/>
			<BigModal
				visable={selectModal}
				title={
					intl.formatMessage({
						id: 'miner.add.selectAssetsPool',
					})
				}
				content={
					<SelectAssets
						setToken={setToken}
						setSelectModal={setSelectModal}
						assetsBalance={assetsBalance}
						setTokenBalance={setTokenBalance}
					/>
				}
				close={() => { setSelectModal(false) }}
				footer={
					<Button
						block
						type='primary'
						shape='round'
						size='large'
						className={styles.button}
						onClick={() => setSelectModal(false)}
					>
						{intl.formatMessage({
							id: 'common.close',
						})}
					</Button>
				}
			/>
			<SecurityModal
				visable={secModal}
				setVisable={setSecModal}
				password={password}
				setPassword={setPassword}
				func={handleSubmit}
			/>
		</>
	);
};

export default Redeem;
