import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Alert, Button, PageHeader, Statistic } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import List from './components/List';
import BigModal from '@/components/ParamiModal/BigModal';
import Create from './components/Create';
import { GetAdsListOf, GetTagsOf } from '@/services/parami/dashboard';
import { formatBalance } from '@polkadot/util';
import { fromHexString } from '@/utils/hexcode';

const Message: React.FC<{
    content: string;
}> = ({ content }) => (
    <Alert
        style={{
            marginBottom: 24,
        }}
        message={content}
        type="error"
        showIcon
    />
);

const did = localStorage.getItem('dashboardDid') as string;

const Control: React.FC = () => {
    const [errorState, setErrorState] = useState<API.Error>({});
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [adsList, setAdsList] = useState<any[]>([]);

    const intl = useIntl();

    const getAdsList = async () => {
        try {
            const ads = await GetAdsListOf(fromHexString(did) as Uint8Array);
            const data: any[] = [];
            if (ads.length) {
                for (const adsID in ads) {
                    data.push({
                        id: ads[adsID].id,
                        budget: formatBalance(ads[adsID].meta.budget, { withUnit: 'AD3' }, 18),
                        tag: await GetTagsOf(ads[adsID].id),
                        metadata: ads[adsID].meta.metadata,
                        rewardRate: ads[adsID].meta.rewardRate,
                        deadline: ads[adsID].meta.deadline,
                    })
                }
                setAdsList(data);
            }
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    }

    useEffect(() => {
        getAdsList();
    }, []);

    return (
        <>
            {errorState.Message && <Message content={errorState.Message} />}
            <div className={styles.mainContainer}>
                <div className={styles.contentContainer}>
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
                </div>
            </div>
            <BigModal
                visable={createModal}
                title={intl.formatMessage({
                    id: 'dashboard.ads.control.create',
                })}
                content={
                    <Create setCreateModal={setCreateModal} />
                }
                footer={
                    <>
                        <Button
                            block
                            shape='round'
                            size='large'
                            onClick={() => {
                                setCreateModal(false);
                            }}
                        >
                            {intl.formatMessage({
                                id: 'common.close',
                                defaultMessage: 'Close',
                            })}
                        </Button>
                    </>
                }
            />
        </>
    )
}

export default Control;
