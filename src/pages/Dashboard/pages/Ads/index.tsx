import { IsAdvertiser } from '@/services/parami/dashboard';
import { Alert } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Become from './become';
import Control from './control';

const stashUserAddress = localStorage.getItem('dashboardStashUserAddress') as string;

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

const Ads: React.FC = () => {
    const apiWs = useModel('apiWs');
    const [advertisers, setAdvertisers] = useState<boolean>(false);
    const [errorState, setErrorState] = useState<API.Error>({});

    const fetchStatus = async () => {
        try {
            const isAdvertiser = await IsAdvertiser(stashUserAddress);
            setAdvertisers(isAdvertiser);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    };

    useEffect(() => {
        if (apiWs) {
            fetchStatus();
        }
    }, [apiWs]);

    return (
        <>
            {errorState.Message && <Message content={errorState.Message} />}
            {!advertisers && (
                <Become setAdvertisers={setAdvertisers} />
            )}
            {!!advertisers && (
                <Control />
            )}
        </>
    )
}

export default Ads;
