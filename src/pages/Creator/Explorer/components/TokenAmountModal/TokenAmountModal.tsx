import FormField from '@/components/Form/FormField/FormField';
import BigModal from '@/components/ParamiModal/BigModal';
import { parseAmount } from '@/utils/common';
import { Button, InputNumber } from 'antd';
import React, { useState } from 'react';
import style from './TokenAmountModal.less';

export interface TokenAmountModalProps {
    onSubmit: (tokenAmount: string) => void;
    onCancel: () => void;
}

function TokenAmountModal({ onSubmit, onCancel }: TokenAmountModalProps) {
    const [tokenAmount, setTokenAmount] = useState<number>();

    const handleSubmit = () => {
        onSubmit(parseAmount(`${tokenAmount}`))
    }

    return <>
        <BigModal
            visable
            title={'Token Amount'}
            content={<>
                <div className={style.form}>
                    <FormField title='Token Amount' required>
                        <InputNumber
                            className={style.withAfterInput}
                            placeholder="0.00"
                            size='large'
                            maxLength={18}
                            min={0}
                            onChange={(value) => setTokenAmount(value)}
                        />
                    </FormField>
                </div>
            </>}
            footer={<>
                <Button
                    block
                    type="primary"
                    shape="round"
                    size="large"
                    disabled={!tokenAmount}
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

export default TokenAmountModal;
