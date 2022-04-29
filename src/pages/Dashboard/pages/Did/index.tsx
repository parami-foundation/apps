import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Card } from 'antd';
import Assets from './components/Assets';
import AD3 from '@/components/Token/AD3';
import DID from '@/components/Did/did';
import { useModel } from 'umi';
import Avatar from '@/components/Avatar/Avatar';

const Did: React.FC = () => {
	const { dashboard } = useModel('currentUser');
	const { avatar } = useModel('dashboard.user');
	const { balance } = useModel('dashboard.balance');

	const intl = useIntl();

	return (
		<div className={styles.mainBgContainer}>
			<div className={styles.contentContainer}>
				<Card
					className={styles.dashboardCard}
					bodyStyle={{
						width: '100%',
					}}
				>
					<div className={style.profileCard}>
						<Avatar
							avatar={avatar || '/images/logo-square-core.svg'}
						/>
						<div className={style.profile}>
							<div className={style.totalBalance}>
								<div className={styles.title}>
									{intl.formatMessage({
										id: 'dashboard.did.balance',
										defaultMessage: 'Balance',
									})}
								</div>
								<div className={style.amount}>
									<AD3 value={balance?.total} />
								</div>
								<div className={style.availableBalance}>
									{intl.formatMessage({
										id: 'dashboard.did.availableBalance',
									})}
									: <AD3 value={balance?.free} />
								</div>
								<DID did={dashboard.did!} />
							</div>
						</div>
					</div>
					<Assets />
				</Card>
			</div>
		</div>
	)
}

export default Did;
