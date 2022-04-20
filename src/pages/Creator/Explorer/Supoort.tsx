import { Button, Card, Divider, Input, notification, Spin, Typography } from 'antd';
import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import BigModal from '@/components/ParamiModal/BigModal';
import { didToHex } from '@/utils/common';
import { SupportDAO } from '@/services/parami/nft';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { FloatStringToBigInt } from '@/utils/format';
import AD3 from '@/components/Token/AD3';

const { Title } = Typography;

const Support: React.FC<{
	did: string,
}> = ({ did }) => {
	const { balance } = useModel('balance');
	const { wallet } = useModel('currentUser');
	const [submitting, setSubmitting] = useState(false);
	const [modal, setModal] = useState<boolean>(false);
	const [number, setNumber] = useState<string>('0');
	const [passphrase, setPassphrase] = useState('');
	const [secModal, setSecModal] = useState(false);

	const intl = useIntl();

	const handleSubmit = async () => {
		if (!!wallet && !!wallet?.keystore) {
			const didHexString = didToHex(did);
			await SupportDAO(didHexString, FloatStringToBigInt(number, 18).toString(), passphrase, wallet?.keystore);
			setModal(false);
			setSubmitting(false);
		} else {
			notification.error({
				key: 'accessDenied',
				message: intl.formatMessage({
					id: 'error.accessDenied',
				}),
				duration: null,
			});
		}
	};

	return (
		<>
			<Spin
				tip={intl.formatMessage({
					id: 'common.submitting',
				})}
				spinning={submitting}
				wrapperClassName={styles.pageContainer}
			>
				<Card
					className={styles.card}
					bodyStyle={{
						width: '100%',
					}}
				>
					<div className={style.trade}>
						<Title
							level={3}
							style={{
								fontWeight: 'bold',
								textAlign: 'center',
							}}
							className={styles.title}
						>
							{intl.formatMessage({
								id: 'creator.explorer.support',
							})}
						</Title>
						<Input
							autoFocus
							size="large"
							placeholder={'0'}
							bordered={false}
							className={`${style.input} bigInput`}
							value={number}
							onChange={(e) => {
								setNumber(e.target.value);
							}}
							disabled={submitting}
							type="number"
						/>
						<Divider />
						<Button
							block
							shape='round'
							type='primary'
							size='large'
							onClick={() => { setModal(true) }}
						>
							{intl.formatMessage({
								id: 'creator.explorer.support',
							})}
						</Button>
					</div>
				</Card>
				<BigModal
					visable={modal}
					title={intl.formatMessage({
						id: 'creator.explorer.support',
					})}
					content={
						<>
							<div className={style.tradeModal}>
								<Input
									autoFocus
									size="large"
									placeholder={intl.formatMessage({
										id: 'stake.add.number.placeholder',
									})}
									bordered={false}
									className={`${style.input} bigInput`}
									value={number}
									onChange={(e) => {
										setNumber(e.target.value);
									}}
									disabled={submitting}
									type="number"
								/>
								<div className={style.field}>
									<span className={style.title}>
										{intl.formatMessage({
											id: 'creator.explorer.availableBalance',
										})}
									</span>
									<span className={style.value}>
										<AD3 value={balance.free} />
									</span>
								</div>
							</div>
						</>
					}
					footer={
						<Button
							block
							shape='round'
							type='primary'
							size='large'
							loading={submitting}
							disabled={FloatStringToBigInt(number, 18) <= BigInt(0) || FloatStringToBigInt(number, 18) > BigInt(balance.free)}
							onClick={() => {
								setSubmitting(true);
								setSecModal(true);
							}}
						>
							{intl.formatMessage({
								id: 'common.submit',
							})}
						</Button>
					}
					close={() => { setModal(false) }}
				/>
				<SecurityModal
					visable={secModal}
					setVisable={setSecModal}
					passphrase={passphrase}
					setPassphrase={setPassphrase}
					func={handleSubmit}
				/>
			</Spin>
		</>
	)
}

export default Support;
