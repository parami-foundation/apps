import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import { Spin, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading: React.FC = () => {
    const intl = useIntl();

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.pageContainer}>
                    <Spin
                        size='large'
                        indicator={
                            <LoadingOutlined
                                spin
                                style={{
                                    fontSize: 60,
                                }}
                            />
                        }
                    />
                    <Alert
                        message={
                            intl.formatMessage({
                                id: 'common.loading.rpc',
                                defaultMessage: 'Connecting to RPC... Please REFRESH if it takes too long to load the page.'
                            })
                        }
                        style={{
                            marginTop: 30,
                        }}
                        type="info"
                    />
                </div>
            </div>
        </>
    )
}

export default Loading;
