import { Tooltip, notification } from 'antd';
import React from 'react';
import config from '@/config/config';
import style from './style.less';
import { QueryDID } from '@/services/parami/Identity';
import { QueryAccountExist } from '@/services/parami/Identity';

const SelectAccount: React.FC<{
	accounts: any[],
}> = ({ accounts }) => {
	const fetchCurrentUser = async (accountMeta: any) => {
		localStorage.setItem('parami:dashboard:accountMeta', JSON.stringify(accountMeta));

		try {
			const exist = await QueryAccountExist(accountMeta?.address);
			if (!exist) {
				notification.error({
					key: 'accessDenied',
					message: 'Access Denied',
					description: 'The account does not exist',
					duration: null,
				})
				return;
			}
			localStorage.setItem('parami:dashboard:account', accountMeta?.address)

			// Query DID
			const didData = await QueryDID(accountMeta?.address);
			if (didData !== null) {
				localStorage.setItem('parami:dashboard:did', didData);

				window.location.href = config.page.dashboard.didPage;
				return;
			} else {
				notification.error({
					key: 'accessDenied',
					message: 'Access Denied',
					description: 'The account does not exist',
					duration: null,
				});
				return;
			}
		} catch (e: any) {
			notification.error({
				key: 'unknownError',
				message: e.message || e,
				duration: null,
			})
			return;
		}
	}

	return (
		<div className={style.selectAccount}>
			{accounts.map((value) => (
				<div
					className={style.field}
					onClick={() => {
						fetchCurrentUser(value);
					}}
				>
					<span className={style.title}>
						{value?.meta?.name}
					</span>
					<Tooltip
						placement="bottomRight"
						title={value?.address}
					>
						<span className={style.value}>
							{value?.address}
						</span>
					</Tooltip>
				</div>
			))}
		</div>
	)
}

export default SelectAccount;
