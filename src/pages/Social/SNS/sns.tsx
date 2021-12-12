import BigModal from '@/components/ParamiModal/BigModal';
import config from '@/config/config';
import { GetUserInfo } from '@/services/parami/nft';
import { Alert, Button, Input, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { GetLinkedInfo, LinkSociality } from '@/services/parami/linker';
import styles from '../style.less';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { LoadingOutlined } from '@ant-design/icons';

const did = localStorage.getItem('did') as string;

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
	platform: string;
	setBindModal: React.Dispatch<React.SetStateAction<boolean>>;
	getStatus: () => Promise<void>;
}> = ({ platform, setBindModal, getStatus }) => {
	const [errorState, setErrorState] = useState<API.Error>({});
	const [profileURL, setProfileURL] = useState<string>('');
	const [avatar, setAvatar] = useState<any>();
	const [secModal, setSecModal] = useState<boolean>(false);
	const [Password, setPassword] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const intl = useIntl();

	const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

	const getUserInfo = async () => {
		try {
			const res = await GetUserInfo(did);
			const info = res.toHuman();
			if (!info) {
				return;
			}

			if (info['avatar'].indexOf('ipfs://') > -1) {
				const hash = info['avatar'].substring(7);
				setAvatar(config.ipfs.endpoint + hash)
			}
		} catch (e: any) {
			message.error(e.message);
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		try {
			await LinkSociality(did, platform, profileURL, Password, controllerKeystore);
			await getStatus();
			setLoading(false);
		} catch (e: any) {
			setErrorState({
				Type: 'chain error',
				Message: intl.formatMessage({
					id: e,
				}),
			});
			setLoading(false);
			return;
		}
		setBindModal(false);
	};

	useEffect(() => {
		if (Password !== '' && profileURL !== '') {
			handleSubmit();
		}
	}, [Password, profileURL]);

	useEffect(() => {
		getUserInfo();
	}, []);

	return (
		<>
			<Spin
				tip={intl.formatMessage({
					id: 'common.submitting',
				})}
				spinning={loading}
			>
				<div className={styles.bindModal}>
					{errorState.Message && <Message content={errorState.Message} />}
					<div
						className={styles.avatar}
					>
						<img src={avatar || '/images/logo-square-core.svg'} />
					</div>
					<span
						className={styles.avatarSaveDesc}
					>
						{intl.formatMessage({
							id: 'wallet.avatar.saveDesc',
						})}
					</span>
					<Alert
						message={intl.formatMessage({
							id: 'social.sns.setAvatar',
						})}
						type="warning"
					/>
					{platform === 'Telegram' && (
						<div className={styles.field}>
							<div className={styles.title}>
								{intl.formatMessage({
									id: 'social.sns.username',
								})}
							</div>
							<div className={styles.value}>
								<Input
									addonBefore="@"
									size='large'
									onChange={(e) => (
										setProfileURL(`https://t.me/${e.target.value}`)
									)}
								/>
							</div>
						</div>
					)}
					{platform === 'Twitter' && (
						<div className={styles.field}>
							<div className={styles.title}>
								{intl.formatMessage({
									id: 'social.sns.username',
								})}
							</div>
							<div className={styles.value}>
								<Input
									addonBefore="@"
									size='large'
									onChange={(e) => (
										setProfileURL(`https://twitter.com/${e.target.value}`)
									)}
								/>
							</div>
						</div>
					)}
					{(platform !== 'Telegram' && platform !== 'Twitter') && (
						<div className={styles.field}>
							<div className={styles.title}>
								{intl.formatMessage({
									id: 'social.sns.profileURL',
								})}
							</div>
							<div className={styles.value}>
								<Input
									size='large'
									onChange={(e) => (
										setProfileURL(e.target.value)
									)}
								/>
							</div>
						</div>
					)}
					<div className={styles.field}>
						<Button
							block
							size='large'
							type='primary'
							shape='round'
							onClick={() => { setSecModal(true) }}
							disabled={!profileURL}
						>
							{intl.formatMessage({
								id: 'common.submit',
							})}
						</Button>
					</div>
				</div>
				<SecurityModal
					visable={secModal}
					setVisable={setSecModal}
					password={Password}
					setPassword={setPassword}
				//func={handleSubmit}
				/>
			</Spin>
		</>
	)
}

const SNS: React.FC = () => {
	const [bindModal, setBindModal] = useState<boolean>(false);
	const [platform, setPlatform] = useState<string>('');
	const [linkedInfo, setLinkedInfo] = useState<Record<string, any>>({});

	const intl = useIntl();

	const platforms = ['Telegram', 'Twitter'];

	const init = async () => {
		const data = {};
		for (let i = 0; i < platforms.length; i++) {
			const res = await GetLinkedInfo(did, platforms[i]);
			data[platforms[i]] = res;
		}
		setLinkedInfo(data);
	};

	useEffect(() => {
		init();
	}, []);

	return (
		<>
			<div className={styles.snsList}>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/sns/telegram.svg" />
						<span className={styles.label}>Telegram</span>
					</span>
					<span className={styles.value}>
						<Spin
							indicator={
								<LoadingOutlined spin />
							}
							spinning={!Object.keys(linkedInfo).length}
						>
							<Button
								disabled={null !== linkedInfo.Telegram}
								type="primary"
								shape="round"
								onClick={() => {
									setBindModal(true);
									setPlatform('Telegram');
								}}
							>
								{!linkedInfo.Telegram ?
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
						<img className={styles.icon} src="/images/sns/twitter.svg" />
						<span className={styles.label}>Twitter</span>
					</span>
					<span className={styles.value}>
						<Spin
							indicator={
								<LoadingOutlined spin />
							}
							spinning={!Object.keys(linkedInfo).length}
						>
							<Button
								disabled={null !== linkedInfo.Twitter}
								type="primary"
								shape="round"
								onClick={() => {
									setBindModal(true);
									setPlatform('Twitter');
								}}
							>
								{!linkedInfo.Twitter ?
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
						<img className={styles.icon} src="/images/sns/discord.svg" />
						<span className={styles.label}>Discord</span>
					</span>
					<span className={styles.value}>
						<Button
							disabled
							type="primary"
							shape="round"
							onClick={() => {
								setBindModal(true);
								setPlatform('Discord');
							}}
						>
							{intl.formatMessage({
								id: 'social.coming',
							})}
						</Button>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/sns/facebook.svg" />
						<span className={styles.label}>Facebook</span>
					</span>
					<span className={styles.value}>
						<Button
							disabled
							type="primary"
							shape="round"
							onClick={() => {
								setBindModal(true);
								setPlatform('Facebook');
							}}
						>
							{intl.formatMessage({
								id: 'social.coming',
							})}
						</Button>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/sns/mastodon.svg" />
						<span className={styles.label}>Mastodon</span>
					</span>
					<span className={styles.value}>
						<Button
							disabled
							type="primary"
							shape="round"
							onClick={() => {
								setBindModal(true);
								setPlatform('Mastodon');
							}}
						>
							{intl.formatMessage({
								id: 'social.coming',
							})}
						</Button>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/sns/github.svg" />
						<span className={styles.label}>Github</span>
					</span>
					<span className={styles.value}>
						<Button
							disabled
							type="primary"
							shape="round"
							onClick={() => {
								setBindModal(true);
								setPlatform('Github');
							}}
						>
							{intl.formatMessage({
								id: 'social.coming',
							})}
						</Button>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/sns/hacker-news.svg" />
						<span className={styles.label}>Hacker News</span>
					</span>
					<span className={styles.value}>
						<Button
							disabled
							type="primary"
							shape="round"
							onClick={() => {
								setBindModal(true);
								setPlatform('Hacker-News');
							}}
						>
							{intl.formatMessage({
								id: 'social.coming',
							})}
						</Button>
					</span>
				</div>
				<div className={styles.field}>
					<span className={styles.title}>
						<img className={styles.icon} src="/images/sns/reddit.svg" />
						<span className={styles.label}>Reddit</span>
					</span>
					<span className={styles.value}>
						<Button
							disabled
							type="primary"
							shape="round"
							onClick={() => {
								setBindModal(true);
								setPlatform('Reddit');
							}}
						>
							{intl.formatMessage({
								id: 'social.coming',
							})}
						</Button>
					</span>
				</div>
			</div>

			<BigModal
				visable={bindModal}
				title={intl.formatMessage({
					id: 'social.bind.sns.title',
				})}
				content={
					<BindModal
						platform={platform}
						setBindModal={setBindModal}
						getStatus={init}
					/>}
				close={() => { setBindModal(false) }}
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

export default SNS;
