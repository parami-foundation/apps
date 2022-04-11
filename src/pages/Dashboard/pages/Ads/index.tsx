import Skeleton from '@/components/Skeleton';
import { IsAdvertiser } from '@/services/parami/dashboard';
import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from '@/pages/dashboard.less';
import { useModel } from 'umi';
import Become from './become';
import Control from './control';

const stashUserAddress = localStorage.getItem('dashboardStashUserAddress') as string;

const Ads: React.FC = () => {
    const apiWs = useModel('apiWs');
    const [advertisers, setAdvertisers] = useState<boolean>(false);

    const fetchStatus = async () => {
        try {
            const isAdvertiser = await IsAdvertiser(stashUserAddress);
            setAdvertisers(isAdvertiser);
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
        };
    };

    useEffect(() => {
        if (apiWs) {
            fetchStatus();
        }
    }, [apiWs]);

    return (
        <div className={styles.mainTopContainer}>
            <div className={styles.contentContainer}>
                <Skeleton
                    loading={!apiWs}
                    height={400}
                    children={
                        <>
                            {!advertisers && (
                                <Become setAdvertisers={setAdvertisers} />
                            )}
                            {advertisers && (
                                <Control />
                            )}
                        </>
                    }
                />
            </div>
        </div>
    )
}

export default Ads;
