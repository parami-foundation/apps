/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Button, Input, InputNumber, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Edit: React.FC<{
    adItem: any[],
}> = ({ adItem }) => {
    const [budget, setBudget] = useState<number>();
    const [tags, setTags] = useState<string[]>([]);
    const [oldTags, setOldTags] = useState<number>(0);
    const [metadata, setMetadata] = useState<string>();
    const [rewardRate, setRewardRate] = useState<number>();
    const [lifetime, setLifetime] = useState<number>();

    const [tagInputVisible, setTagInputVisible] = useState<boolean>(false);
    const [tagInputValue, setTagInputValue] = useState<string>('');
    const [tagEditInputIndex, setTagEditInputIndex] = useState<number>(-1);
    const [tagEditInputValue, setTagEditInputValue] = useState<string>('');
    const tagInputRef = useRef<Input>(null);

    const intl = useIntl();

    const handleTagInputConfirm = () => {
        let Tags = tags;
        if (tagInputValue && tags.indexOf(tagInputValue) === -1) {
            Tags = [...tags, tagInputValue];
        }
        setTags(Tags);
        setTagInputVisible(false);
        setTagInputValue('');
    };

    const handleTagEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[tagEditInputIndex] = tagEditInputValue;

        setTags(newTags);
        setTagEditInputIndex(-1);
        setTagEditInputValue('');
    };

    const handleTagClose = (removedTag: any) => {
        const Tags = tags.filter(tag => tag !== removedTag);
        setTags(Tags);
    };

    return (
        <>
            <div className={styles.modalBody}>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.ads.create.budget',
                        })}
                    </div>
                    <div className={styles.value}>
                        <InputNumber
                            className={styles.withAfterInput}
                            placeholder="0.00"
                            size='large'
                            type='number'
                            maxLength={18}
                            min={0}
                            onChange={(e) => setBudget(e)}
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.ads.create.tag',
                        })}
                        ({oldTags})
                    </div>
                    <div className={styles.value}>
                        {tags.map((tag, index) => {
                            if (tagEditInputIndex === index) {
                                return (
                                    <Input
                                        key={tag}
                                        size='large'
                                        onChange={(e) => {
                                            setTagEditInputValue(e.target.value);
                                        }}
                                        onBlur={() => { handleTagEditInputConfirm() }}
                                        onPressEnter={() => { handleTagEditInputConfirm() }}
                                    />
                                );
                            }

                            const isLongTag = tag.length > 20;

                            const tagElem = (
                                <Tag
                                    className={style.tag}
                                    color='volcano'
                                    key={tag}
                                    closable={true}
                                    onClose={(item) => handleTagClose(item)}
                                >
                                    <span
                                        onDoubleClick={() => {
                                            setTagEditInputIndex(index);
                                            setTagEditInputValue(tag);
                                            focus();
                                        }}
                                    >
                                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                    </span>
                                </Tag>
                            );
                            return isLongTag ? (
                                <Tooltip
                                    title={tag}
                                    key={tag}
                                >
                                    {tagElem}
                                </Tooltip>
                            ) : (
                                tagElem
                            );
                        })}
                        {tagInputVisible && (
                            <Input
                                ref={tagInputRef}
                                type='text'
                                size='large'
                                className={style.tagInput}
                                onChange={(e) => {
                                    setTagInputValue(e.target.value);
                                }}
                                onBlur={() => { handleTagInputConfirm() }}
                                onPressEnter={() => { handleTagInputConfirm() }}
                            />
                        )
                        }
                        {!tagInputVisible && (
                            <Tag
                                className={style.tag}
                                color='volcano'
                                onClick={() => {
                                    setTagInputVisible(true);
                                    tagInputRef.current?.focus();
                                }}
                            >
                                <PlusOutlined />
                                {intl.formatMessage({
                                    id: 'dashboard.ads.create.tag.new',
                                })}
                            </Tag>
                        )
                        }
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.ads.create.metadata',
                        })}
                    </div>
                    <div className={styles.value}>
                        <img
                            src={'/images/background.svg'}
                            className={style.metaDataImg}
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.ads.create.rewardRate',
                        })}
                    </div>
                    <div className={styles.value}>
                        <InputNumber
                            value={0}
                            className={styles.withAfterInput}
                            placeholder="0.00"
                            size='large'
                            type='number'
                            maxLength={18}
                            min={0}
                            onChange={(e) => setRewardRate(e)}
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.title}>
                        {intl.formatMessage({
                            id: 'dashboard.ads.create.lifetime',
                        })}
                    </div>
                    <div className={styles.value}>
                        <InputNumber
                            readOnly
                            className={styles.withAfterInput}
                            placeholder="0.00"
                            size='large'
                            type='number'
                            maxLength={18}
                            value={lifetime}
                            min={0}
                        />
                    </div>
                </div>
                <div
                    className={styles.field}
                    style={{
                        marginTop: 50
                    }}
                >
                    <Button
                        block
                        size='large'
                        shape='round'
                        type='primary'
                        disabled={!tags}
                        onClick={() => {

                        }}
                    >
                        {intl.formatMessage({
                            id: 'common.submit',
                        })}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Edit;
