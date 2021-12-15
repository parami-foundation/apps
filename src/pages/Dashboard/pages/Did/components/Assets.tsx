import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import { Divider, Table } from 'antd';
import { useModel } from 'umi';
import Token from '@/components/Token/Token';
import AD3 from '@/components/Token/AD3';

const Assets: React.FC = () => {
    const { assetsArr } = useModel('dashboard.assets');

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
            render: (text, row) => (
                <Token value={row.balance} symbol={row.symbol} />
            ),
        },
        {
            title: intl.formatMessage({
                id: 'dashboard.assets.value',
            }),
            dataIndex: 'ad3',
            key: 'ad3',
            render: (record) => (
                <AD3 value={record} />
            ),
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
                dataSource={assetsArr}
                columns={columns}
            />
        </>
    )
}

export default Assets;
