import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { Typography, Image, Card, Button, Tooltip, message } from 'antd';
import { CopyOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons';
import AD3 from '@/components/Token/AD3';
import { hexToDid } from '@/utils/common';
import CopyToClipboard from 'react-copy-to-clipboard';
import Nickname from './Nickname';
import Skeleton from '@/components/Skeleton';

const AccountDetails: React.FC = () => {
	const apiWs = useModel('apiWs');
	const { balance } = useModel('balance');
	const { nickname } = useModel('user');
	const { wallet }: any = useModel('currentUser');
	const [nicknameModal, setNicknameModal] = useState<boolean>(false);

	const intl = useIntl();

	const { Title } = Typography;

	return (
		<>
			<Title
				level={3}
				className={style.sectionTitle}
			>
				<Image
					src='/images/icon/mine.svg'
					className={style.sectionIcon}
					preview={false}
				/>
				{intl.formatMessage({
					id: 'account.accountDetails.title',
				})}
			</Title>
			<Skeleton
				loading={!apiWs}
				height={400}
				children={
					<Card
						className={styles.card}
						bodyStyle={{
							padding: 0,
							width: '100%',
						}}
						style={{
							marginTop: 30,
						}}
					>
						<div className={style.accountDetails}>
							<div className={style.field}>
								<div className={style.title}>
									{intl.formatMessage({
										id: 'account.accountDetails.nickname',
									})}
								</div>
								<div className={style.idCody}>
									<span className={style.text}>
										{nickname.toString() || 'Nickname'}
									</span>
									<Button
										size='middle'
										shape='circle'
										icon={<FormOutlined />}
										className={style.valueButton}
										onClick={() => {
											setNicknameModal(true);
										}}
									/>
								</div>
							</div>
							<div className={style.field}>
								<div className={style.title}>
									{intl.formatMessage({
										id: 'account.accountDetails.DID',
									})}
								</div>
								<div className={style.idCody}>
									<span className={style.text}>
										{hexToDid(wallet?.did)}
									</span>
									<CopyToClipboard
										text={hexToDid(wallet?.did)}
										onCopy={() => {
											message.success(
												intl.formatMessage({
													id: 'common.copied',
												}),
											)
										}}
									>
										<Button
											size='middle'
											shape='circle'
											icon={<CopyOutlined />}
											className={style.valueButton}
										/>
									</CopyToClipboard>
								</div>
							</div>
							<div className={style.field}>
								<div className={style.title}>
									{intl.formatMessage({
										id: 'account.accountDetails.walletBalance',
									})}
								</div>
								<div className={style.value}>
									<AD3 value={balance?.total} />
								</div>
							</div>
							<div className={style.balanceDetail}>
								<div className={style.field}>
									<div className={style.title}>
										{intl.formatMessage({
											id: 'account.accountDetails.reservedBalance',
										})}
										<Tooltip
											placement="top"
											title={intl.formatMessage({
												id: 'account.accountDetails.reservedBalance.tip',
											})}
										>
											<ExclamationCircleOutlined className={style.infoIcon} />
										</Tooltip>
									</div>
									<div className={style.value}>
										<AD3 value={balance?.reserved} />
									</div>
								</div>
								<div className={style.field}>
									<div className={style.title}>
										{intl.formatMessage({
											id: 'account.accountDetails.availableBalance',
										})}
										<Tooltip
											placement="top"
											title={intl.formatMessage({
												id: 'account.accountDetails.availableBalance.tip',
											})}
										>
											<ExclamationCircleOutlined className={style.infoIcon} />
										</Tooltip>
									</div>
									<div className={style.value}>
										<AD3 value={balance?.free} />
									</div>
								</div>
							</div>
						</div>
					</Card>
				}
			/>

			<Nickname
				nicknameModal={nicknameModal}
				setNicknameModal={setNicknameModal}
			/>
		</>
	)
}

export default AccountDetails;
