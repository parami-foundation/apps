import BigModal from '@/components/ParamiModal/BigModal';
import config from '@/config/config';
import React, { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import BindModal from './BindModal';
import SNS from './SNS';
import BlockChain from './BlockChain';
import style from '../style.less';

const Bind: React.FC = () => {
	const linkedInfo = useModel('sns');
	const [bindModal, setBindModal] = useState<boolean>(false);
	const [bindPlatform, setBindPlatform] = useState<string>('');

	const { query } = history.location;
	const { from } = query as { from: string };

	const intl = useIntl();

	useEffect(() => {
		if (!Object.keys(linkedInfo).length) {
			return;
		}

		if (!!from && !linkedInfo[from]) {
			setBindModal(true);
			setBindPlatform(from);
		}
	}, [from, linkedInfo]);

	return (
		<>
			<div className={style.section}>
				<SNS
					setBindModal={setBindModal}
					setBindPlatform={setBindPlatform}
				/>
			</div>
			<div className={style.section}>
				<BlockChain
					setBindModal={setBindModal}
					setBindPlatform={setBindPlatform}
				/>
			</div>

			<BigModal
				visable={bindModal}
				title={intl.formatMessage({
					id: 'social.bind.sns.title',
				}, {
					platform: bindPlatform,
				})}
				content={
					<BindModal
						bindPlatform={bindPlatform}
						setBindModal={setBindModal}
					/>}
				close={() => {
					setBindModal(false);
					history.replace(config.page.accountPage);
				}}
				footer={false}
			/>
		</>
	)
}

export default Bind;
