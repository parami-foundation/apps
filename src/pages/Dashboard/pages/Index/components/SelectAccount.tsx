import { Tooltip, message } from 'antd';
import React from 'react';
import config from '@/config/config';
import style from './style.less';
import { useIntl } from 'umi';
import { GetStableAccount, QueryDid } from '@/services/parami/wallet';

const SelectAccount: React.FC<{
    accounts: any[],
}> = ({ accounts }) => {
    const intl = useIntl();

    const fetchCurrentUser = async (currentAccount: any) => {
        localStorage.setItem('dashboardCurrentAccount', JSON.stringify(currentAccount));

        try {
            const existAccounts = await GetStableAccount(currentAccount?.address);
            if (!existAccounts) {
                message.error(intl.formatMessage({
                    id: 'error.account.notFound',
                }));
                return;
            }
            localStorage.setItem('dashboardControllerUserAddress', currentAccount?.address)
            localStorage.setItem('dashboardStashUserAddress', existAccounts?.stashAccount as string);

            // Query DID
            const didData = await QueryDid(existAccounts?.stashAccount);
            if (didData !== null) {
                localStorage.setItem('dashboardDid', didData as string);

                window.location.href = config.page.dashboard.didPage;
                return;
            } else {
                message.error(intl.formatMessage({
                    id: 'error.account.notFound',
                }))
            }
        } catch (e: any) {
            message.error(e.message);
            message.error(intl.formatMessage({
                id: 'error.account.notFound',
            }));
            return;
        }
    }

    return (
        <>
            <div className={style.selectAccount}>
                {accounts.map((value) => (
                    <div
                        className={style.field}
                        onClick={() => { fetchCurrentUser(value) }}
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
        </>
    )
}

export default SelectAccount;
