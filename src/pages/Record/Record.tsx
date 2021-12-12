import React, { useState } from 'react';
import { Card, Timeline, Alert, Tooltip } from 'antd';
import { useIntl } from 'umi';
import classNames from 'classnames';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { useEffect } from 'react';
import { AssetTransactionHistory } from '@/services/subquery/subquery';
import type { AssetTransaction } from '@/services/subquery/subquery';
import SimpleDateTime from 'react-simple-timestamp-to-date';
import { dealWithDid, hexToDid } from '@/utils/common';
import Token from '@/components/Token/Token';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';

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

const All: React.FC<{
    allData: AssetTransaction[],
    userDid: string,
}> = ({ allData, userDid }) => {
    return (
        <>
            <Timeline className={style.timeline}>
                {allData.map((value) => {
                    return (
                        <Timeline.Item
                            color={value.fromDid === userDid ? "red" : "green"}
                            dot={value.fromDid === userDid ? <LogoutOutlined /> : <LoginOutlined />}
                            className={style.timelineItem}
                            key={value.timestampInSecond}
                        >
                            <div className={style.body}>
                                <div className={style.left}>
                                    <div className={style.desc}>
                                        {value.fromDid === userDid ? '-' : '+'}
                                        <Token value={value.amount} symbol={value.assetSymbol} />
                                    </div>
                                    <div className={style.receiver}>
                                        hash:{value.block}
                                    </div>
                                </div>
                                <div className={style.right}>
                                    <div className={style.address}>
                                        <Tooltip placement="topLeft" title={dealWithDid(value, userDid)}>
                                            {dealWithDid(value, userDid)}
                                        </Tooltip>
                                    </div>
                                    <div className={style.time}>
                                        <SimpleDateTime dateSeparator="/" timeSeparator=":" format="YMD">{value.timestampInSecond}</SimpleDateTime>
                                    </div>
                                </div>
                            </div>
                        </Timeline.Item>
                    )
                })}
            </Timeline>
        </>
    )
}

const Send: React.FC<{
    allData: AssetTransaction[],
    userDid: string,
}> = ({ allData, userDid }) => {
    return (
        <>
            <Timeline className={style.timeline}>
                {allData.map((value) => value.fromDid === userDid && (
                    <Timeline.Item
                        color="red"
                        className={style.timelineItem}
                        dot={<LogoutOutlined />}
                    >
                        <div className={style.body}>
                            <div className={style.left}>
                                <div className={style.desc}>
                                    -<Token value={value.amount} symbol={value.assetSymbol} />
                                </div>
                                <div className={style.receiver}>
                                    hash:{value.block}
                                </div>
                            </div>
                            <div className={style.right}>
                                <div className={style.address}>
                                    <Tooltip placement="topLeft" title={value.toDid.indexOf('0x') >= 0 ? hexToDid(value.toDid) : value.toDid}>
                                        {value.toDid.indexOf('0x') >= 0 ? hexToDid(value.toDid) : value.toDid}
                                    </Tooltip>
                                </div>
                                <div className={style.time}>
                                    <SimpleDateTime dateSeparator="/" timeSeparator=":" format="YMD">{value.timestampInSecond}</SimpleDateTime>
                                </div>
                            </div>
                        </div>
                    </Timeline.Item>
                ))}
            </Timeline>
        </>
    )
}

const Receive: React.FC<{
    allData: AssetTransaction[],
    userDid: string,
}> = ({ allData, userDid }) => {
    return (
        <>
            <Timeline className={style.timeline}>
                {allData.map((value) => value.toDid === userDid && (
                    <Timeline.Item
                        color="green"
                        className={style.timelineItem}
                        dot={<LoginOutlined />}
                    >
                        <div className={style.body}>
                            <div className={style.left}>
                                <div className={style.desc}>
                                    +<Token value={value.amount} symbol={value.assetSymbol} />
                                </div>
                                <div className={style.receiver}>
                                    hash:{value.block}
                                </div>
                            </div>
                            <div className={style.right}>
                                <div className={style.address}>
                                    <Tooltip placement="topLeft" title={value.fromDid.indexOf('0x') >= 0 ? hexToDid(value.fromDid) : value.fromDid}>
                                        {value.fromDid.indexOf('0x') >= 0 ? hexToDid(value.fromDid) : value.fromDid}
                                    </Tooltip>
                                </div>
                                <div className={style.time}>
                                    <SimpleDateTime dateSeparator="/" timeSeparator=":" format="YMD">{value.timestampInSecond}</SimpleDateTime>
                                </div>
                            </div>
                        </div>
                    </Timeline.Item>
                ))}
            </Timeline>
        </>
    )
};

const Record: React.FC = () => {
    const [tab, setTab] = useState<string>('all');
    const [errorState, setErrorState] = useState<API.Error>({});
    const [allData, setAllData] = useState<AssetTransaction[]>([]);

    const intl = useIntl();

    const userDid = localStorage.getItem('did') as string;

    const getRecord = async () => {
        try {
            const res = await AssetTransactionHistory(userDid);
            setAllData(res);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        };
    };

    useEffect(() => {
        getRecord();
    }, []);

    return (
        <>
            <div className={styles.mainTopContainer}>
                <div className={styles.pageContainer}>
                    <Card
                        className={styles.card}
                        bodyStyle={{
                            padding: 0,
                            width: '100%',
                        }}
                    >
                        {errorState.Message && <Message content={errorState.Message} />}
                        <div className={styles.tabSelector}>
                            <div
                                className={classNames(styles.tabItem, tab === 'all' ? '' : styles.inactive)}
                                onClick={() => setTab('all')}
                            >
                                {intl.formatMessage({
                                    id: 'record.all',
                                })}
                            </div>
                            <div
                                className={classNames(styles.tabItem, tab === 'send' ? '' : styles.inactive)}
                                onClick={() => setTab('send')}
                            >
                                {intl.formatMessage({
                                    id: 'record.send',
                                })}
                            </div>
                            <div
                                className={classNames(styles.tabItem, tab === 'receive' ? '' : styles.inactive)}
                                onClick={() => setTab('receive')}
                            >
                                {intl.formatMessage({
                                    id: 'record.receive',
                                })}
                            </div>
                        </div>
                        <div className={style.recordList}>
                            {tab === 'all' && (
                                <All allData={allData} userDid={userDid} />

                            )}
                            {tab === 'send' && (
                                <Send allData={allData} userDid={userDid} />
                            )}
                            {tab === 'receive' && (
                                <Receive allData={allData} userDid={userDid} />
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Record;