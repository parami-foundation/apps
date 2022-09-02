import FormFieldTitle from '@/components/FormFieldTitle';
import { Input, Modal } from 'antd';
import React, { useState } from 'react';
import styles from '@/pages/dashboard.less';

export interface UserInstruction {
    text: string;
    tag: string;
    score: number;
}

export interface CreateUserInstructionProps {
    onCreateInstruction: (instruction: UserInstruction) => void;
    onCancel: () => void;
}

function CreateUserInstruction({ onCreateInstruction, onCancel }: CreateUserInstructionProps) {
    const [text, setText] = useState<string>();
    const [tag, setTag] = useState<string>();
    const [score, setScore] = useState<number>();

    const createInstruction = () => {
        if (text && tag && score) {
            onCreateInstruction({
                text,
                tag,
                score
            });
        }
    }

    return <>
        <Modal
            visible
            title="New Instruction"
            onOk={() => createInstruction()}
            onCancel={onCancel}
        >
            <div className={styles.field}>
                <div className={styles.title}>
                    <FormFieldTitle title={'Instruction Text'} required />
                </div>
                <div className={styles.value}>
                    <Input
                        size='large'
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Instruction Text'
                    />
                </div>
            </div>

            <div className={styles.field}>
                <div className={styles.title}>
                    <FormFieldTitle title={'Tag'} required />
                </div>
                <div className={styles.value}>
                    <Input
                        size='large'
                        onChange={(e) => setTag(e.target.value)}
                        placeholder='Tag to score'
                    />
                </div>
            </div>

            <div className={styles.field}>
                <div className={styles.title}>
                    <FormFieldTitle title={'score'} required />
                </div>
                <div className={styles.value}>
                    <Input
                        size='large'
                        type={'number'}
                        onChange={(e) => setScore(parseInt(e.target.value, 10))}
                        placeholder='score'
                    />
                </div>
            </div>
        </Modal>
    </>;
};

export default CreateUserInstruction;
