import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Input, InputNumber, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import style from './EditClockInModal.less'
import { IMAGE_TYPE } from '@/constants/advertisement';
import TwitterIntentModal from '@/pages/BidHNFT/components/TwitterIntentModal/TwitterIntentModal';
import FormErrorMsg from '@/components/Form/FormErrorMsg';
import { BigIntToFloatString } from '@/utils/format';
import FormField from '@/components/Form/FormField/FormField';
import ImageUpload from '@/components/Form/ImageUpload/ImageUpload';
import { useModel } from 'umi';
import { getMinPayoutBase } from '@/services/parami/Advertisement';
import { parseAmount } from '@/utils/common';

const { Option } = Select;

export interface EditClockInModalProps {
    clockIn: any,
    enableClockIn: boolean,
    onSubmit: (clockIn) => void,
    onCancel: () => void
}

function EditClockInModal({ clockIn, enableClockIn, onSubmit, onCancel }: EditClockInModalProps) {
    const apiWs = useModel('apiWs');
    const { tagOptions } = useModel('tagOptions');
    const [icon, setIcon] = useState<string>(clockIn.icon);
    const [poster, setPoster] = useState<string>(clockIn.poster);
    const [content, setContent] = useState<string>(clockIn.content);
    const [tags, setTags] = useState<string[]>(clockIn.tags ?? []);
    const [payoutBase, setPayoutBase] = useState<number>((clockIn.payoutBase && parseFloat(BigIntToFloatString(clockIn.payoutBase, 18))) ?? 1);
    const [payoutBaseMin, setPayoutBaseMin] = useState<number>(1);
    const [payoutMin, setPayoutMin] = useState<number>((clockIn.payoutMin && parseFloat(BigIntToFloatString(clockIn.payoutMin, 18))) ?? 1);
    const [payoutMax, setPayoutMax] = useState<number>((clockIn.payoutMax && parseFloat(BigIntToFloatString(clockIn.payoutMax, 18))) ?? 10);
    const [tokenAmount, setTokenAmount] = useState<number>();

    const [payoutMinError, setPayoutMinError] = useState<string>('');
    const [payoutMaxError, setPayoutMaxError] = useState<string>('');

    useEffect(() => {
        if (apiWs) {
            getMinPayoutBase().then(min => setPayoutBaseMin(min));
        }
    }, [apiWs]);

    const handleSubmit = () => {
        const newClockInData = {
            nftId: clockIn.nftId,
            icon,
            poster,
            content,
            payoutBase: parseAmount(`${payoutBase}`),
            payoutMin: parseAmount(`${payoutMin}`),
            payoutMax: parseAmount(`${payoutMax}`),
            tokenAmount: parseAmount(`${tokenAmount}`),
            tags
        }
        onSubmit(newClockInData);
    }

    useEffect(() => {
        setPayoutMaxError('');
        setPayoutMinError('');
        if (payoutMax < payoutMin) {
            setPayoutMaxError('Payout Max cannot be less than Payout Min')
        }
    }, [payoutMax]);

    useEffect(() => {
        setPayoutMaxError('');
        setPayoutMinError('');
        if (payoutMin > payoutMax) {
            setPayoutMinError('Payout Min cannot be more than Payout Max')
        }
    }, [payoutMin]);

    return <>
        <BigModal
            visable
            title={'Clock In'}
            content={<>
                <div className={style.form}>
                    <FormField title='Icon' required>
                        <ImageUpload imageUrl={icon} onImageUrlChange={url => {
                            setIcon(url)
                        }} imageType={IMAGE_TYPE.ICON}></ImageUpload>
                    </FormField>

                    <FormField title='Poster' required>
                        <ImageUpload imageUrl={poster} onImageUrlChange={url => setPoster(url)} imageType={IMAGE_TYPE.POSTER}></ImageUpload>
                    </FormField>

                    <FormField title='Content' required>
                        <Input
                            className={style.input}
                            value={content}
                            onChange={(a) => { setContent(a.target.value) }}
                        />
                    </FormField>

                    <FormField title='Tags' required>
                        <Select
                            allowClear
                            mode='multiple'
                            style={{ width: '100%' }}
                            placeholder="Please select tags"
                            defaultValue={tags}
                            onChange={values => {
                                setTags(values)
                            }}
                        >
                            {tagOptions.map(option => {
                                return <Option key={option.key} value={option.tag}>{option.tag}</Option>
                            })}
                        </Select>
                    </FormField>

                    <FormField title='Payout Base' required>
                        <InputNumber
                            className={style.withAfterInput}
                            placeholder="0.00"
                            size='large'
                            value={payoutBase}
                            maxLength={18}
                            min={0}
                            onChange={(value) => setPayoutBase(value)}
                        />
                        {(!payoutBase || payoutBase < payoutBaseMin) && <FormErrorMsg msg={`Payout Base cannot be less than ${payoutBaseMin}`} />}
                    </FormField>

                    <FormField title='Payout Min' required>
                        <InputNumber
                            className={`${style.withAfterInput} ${payoutMinError ? style.inputError : ''}`}
                            placeholder="0.00"
                            size='large'
                            maxLength={18}
                            min={0}
                            max={payoutMax}
                            value={payoutMin}
                            onChange={(value) => setPayoutMin(value)}
                        />
                        {payoutMinError && <FormErrorMsg msg={payoutMinError} />}
                    </FormField>

                    <FormField title='Payout Max' required>
                        <InputNumber
                            className={`${style.withAfterInput} ${payoutMaxError ? style.inputError : ''}`}
                            placeholder="0.00"
                            size='large'
                            maxLength={18}
                            value={payoutMax}
                            min={payoutMin}
                            onChange={(value) => setPayoutMax(value)}
                        />
                        {payoutMaxError && <FormErrorMsg msg={payoutMaxError} />}
                    </FormField>

                    {enableClockIn && <>
                        <FormField title='Reward Token Amount' required>
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

        {/* {twitterIntentModal && <>
            <TwitterIntentModal
                onCancel={() => setTwitterIntentModal(false)}
                onCreateTwitterIntent={(url: string) => {
                    // setLink(url);
                    setTwitterIntentModal(false)
                }}
            ></TwitterIntentModal>
        </>} */}
    </>;

};

export default EditClockInModal;