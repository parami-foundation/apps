import AdvertisementPreview from '@/components/Advertisement/AdvertisementPreview/AdvertisementPreview';
import Token from '@/components/Token/Token';
import { QueryClockIn } from '@/services/parami/ClockIn.service';
import { BigIntToFloatString } from '@/utils/format';
import { Button, Card, Col, Descriptions, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import EditClockInModal from '../EditClockInModal/EditClockInModal';
import style from './ClockIn.less';

const { Title } = Typography;

export interface ClockInProps {
    nftId: string;
}

function ClockIn({ nftId }: ClockInProps) {
    const apiWs = useModel('apiWs');
    const [clockIn, setClockIn] = useState<any>();
    const [editClockInModal, setEditClockInModal] = useState<boolean>(false);

    useEffect(() => {
        if (apiWs && nftId) {
            QueryClockIn(nftId).then(clockIn => setClockIn(clockIn));
        }
    }, [apiWs, nftId]);

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
            Clock-in Reward
        </Title>
        <Card className={style.card}>
            <Spin spinning={!clockIn}>
                {clockIn && <>
                    <Row>
                        <Col span={12}>
                            <Descriptions>
                                <Descriptions.Item label='Status' span={3}>{clockIn.status}</Descriptions.Item>
                                <Descriptions.Item label='Remaining Budget' span={3}>
                                    <Token value={clockIn.remainingBudget} symbol={clockIn.symbol}></Token>
                                </Descriptions.Item>
                                <Descriptions.Item label='Tags' span={3}>
                                    {!clockIn.tags.length && '-'}
                                    {clockIn.tags.length > 0 && `${clockIn.tags.join(', ')}`}
                                </Descriptions.Item>
                                <Descriptions.Item label='Payout Base' span={3}>{BigIntToFloatString(clockIn.payoutBase, 18)}</Descriptions.Item>
                                <Descriptions.Item label='Payout Min' span={3}>{BigIntToFloatString(clockIn.payoutMin, 18)}</Descriptions.Item>
                                <Descriptions.Item label='Payout Max' span={3}>{BigIntToFloatString(clockIn.payoutMax, 18)}</Descriptions.Item>
                            </Descriptions>
                            <div className={style.btnContainer}>
                                <Button
                                    type="primary"
                                    shape="round"
                                    size="middle" onClick={() => {
                                        setEditClockInModal(true);
                                    }}>
                                    Update
                                </Button>
                                <Button
                                    type="primary"
                                    shape="round"
                                    size="middle">
                                    Add Budget
                                </Button>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className={style.previewContainer}>
                                <AdvertisementPreview ad={clockIn.metadata}></AdvertisementPreview>
                            </div>
                        </Col>
                    </Row>
                </>}
            </Spin>
        </Card>

        {editClockInModal && <>
            <EditClockInModal
                clockIn={clockIn}
                onCancel={() => setEditClockInModal(false)}
                onSubmit={(clockIn) => {
                    // todo: update/create clockIn
                    setClockIn(clockIn);
                    setEditClockInModal(false);
                }}
            ></EditClockInModal>
        </>}
    </>;
};

export default ClockIn;
