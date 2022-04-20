import React from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Card, Typography, Divider, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { FaWallet } from 'react-icons/fa';

const SelectWallet: React.FC = () => {
	const { connect } = useModel('web3');
	const intl = useIntl();

	const { Title } = Typography;

	return (
		<div className={styles.mainContainer}>
			<div className={styles.contentContainer}>
				<Card
					className={style.loginCard}
					bodyStyle={{
						padding: 32,
						width: '100%',
					}}
				>
					<Title
						level={4}
						className={style.title}
					>
						{intl.formatMessage({
							id: 'dashboard.bridge.login',
							defaultMessage: 'Login',
						})}
					</Title>
					<div className={style.appList}>
						<div
							className={style.appItem}
							onClick={async () => {
								await connect();
							}}
						>
							<div className={style.info}>
								<span className={style.name}>
									<FaWallet className={style.icon} />
									Connect Wallet
								</span>
							</div>
							<RightOutlined className={style.rightArrow} />
						</div>
					</div>
					<Divider />
					<div className={style.getWallet}>
						{intl.formatMessage({
							id: 'dashboard.bridge.dontHaveWallet',
							defaultMessage: 'Don\'t have wallet?',
						})}
						<Button
							type='link'
							size='middle'
						>
							{intl.formatMessage({
								id: 'dashboard.bridge.downloadHere',
								defaultMessage: 'Download here',
							})}
						</Button>
					</div>
				</Card>
			</div>
		</div>
	)
}

export default SelectWallet;
