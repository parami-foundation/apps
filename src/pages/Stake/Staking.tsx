import React from 'react';
import { useState } from 'react';
import { Button, Typography, Image, Tooltip } from 'antd';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import Add from './Staking/Add';
import List from './Staking/List';
import BigModal from '@/components/ParamiModal/BigModal';

const Staking: React.FC = () => {
	const [addModal, setAddModal] = useState<boolean>(false);

	const intl = useIntl();
	const { Title } = Typography;

	return (
		<>
			<div className={styles.mainTopContainer}>
				<div className={styles.pageContainer}>
					<div className={style.headerContainer}>
						<div className={style.titleContainer}>
							<Title
								level={1}
								className={style.sectionTitle}
							>
								<Image
									src='/images/icon/stake.svg'
									className={style.sectionIcon}
									preview={false}
								/>
								{intl.formatMessage({
									id: 'stake.title',
								})}
							</Title>
						</div>
						<div className={style.subtitle}>
							{intl.formatMessage({
								id: 'stake.subtitle',
							})}
						</div>
						<div className={style.addNewStake}>
							<Tooltip title="Coming Soon">
								<Button
									block
									type='primary'
									shape='round'
									size='large'
									className={style.stakeButton}
									onClick={() => { setAddModal(true) }}
								>
									{intl.formatMessage({
										id: 'stake.add',
									})}
								</Button>
							</Tooltip>

						</div>
					</div>
					<List />
				</div>
			</div>

			{addModal && <BigModal
				visable
				title={
					intl.formatMessage({
						id: 'stake.add',
					})
				}
				content={<Add setAddModal={setAddModal} />}
				footer={false}
				close={() => { setAddModal(false) }}
				bodyStyle={{
					padding: 0
				}}
			/>}

		</>
	)
}

export default Staking;