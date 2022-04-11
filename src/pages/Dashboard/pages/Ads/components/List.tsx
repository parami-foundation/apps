import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import { Button, Divider, Space, Table, Tooltip } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import { useState } from 'react';
import BigModal from '@/components/ParamiModal/BigModal';
import Edit from './Edit';
import Launch from './Launch';

const List: React.FC<{
    adsList: any[],
}> = ({ adsList }) => {
    const [editModal, setEditModal] = useState<boolean>(false);
    const [launchModal, setLaunchModal] = useState<boolean>(false);
    const [adItem, setAdItem] = useState<any[]>([]);

    const intl = useIntl();

    const columns = [
        {
            title: intl.formatMessage({
                id: 'dashboard.ads.item.id',
            }),
            dataIndex: 'id',
            key: 'id',
            render: (text: any) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
            ellipsis: true,
        },
        {
            title: intl.formatMessage({
                id: 'dashboard.ads.item.budget',
            }),
            dataIndex: 'budget',
            key: 'budget',
        },
        {
            title: intl.formatMessage({
                id: 'dashboard.ads.item.tag',
            }),
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: intl.formatMessage({
                id: 'dashboard.ads.item.metadata',
            }),
            dataIndex: 'metadata',
            key: 'metadata',
            render: (text: any) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
            ellipsis: true,
        },
        {
            title: intl.formatMessage({
                id: 'dashboard.ads.item.rewardRate',
            }),
            dataIndex: 'rewardRate',
            key: 'rewardRate',
        },
        {
            title: intl.formatMessage({
                id: 'dashboard.ads.item.endtime',
            }),
            dataIndex: 'endtime',
            key: 'endtime',
        },
        {
            title: intl.formatMessage({
                id: 'dashboard.ads.item.action',
            }),
            key: 'action',
            render: (item: any) => (
                <Space size="middle">
                    <Button
                        shape='round'
                        type='primary'
                        icon={<RocketOutlined />}
                        onClick={() => {
                            setAdItem(item);
                            setLaunchModal(true);
                        }}
                    >
                        {
                            intl.formatMessage({
                                id: 'dashboard.ads.item.launch',
                            })
                        }
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Divider
                className={styles.dividerTitle}
            >
                {intl.formatMessage({
                    id: 'dashboard.ads.list.title',
                })}
            </Divider>
            <Table
                className={styles.table}
                dataSource={adsList}
                columns={columns}
            />

            <BigModal
                visable={editModal}
                title={intl.formatMessage({
                    id: 'dashboard.ads.edit.title',
                })}
                content={
                    <Edit adItem={adItem} />
                }
                close={() => {
                    setEditModal(false)
                }}
                footer={false}
            />

            <BigModal
                visable={launchModal}
                title={intl.formatMessage({
                    id: 'dashboard.ads.launch.title',
                })}
                content={
                    <Launch adItem={adItem} setLaunchModal={setLaunchModal} />
                }
                close={() => {
                    setLaunchModal(false)
                }}
                footer={false}
                bodyStyle={{
                    padding: 0,
                }}
            />
        </>
    )
}

export default List;
