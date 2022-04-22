import { Typography, Image } from 'antd';
import React from 'react';
import { useIntl, useModel } from 'umi';
import style from '../style.less';
import Skeleton from '@/components/Skeleton';
import Mnemonic from './Mnemonic';
import RecoveryLink from './RecoveryLink';

const Export: React.FC = () => {
	const apiWs = useModel('apiWs');

	const intl = useIntl();

	const { Title } = Typography;

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
							<Mnemonic />
							<RecoveryLink />
						</div>
					</>
				}
			/>
		</>
	)
}

export default Export;
