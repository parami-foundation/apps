import React, { useEffect, useState } from 'react';
import { useIntl, history } from 'umi';
import { Alert, Button, Timeline, Tooltip, Typography } from 'antd';
import styles from './RecordList.less';
import config from '@/config/config';
import type { AssetTransaction } from '@/services/subquery/subquery';
import { AssetTransactionHistory } from '@/services/subquery/subquery';
import SimpleDateTime from 'react-simple-timestamp-to-date';
import { dealWithDid } from '@/utils/common';
import Token from '@/components/Token/Token';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';

const { Title } = Typography;

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

const RecordList: React.FC = () => {
    const [errorState, setErrorState] = useState<API.Error>({});
    const [allData, setAllData] = useState<AssetTransaction[]>([]);

    const intl = useIntl();

    const did = localStorage.getItem('did') as string;

    const transList = async () => {
        try {
            const res = await AssetTransactionHistory(did);
            setAllData(res);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        };
    }
    useEffect(() => {
        transList();
    }, []);

    return (
        <>
            <div className={styles.recordList}>
                <Title level={4}>
                    {intl.formatMessage({
                        id: 'wallet.recordlist.title',
                    })}
                </Title>
                {errorState.Message && <Message content={errorState.Message} />}
                <Timeline className={styles.timeline}>
                    {allData.map((value, index) => {
                        if (index >= 5) return null;
                        return (
                            <Timeline.Item
                                color={value.fromDid === did ? "red" : "green"}
                                dot={value.fromDid === did ? <LogoutOutlined /> : <LoginOutlined />}
                                className={styles.timelineItem}
                                key={value.timestampInSecond}
                            >
                                <div className={styles.body}>
                                    <div className={styles.left}>
                                        <div className={styles.desc}>
                                            {value.fromDid === did ? '-' : '+'}
                                            <Token value={value.amount} symbol={value.assetSymbol} />
                                        </div>
                                        <div className={styles.receiver}>
                                            hash:{value.block}
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div className={styles.address}>
                                            <Tooltip placement="topLeft" title={dealWithDid(value, did)}>
                                                {
                                                    dealWithDid(value, did)
                                                }
                                            </Tooltip>
                                            {dealWithDid(value, did)}
                                        </div>
                                        <div className={styles.time}>
                                            <SimpleDateTime dateSeparator="/" timeSeparator=":" format="YMD">{value.timestampInSecond}</SimpleDateTime>
                                        </div>
                                    </div>
                                </div>
                            </Timeline.Item>
                        )
                    })}
                </Timeline>
                <Button
                    block
                    size="large"
                    shape="round"
                    type="primary"
                    ghost
                    onClick={() => { history.push(config.page.recordPage) }}
                >
                    {intl.formatMessage({
                        id: 'wallet.recordlist.all',
                    })}
                </Button>
            </div>
        </>
    )
}

export default RecordList;
