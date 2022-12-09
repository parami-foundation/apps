import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Col, Input, InputNumber, Row, Select, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import style from './EditClockInModal.less'
import { BigIntToFloatString, FloatStringToBigInt } from '@/utils/format';
import FormField from '@/components/Form/FormField/FormField';
import { parseAmount } from '@/utils/common';
import { ClockInData, ClockInVO } from '@/services/parami/ClockIn.service';

export interface EditClockInModalProps {
    clockIn: ClockInVO,
    onSubmit: (clockIn: ClockInData) => void,
    onCancel: () => void
}

const totalSupply = 10000000; // todo: remove this
const defaultLevels = [1000, 10000, 100000, 1000000];
const defaultProbabilities = [1, 5, 10, 20, 50];

function EditClockInModal({ clockIn, onSubmit, onCancel }: EditClockInModalProps) {
    const [levels, setLevels] = useState<number[]>([])
    const [probabilities, setProbabilities] = useState<number[]>([])
    const [numWinners, setNumWinners] = useState<number>();
    const [rewardAmount, setRewardAmount] = useState<number>();
    const [tokenAmount, setTokenAmount] = useState<number>();

    useEffect(() => {
        // init data
        if (clockIn) {
            if (clockIn.levelEndpoints.length) {
                setLevels(clockIn.levelEndpoints.map(endpoint => parseFloat(BigIntToFloatString(endpoint, 18))));
            } else {
                setLevels(defaultLevels);
            }

            if (clockIn.levelProbability.length) {
                setProbabilities(clockIn.levelProbability);
            } else {
                setProbabilities(defaultProbabilities);
            }

            setNumWinners(clockIn.sharesPerBucket ?? 10);
            setRewardAmount(clockIn.awardPerShare ? parseFloat(BigIntToFloatString(clockIn.awardPerShare, 18)) : 0);
        }
    }, [clockIn])

    const handleSubmit = () => {
        const newLotteryData: ClockInData = {
            nftId: clockIn.nftId,
            levelEndpoints: levels!.map(endpoint => FloatStringToBigInt(`${endpoint}`, 18).toString()),
            levelProbability: probabilities,
            sharesPerBucket: numWinners!,
            awardPerShare: parseAmount(`${rewardAmount}`),
            totalRewardToken: parseAmount(`${tokenAmount}`)
        }
        onSubmit(newLotteryData);
    }

    return <>
        <BigModal
            visable
            title={'Clock In'}
            content={<>
                <div className={style.form}>
                    <FormField title='levels' required>
                        <Row>
                            <Col span={16}>Range</Col>
                            <Col span={8}>Probability</Col>
                        </Row>
                        {levels.map((level, index) => {
                            return <>
                                <Row className={style.levelConfigRow}>
                                    <Col span={16}>
                                        <div className={style.range}>
                                            <span className={style.rangeNum}>{index > 0 ? levels[index - 1] : 0}</span>
                                            <span>-</span>
                                            <Input
                                                className={style.rangeInput}
                                                value={level}
                                                type='number'
                                                onChange={e => {
                                                    const newLevelValues = levels.slice();
                                                    newLevelValues[index] = parseInt(e.target.value, 10);
                                                    setLevels(newLevelValues);
                                                }}
                                            ></Input>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <Input
                                            type='number'
                                            value={probabilities[index]}
                                            onChange={e => {
                                                const newProbValues = probabilities.slice();
                                                newProbValues[index] = parseInt(e.target.value, 10);
                                                setProbabilities(newProbValues);
                                            }}
                                        ></Input>
                                    </Col>
                                </Row>
                            </>
                        })}
                        <Row className={style.levelConfigRow}>
                            <Col span={16}>
                                <div className={style.range}>
                                    <span className={style.rangeNum}>
                                        {levels[3]}
                                    </span>
                                    <span>-</span>
                                    <Input
                                        className={style.rangeInput}
                                        value={totalSupply}
                                        type='number'
                                        disabled
                                    ></Input>
                                </div>
                            </Col>
                            <Col span={8}>
                                <Input
                                    type='number'
                                    value={probabilities[4]}
                                    onChange={e => {
                                        const newProbValues = probabilities.slice();
                                        newProbValues[4] = parseInt(e.target.value, 10);
                                        setProbabilities(newProbValues);
                                    }}
                                ></Input>
                            </Col>
                        </Row>
                    </FormField>

                    <FormField title='Number of winners' required>
                        <InputNumber
                            size='large'
                            step={1}
                            value={numWinners}
                            min={0}
                            onChange={(value) => setNumWinners(value)}
                        />
                    </FormField>

                    <FormField title='Winner award amount' required>
                        <InputNumber
                            size='large'
                            placeholder="0.00"
                            value={rewardAmount}
                            min={0}
                            onChange={(value) => setRewardAmount(value)}
                        />
                    </FormField>

                    {!clockIn.nftId && <>
                        <FormField title='Deposit Token Amount' required>
                            <InputNumber
                                placeholder="0.00"
                                size='large'
                                value={tokenAmount}
                                min={0}
                                onChange={(value) => setTokenAmount(value)}
                            />
                        </FormField>
                    </>}
                </div>
            </>}
            footer={<>
                <Button
                    block
                    type="primary"
                    shape="round"
                    size="large"
                    disabled={false}
                    onClick={() => {
                        handleSubmit();
                    }}
                >
                    Submit
                </Button>
            </>}
            close={() => onCancel()}
        ></BigModal>
    </>;

};

export default EditClockInModal;
