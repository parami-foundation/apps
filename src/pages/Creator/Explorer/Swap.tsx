import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { Card, Typography, Image, Button, InputNumber, Space, Spin, notification } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import AD3 from '@/components/Token/AD3';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';
import Token from '@/components/Token/Token';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { DrylyBuyCurrency, DrylyBuyToken, DrylySellCurrency, DrylySellToken } from '@/services/parami/RPC';
import { BuyCurrency, BuyToken } from '@/services/parami/Swap';

const { Title } = Typography;

const Swap: React.FC<{
	avatar: string;
	asset: any;
	nft: any;
	assetPrice: string;
}> = ({ avatar, asset, nft, assetPrice }) => {
	const { wallet } = useModel('currentUser');
	const { balance } = useModel('balance');
	const { assets } = useModel('assets');
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [mode, setMode] = useState<string>('ad3ToToken');
	const [ad3Number, setAd3Number] = useState<string>('');
	const [tokenNumber, setTokenNumber] = useState<string>('');
	const [secModal, setSecModal] = useState<boolean>(false);
	const [passphrase, setPassphrase] = useState<string>('');
	const [flat, setFlat] = useState<any>();

	const intl = useIntl();

	const handleSubmit = async (preTx?: boolean, account?: string) => {
		if (!!wallet && !!wallet?.keystore) {
			setSubmitting(true);
			switch (mode) {
				case 'ad3ToToken':
					try {
						const info: any = await BuyToken(nft?.classId, FloatStringToBigInt(flat, 18).toString(), FloatStringToBigInt(ad3Number, 18).toString(), passphrase, wallet?.keystore, preTx, account);
						setSubmitting(false);

						if (preTx && account) {
							return info
						}
					} catch (e: any) {
						notification.error({
							message: e.message || e,
							duration: null,
						});
						setSubmitting(false);
						return;
					}
					break;
				case 'tokenToAd3':
					try {
						const info: any = await BuyCurrency(nft?.classId, FloatStringToBigInt(flat, 18).toString(), FloatStringToBigInt(tokenNumber, 18).toString(), passphrase, wallet?.keystore, preTx, account);
						setSubmitting(false);

						if (preTx && account) {
							return info
						}
					} catch (e: any) {
						notification.error({
							message: e.message || e,
							duration: null,
						});
						setSubmitting(false);
						return;
					}
					break;
			}
		} else {
			notification.error({
				key: 'accessDenied',
				message: intl.formatMessage({
					id: 'error.accessDenied',
				}),
				duration: null,
			});
			setSubmitting(false);
		}
	};

	return (
		<>
			<Spin
				tip={intl.formatMessage({
					id: 'common.submitting',
				})}
				spinning={submitting}
				wrapperClassName={styles.spinContainer}
			>
				<Card
					className={styles.card}
					bodyStyle={{
						width: '100%',
						padding: '24px 8px',
					}}
					style={{
						marginTop: 50,
					}}
				>
					<div className={style.trade}>
						<Title
							level={5}
							style={{
								fontWeight: 'bold',
								textAlign: 'center',
							}}
							className={styles.title}
						>
							{intl.formatMessage({
								id: 'creator.explorer.trade',
							})}
						</Title>
						<div
							className={style.pairCoins}
							style={{
								flexFlow: mode === 'ad3ToToken' ? 'column' : 'column-reverse',
							}}
						>
							<div className={style.pairCoinsItem}>
								<div className={style.pairCoinsSelect}>
									<div className={style.pairCoin}>
										<Image
											src={'/images/logo-round-core.svg'}
											preview={false}
											className={style.pairCoinsItemIcon}
										/>
										<span className={style.pairCoinsItemLabel}>AD3</span>
									</div>
									<InputNumber
										autoFocus={false}
										size="large"
										placeholder={'0'}
										bordered={false}
										value={mode === 'ad3ToToken' ? ad3Number : flat}
										className={style.pairCoinsItemInput}
										stringMode
										onChange={(e) => {
											if (mode === 'ad3ToToken') {
												setAd3Number(e);
												DrylySellCurrency(nft?.classId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
													setFlat(BigIntToFloatString(res, 18));
												});
											}
											if (mode === 'tokenToAd3') {
												setFlat(e);
												DrylyBuyCurrency(nft?.classId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
													setTokenNumber(BigIntToFloatString(res, 18));
												});
											}
										}}
									/>
								</div>
								<div className={style.pairCoinsBalance}>
									<span className={style.balance}>
										{intl.formatMessage({
											id: 'creator.explorer.trade.balance',
											defaultMessage: 'Balance'
										})}: <AD3 value={balance?.free} />
									</span>
									<Button
										type='link'
										size='middle'
										className={style.maxButton}
										onClick={() => {
											const ad3BalanceStr = BigIntToFloatString(balance?.free, 18);
											if (mode === 'ad3ToToken') {
												setAd3Number(ad3BalanceStr);
												DrylySellCurrency(nft?.classId, FloatStringToBigInt(ad3BalanceStr, 18).toString()).then((res: any) => {
													setFlat(BigIntToFloatString(res, 18));
												});
											}
											if (mode === 'tokenToAd3') {
												setFlat(ad3BalanceStr);
												DrylyBuyCurrency(nft?.classId, FloatStringToBigInt(ad3BalanceStr, 18).toString()).then((res: any) => {
													setTokenNumber(BigIntToFloatString(res, 18));
												});
											}
										}}
									>
										{intl.formatMessage({
											id: 'creator.explorer.trade.balance.max',
											defaultMessage: 'MAX'
										})}
									</Button>
								</div>
							</div>
							<Button
								type='primary'
								shape='circle'
								size='middle'
								icon={<DownOutlined />}
								className={style.pairCoinsSwitchButton}
								onClick={() => {
									setMode(mode === 'ad3ToToken' ? 'tokenToAd3' : 'ad3ToToken');
									setAd3Number('');
									setTokenNumber('');
									setFlat(null);
								}}
							/>
							<div className={style.pairCoinsItem}>
								<div className={style.pairCoinsSelect}>
									<div className={style.pairCoin}>
										<Image
											src={avatar || '/images/logo-round-core.svg'}
											preview={false}
											className={style.pairCoinsItemIcon}
										/>
										<span className={style.pairCoinsItemLabel}>{asset?.symbol}</span>
									</div>
									<InputNumber
										autoFocus={false}
										size="large"
										placeholder={'0'}
										bordered={false}
										value={mode === 'tokenToAd3' ? tokenNumber : flat}
										className={style.pairCoinsItemInput}
										stringMode
										onChange={(e) => {
											if (mode === 'tokenToAd3') {
												setTokenNumber(e);
												DrylySellToken(nft?.classId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
													setFlat(BigIntToFloatString(res, 18));
												});
											}
											if (mode === 'ad3ToToken') {
												setFlat(e);
												DrylyBuyToken(nft?.classId, FloatStringToBigInt(e, 18).toString()).then((res: any) => {
													setAd3Number(BigIntToFloatString(res, 18));
												});
											}
										}}
									/>
								</div>
								<div className={style.pairCoinsBalance}>
									<span className={style.balance}>
										{intl.formatMessage({
											id: 'creator.explorer.trade.balance',
											defaultMessage: 'Balance'
										})}: <Token value={assets.get(nft?.classId)?.balance} symbol={asset?.symbol} />
									</span>
									<Button
										type='link'
										size='middle'
										className={style.maxButton}
										onClick={() => {
											const tokenBalanceStr = BigIntToFloatString(assets.get(nft?.classId)?.balance, 18);
											if (mode === 'tokenToAd3') {
												setTokenNumber(tokenBalanceStr);
												DrylySellToken(nft?.classId, FloatStringToBigInt(tokenBalanceStr, 18).toString()).then((res: any) => {
													setFlat(BigIntToFloatString(res, 18));
												});
											}
											if (mode === 'ad3ToToken') {
												setFlat(tokenBalanceStr);
												DrylyBuyToken(nft?.classId, FloatStringToBigInt(tokenBalanceStr, 18).toString()).then((res: any) => {
													setAd3Number(BigIntToFloatString(res, 18));
												});
											}
										}}
									>
										{intl.formatMessage({
											id: 'creator.explorer.trade.balance.max',
											defaultMessage: 'MAX'
										})}
									</Button>
								</div>
							</div>
						</div>
						<div className={style.pairCoinsFlat}>
							<Space>
								<Token value={FloatStringToBigInt('1', 18).toString()} symbol={asset?.symbol} />
								<span>≈</span>
								<AD3 value={assetPrice} />
							</Space>
						</div>
						<Button
							block
							type='primary'
							size='large'
							shape='round'
							className={style.submitButton}
							disabled={!flat}
							onClick={() => {
								setSecModal(true);
							}}
						>
							{intl.formatMessage({
								id: 'creator.explorer.trade.swap',
								defaultMessage: 'Swap'
							})}
						</Button>
					</div>
				</Card>
			</Spin>
			<SecurityModal
				visable={secModal}
				setVisable={setSecModal}
				passphrase={passphrase}
				setPassphrase={setPassphrase}
				func={handleSubmit}
			/>
		</>
	)
}

export default Swap;
