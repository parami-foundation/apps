import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import style from './style.less';
import { Button, notification, PageHeader, Statistic } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import List from './components/List';
import BigModal from '@/components/ParamiModal/BigModal';
import Create from './components/Create';
import { GetAdsListOf, GetTagsOf } from '@/services/parami/dashboard';
import { formatBalance } from '@polkadot/util';
import { fromHexString } from '@/utils/hexcode';
import { GetEndtimeOf } from '@/services/parami/ads';
import { deleteComma } from '@/utils/format';

const did = localStorage.getItem('dashboardDid') as string;

const Control: React.FC = () => {
    const apiWs = useModel('apiWs');
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [adsList, setAdsList] = useState<any[]>([]);

    const intl = useIntl();

    const getAdsList = async () => {
        try {
            const ads = await GetAdsListOf(fromHexString(did) as Uint8Array);
            const data: any[] = [];
            if (ads.length) {
                for (const adItem in ads) {
                    const endtime = await GetEndtimeOf(ads[adItem].id);
                    data.push({
                        id: ads[adItem].id,
                        budget: formatBalance(deleteComma(ads[adItem].meta.budget), { withUnit: 'AD3' }, 18),
                        tag: await GetTagsOf(ads[adItem].id),
                        metadata: ads[adItem].meta.metadata,
                        rewardRate: ads[adItem].meta.rewardRate,
                        endtime: endtime.toString(),
                    })
                }
                setAdsList(data);
            }
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
        }
    }

    useEffect(() => {
        if (apiWs) {
            getAdsList();
        }
    }, [apiWs]);

    return (
        <>
            <PageHeader
                className={style.header}
                title={
                    <Statistic
                        title={intl.formatMessage({
                            id: 'dashboard.ads.control.total',
                        })}
                        value={adsList.length}
                    />
                }
                extra={[
                    <Button
                        type='primary'
                        size='large'
                        shape='round'
                        icon={<PlusCircleOutlined />}
                        onClick={() => { setCreateModal(true) }}
                    >
                        {intl.formatMessage({
                            id: 'dashboard.ads.control.create',
                        })}
                    </Button>,
                ]}
            />
            <List adsList={adsList} />
            <BigModal
                visable={createModal}
                title={intl.formatMessage({
                    id: 'dashboard.ads.control.create',
                })}
                content={
                    <Create setCreateModal={setCreateModal} />
                }
                close={() => {
                    setCreateModal(false);
                }}
                footer={false}
            />
        </>
    )
}

export default Control;
