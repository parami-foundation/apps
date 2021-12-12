import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import { Divider, Table } from 'antd';

const Assets: React.FC<{
    assetsBalance: any[],
}> = ({ assetsBalance }) => {
    const intl = useIntl();

    const columns = [
        {
            title: intl.formatMessage({
                id: 'dashboard.assets.token',
            }),
            dataIndex: 'token',
            key: 'token',
        },
        {
            title: intl.formatMessage({
                id: 'dashboard.assets.balance',
            }),
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: intl.formatMessage({
                id: 'dashboard.assets.value',
            }),
            dataIndex: 'value',
            key: 'value',
        },
    ];


    return (
        <>
            <Divider
                className={styles.dividerTitle}
            >
                {intl.formatMessage({
                    id: 'dashboard.assets.title',
                })}
            </Divider>
            <Table
                className={styles.table}
                dataSource={assetsBalance}
                columns={columns}
            />
        </>
    )
}

export default Assets;
