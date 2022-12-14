import FormField from '@/components/Form/FormField/FormField';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import Token from '@/components/Token/Token';
import { AddTokenReward, ClockInData, ClockInVO, DisableClockIn, EnableClockIn, QueryLottery, UpdateClockIn } from '@/services/parami/ClockIn.service';
import { QueryAssetById } from '@/services/parami/HTTP';
import { Asset } from '@/services/parami/typings';
import { BigIntToFloatString } from '@/utils/format';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, notification, Row, Spin, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import EditClockInModal from '../EditClockInModal/EditClockInModal';
import TokenAmountModal from '../TokenAmountModal/TokenAmountModal';
import style from './ClockIn.less';

const { Title } = Typography;

export interface ClockInProps {
    nftId: string;
}

function ClockIn({ nftId }: ClockInProps) {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const [passphrase, setPassphrase] = useState<string>('');

    const [asset, setAsset] = useState<Asset>();
    const [clockIn, setClockIn] = useState<ClockInVO | null>();
    const [levelsTableData, setLevelsTableData] = useState<{ level: string; probability: string }[]>([]);
    const [newClockIn, setNewClockIn] = useState<ClockInData>();
    const [editClockInModal, setEditClockInModal] = useState<boolean>(false);
    const [addBudgetModal, setAddBudgetModal] = useState<boolean>(false);
    const [tokenAmount, setTokenAmount] = useState<string>();

    const [enableClockInSecModal, setEnableClockInSecModal] = useState<boolean>(false);
    const [updateClockInSecModal, setUpdateClockInSecModal] = useState<boolean>(false);
    const [addBudgetSecModal, setAddBudgetSecModal] = useState<boolean>(false);
    const [disableClockInSecModal, setDisableClockInSecModal] = useState<boolean>(false);

    const queryClockIn = async (nftId: string) => {
        setClockIn(undefined);
        const clockIn = await QueryLottery(nftId);
        setClockIn(clockIn);
    }

    useEffect(() => {
        if (clockIn?.nftId) {
            const levelsData: { level: string; probability: string }[] = [];
            (clockIn.levelProbability ?? []).forEach((probability, index) => {
                const endpoint = !index ? 'base level' : BigIntToFloatString((clockIn.levelUpperBounds[index - 1] || '0'), 18).toString()
                levelsData.push({
                    level: endpoint,
                    probability: `${probability}%`
                })
            })
            setLevelsTableData(levelsData);
        }
    }, [clockIn])

    useEffect(() => {
        if (apiWs && nftId) {
            queryClockIn(nftId);

            QueryAssetById(nftId).then(res => {
                const { data } = res;
                if (data?.token) {
                    setAsset(data.token);
                }
            })
        }
    }, [apiWs, nftId]);

    const handleSubmitClockIn = async (clockInData: ClockInData) => {
        const newClockIn = {
            ...clockInData,
            nftId
        }

        setNewClockIn(newClockIn);

        if (clockInData.nftId) {
            setUpdateClockInSecModal(true);
        } else {
            setEnableClockInSecModal(true);
        }
    }

    const enableClockIn = async (preTx?: boolean, account?: string) => {
        try {
            const info: any = await EnableClockIn(newClockIn!, passphrase, wallet?.keystore, preTx, account);

            if (preTx && account) {
                return info;
            }

            notification.success({
                message: 'Enable Clock-in Success!'
            });
            setEditClockInModal(false);
            queryClockIn(nftId)
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
        }
    }

    const updateClockIn = async (preTx?: boolean, account?: string) => {
        try {
            const info: any = await UpdateClockIn(newClockIn!, passphrase, wallet?.keystore, preTx, account);

            if (preTx && account) {
                return info;
            }

            notification.success({
                message: 'Update Clock-in Success!'
            });
            setEditClockInModal(false);
            queryClockIn(nftId);
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
        }
    }

    const addBudget = async (preTx?: boolean, account?: string) => {
        try {
            const info: any = await AddTokenReward(nftId, tokenAmount!, passphrase, wallet?.keystore, preTx, account);
            if (preTx && account) {
                return info;
            }
            notification.success({
                message: 'Add Budget Success!'
            });
            queryClockIn(nftId);
            setAddBudgetModal(false);
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
        }
    }

    const disableClockIn = async (preTx?: boolean, account?: string) => {
        try {
            const info: any = await DisableClockIn(nftId, passphrase, wallet?.keystore, preTx, account);
            if (preTx && account) {
                return info;
            }
            notification.success({
                message: 'Clock-in Disabled!'
            });
            queryClockIn(nftId);
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
        }
    }

    const columns = [
        {
            title: 'Levels',
            dataIndex: 'level'
        },
        {
            title: 'Chance of winning',
            dataIndex: 'probability'
        }
    ]

    return <>
        <Title
            level={5}
            style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 10,
            }}
            className={style.title}
        >
            Daily Lotto
        </Title>
        <Card className={style.card}>
            <Spin spinning={clockIn === undefined}>

                {!clockIn && <>
                    <div>
                        <div>
                            Daily Lotto not enabled
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <Button
                                type="primary"
                                shape="round"
                                size="middle"
                                onClick={() => {
                                    setEditClockInModal(true);
                                }}>
                                Enable
                            </Button>
                        </div>
                    </div>
                </>}

                {clockIn?.nftId && <>
                    <Row style={{ width: '100%' }}>
                        <Col span={12}>
                            <div className={style.clockInStat}>
                                <FormField title='Remaining Budget'>
                                    <Token value={clockIn.remainingBudget} symbol={asset?.symbol}></Token>

                                    <Button
                                        type="primary"
                                        shape="round"
                                        size="small"
                                        style={{ marginLeft: '10px' }}
                                        onClick={() => {
                                            setAddBudgetModal(true);
                                        }}
                                    >
                                        Add Budget
                                    </Button>
                                </FormField>

                                <FormField title='Number of winners per day'>
                                    {clockIn.sharesPerBucket}
                                </FormField>

                                <FormField title='Winner award'>
                                    <Token value={clockIn.awardPerShare} symbol={asset?.symbol}></Token>
                                </FormField>

                                <div className={style.btnContainer}>
                                    <Button
                                        type="primary"
                                        shape="round"
                                        size="large"
                                        onClick={() => {
                                            setEditClockInModal(true);
                                        }}>
                                        Update
                                    </Button>
                                    <Button
                                        type="primary"
                                        shape="round"
                                        size="large"
                                        style={{ marginLeft: '10px' }}
                                        onClick={() => {
                                            Modal.confirm({
                                                title: 'Do you wish to disable the Clock-in reward?',
                                                icon: <ExclamationCircleOutlined />,
                                                content: 'People will not be able to collect Clock-in rewards until you re-enable it',
                                                onOk() {
                                                    setDisableClockInSecModal(true);
                                                }
                                            })
                                        }}>
                                        Disable
                                    </Button>
                                </div>
                            </div>
                        </Col>

                        <Col span={12}>
                            <Table columns={columns} dataSource={levelsTableData} pagination={false} />
                        </Col>
                    </Row>
                </>}
            </Spin>
        </Card>

        {addBudgetModal && <>
            <TokenAmountModal
                onSubmit={tokenAmount => {
                    setTokenAmount(tokenAmount);
                    setAddBudgetSecModal(true);
                }}
                onCancel={() => setAddBudgetModal(false)}
            ></TokenAmountModal>
        </>}

        {editClockInModal && <>
            <EditClockInModal
                clockIn={clockIn!}
                nftId={nftId}
                onCancel={() => setEditClockInModal(false)}
                onSubmit={(clockIn) => {
                    handleSubmitClockIn(clockIn);
                }}
            ></EditClockInModal>
        </>}

        {enableClockInSecModal && <SecurityModal
            visable={enableClockInSecModal}
            setVisable={setEnableClockInSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={enableClockIn}
        />}

        {updateClockInSecModal && <SecurityModal
            visable={updateClockInSecModal}
            setVisable={setUpdateClockInSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={updateClockIn}
        />}

        {addBudgetSecModal && <SecurityModal
            visable={addBudgetSecModal}
            setVisable={setAddBudgetSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={addBudget}
        />}

        {disableClockInSecModal && <SecurityModal
            visable={disableClockInSecModal}
            setVisable={setDisableClockInSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={disableClockIn}
        />}
    </>;
};

export default ClockIn;
