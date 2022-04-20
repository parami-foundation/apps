import { Typography, Image, Card, Button, message, Input, notification } from 'antd';
import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import Skeleton from '@/components/Skeleton';
import SmallModal from '@/components/ParamiModal/SmallModal';
import { DecodeKeystoreWithPwd } from '@/services/parami/crypto';

const Export: React.FC = () => {
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');
	const [modalVisable, setModalVisable] = useState<boolean>(false);
	const [secModal, setSecModal] = useState<boolean>(false);
	const [mnemonic, setMnemonic] = useState<string>('');
	const [passphrase, setPassphrase] = useState<string>('');

	const intl = useIntl();

	const { Title } = Typography;

	const handleSubmit = async () => {
		if (!!wallet && !!wallet?.keystore) {
			try {
				const decrypted = DecodeKeystoreWithPwd(wallet?.passphrase || passphrase, wallet?.keystore);
				if (!decrypted) {
					message.error(
						intl.formatMessage({
							id: 'error.passphrase.error',
						}),
					);
					setPassphrase('');
					return;
				}
				setMnemonic(decrypted);
				setModalVisable(true);
			} catch (e: any) {
				message.error(
					intl.formatMessage({
						id: 'error.passphrase.error',
					}),
				);
				setPassphrase('');
			}
		} else {
			notification.error({
				key: 'accessDenied',
				message: intl.formatMessage({
					id: 'error.accessDenied',
				}),
				duration: null,
			})
		}
	}

	return (
		<>
			<Title
				level={3}
				className={style.sectionTitle}
			>
				<Image
					src='/images/icon/backup.svg'
					className={style.sectionIcon}
					preview={false}
				/>
				{intl.formatMessage({
					id: 'account.export.title',
				})}
			</Title>
			<Skeleton
				loading={!apiWs}
				children={
					<>
						<div className={style.export}>
							<Card
								className={`${styles.card} ${style.exportCard}`}
								bodyStyle={{
									padding: 0,
									width: '100%',
								}}
							>
								<div className={style.field}>
									<div className={style.title}>
										{intl.formatMessage({
											id: 'account.export.exportMnemonic',
										})}
									</div>
									<div className={style.button}>
										<Button
											size='large'
											shape='round'
											type='primary'
											onClick={() => {
												setSecModal(true);
											}}
										>
											{intl.formatMessage({
												id: 'common.export',
												defaultMessage: 'Export'
											})}
										</Button>
									</div>
								</div>
							</Card>
						</div>
					</>
				}
			/>

			<SmallModal
				visable={modalVisable}
				content={
					<>
						<Input
							size="large"
							value={mnemonic}
						/>
					</>
				}
				footer={
					<>
						<div className={style.bottomButtons}>
							<CopyToClipboard
								text={mnemonic}
								onCopy={() => message.success(
									intl.formatMessage({
										id: 'common.copied',
									})
								)}
							>
								<Button
									block
									shape='round'
									size='large'
									className={style.button}
									icon={<CopyOutlined />}
								>
									{intl.formatMessage({
										id: 'common.copy',
									})}
								</Button>
							</CopyToClipboard>
							<Button
								block
								type='primary'
								shape='round'
								size='large'
								className={style.button}
								onClick={() => { setModalVisable(false) }}
							>
								{intl.formatMessage({
									id: 'common.close',
								})}
							</Button>
						</div>
					</>
				}
			/>

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

export default Export;
