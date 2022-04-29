import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { Typography, Image, Card, Button, Tooltip, message, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { guid } from '@/utils/common';
import Skeleton from '@/components/Skeleton';
import { DecodeKeystoreWithPwd, EncodeKeystoreWithPwd } from '@/services/parami/Crypto';

const Security: React.FC = () => {
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');
	const [passphraseEnable, setPassphraseEnable] = useState<string>();
	const [passphrase, setPassphrase] = useState<string>('');
	const [secModal, setSecModal] = useState<boolean>(false);
	const [decoded, setDecoded] = useState<string>();

	const intl = useIntl();

	const { Title } = Typography;

	const encryptKeystore = async () => {
		if (!!wallet && !!wallet?.keystore) {
			if (passphraseEnable === 'enable') {
				const decodedMnemonic = DecodeKeystoreWithPwd(passphrase, wallet?.keystore);
				if (!decodedMnemonic) {
					message.error(intl.formatMessage({
						id: 'error.passphrase.error',
					}));
					return;
				}
				const generatePassword = guid().substring(0, 6);
				setPassphrase(generatePassword);
				localStorage.setItem('parami:wallet:passphrase', generatePassword);
				const encodedMnemonic = EncodeKeystoreWithPwd(generatePassword, decodedMnemonic);
				if (!encodedMnemonic) {
					message.error(intl.formatMessage({
						id: 'error.passphrase.error',
					}));
					return;
				}
				localStorage.setItem('parami:wallet:keystore', encodedMnemonic);
				setPassphraseEnable('disable');
				message.success(intl.formatMessage({
					id: 'account.security.passphrase.changeSuccess',
				}));
				window.location.reload();
			} else {
				if (!decoded) {
					message.error(intl.formatMessage({
						id: 'error.passphrase.error',
					}));
					return;
				}
				const encodedMnemonic = EncodeKeystoreWithPwd(passphrase, decoded);
				if (!encodedMnemonic) {
					message.error(intl.formatMessage({
						id: 'error.passphrase.error',
					}));
					return;
				}
				localStorage.setItem('parami:wallet:keystore', encodedMnemonic);
				setPassphraseEnable('enable');
				message.success(intl.formatMessage({
					id: 'account.security.passphrase.changeSuccess',
				}));
				localStorage.removeItem('parami:wallet:passphrase');
				window.location.reload();
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
	};

	const passphraseModeChange = async () => {
		if (!!wallet && !!wallet.keystore) {
			if (passphraseEnable === 'enable') {
				// disable
				setSecModal(true);
			} else if (passphraseEnable === 'disable' && !!wallet.passphrase) {
				// enable
				const decodedMnemonic = DecodeKeystoreWithPwd(wallet?.passphrase, wallet?.keystore);
				if (!decodedMnemonic) {
					message.error(intl.formatMessage({
						id: 'error.passphrase.error',
					}));
					return;
				}
				setDecoded(decodedMnemonic);
				setSecModal(true);
			} else {
				notification.error({
					key: 'accessDenied',
					message: intl.formatMessage({
						id: 'error.accessDenied',
					}),
					duration: null,
				})
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

	useEffect(() => {
		if (!!wallet?.passphrase) {
			setPassphraseEnable('disable');
		} else {
			setPassphraseEnable('enable');
		}
	}, [wallet?.passphrase, decoded, passphraseEnable]);

	return (
		<>
			<Title
				level={3}
				className={style.sectionTitle}
			>
				<Image
					src='/images/icon/safe.svg'
					className={style.sectionIcon}
					preview={false}
				/>
				{intl.formatMessage({
					id: 'account.security.title',
				})}
			</Title>
			<Skeleton
				loading={!apiWs}
				children={
					<>
						<Title
							level={5}
							className={style.sectionSubtitle}
						>
							{intl.formatMessage({
								id: 'account.security.subtitle',
							})}
							<Tooltip
								placement="top"
								title={intl.formatMessage({
									id: 'account.security.subtitle.tip',
								})}
							>
								<ExclamationCircleOutlined className={style.infoIcon} />
							</Tooltip>
						</Title>
						<div className={style.security}>
							<Card
								className={`${styles.card} ${style.securityCard}`}
								bodyStyle={{
									padding: 0,
									width: '100%',
								}}
							>
								<div className={style.field}>
									<div className={style.title}>
										{intl.formatMessage({
											id: 'account.security.passphrase',
										})}
									</div>
									<div className={style.button}>
										<Button
											size='large'
											shape='round'
											type='primary'
											onClick={() => {
												passphraseModeChange();
											}}
										>
											{passphraseEnable === 'disable' && intl.formatMessage({
												id: 'common.enable',
											})}
											{passphraseEnable === 'enable' && intl.formatMessage({
												id: 'common.disable',
											})}
										</Button>
									</div>
								</div>
							</Card>
						</div>
					</>
				}
			/>
			<SecurityModal
				visable={secModal}
				setVisable={setSecModal}
				passphrase={passphrase}
				setPassphrase={setPassphrase}
				func={encryptKeystore}
				changePassphrase={true}
			/>
		</>
	)
}

export default Security;
