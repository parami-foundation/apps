import FormFieldTitle from '@/components/FormFieldTitle';
import { Input, Modal, Select } from 'antd';
import React, { useState } from 'react';
import styles from '@/pages/dashboard.less';
import { useModel } from 'umi';

const { Option } = Select;

export interface UserInstruction {
    text: string;
    tag?: string;
    score?: number;
    link?: string;
}

export interface CreateUserInstructionProps {
    onCreateInstruction: (instruction: UserInstruction) => void;
    onCancel: () => void;
}

function CreateUserInstruction({ onCreateInstruction, onCancel }: CreateUserInstructionProps) {
    const [text, setText] = useState<string>();
    const [tag, setTag] = useState<string>();
    const [score, setScore] = useState<number>();
    const [link, setLink] = useState<string>();

    const { tagOptions } = useModel('tagOptions');

    const createInstruction = () => {
        if (text) {
            onCreateInstruction({
                text,
                tag: tag,
                score: score,
                link: link
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
                    <FormFieldTitle title={'Tag'} />
                </div>
                <div className={styles.value}>
                    <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        onChange={value => setTag(value as string)}
                    >
                        {tagOptions.map(option => {
                            return <Option key={option.key} value={option.tag}>{option.tag}</Option>
                        })}
                    </Select>
                </div>
            </div>

            <div className={styles.field}>
                <div className={styles.title}>
                    <FormFieldTitle title={'score'} />
                </div>
                <div className={styles.value}>
                    <Input
                        size='large'
                        type={'number'}
                        step={1}
                        max={5}
                        min={-5}
                        value={score}
                        onChange={(e) => {
                            const score = Math.min(5, Math.max(-5, parseInt(e.target.value, 10)));
                            setScore(score);
                        }}
                        placeholder='score'
                    />
                </div>
            </div>

            <div className={styles.field}>
                <div className={styles.title}>
                    <FormFieldTitle title={'link'} />
                </div>
                <div className={styles.value}>
                    <Input
                        size='large'
                        onChange={(e) => setLink(e.target.value)}
                        placeholder='link'
                    />
                </div>
            </div>
        </Modal>
    </>;
};

export default CreateUserInstruction;
