import React, { useRef, useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Alert, Button, Input, InputNumber, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CreateAds, CreateTag, ExistTag } from '@/services/parami/dashboard';
import BigModal from '@/components/ParamiModal/BigModal';
import { parseAmount } from '@/utils/common';

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

const currentAccount = localStorage.getItem('dashboardCurrentAccount') as string;

const Create: React.FC<{
    setCreateModal: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setCreateModal }) => {
    const [errorState, setErrorState] = useState<API.Error>({});
    const [budget, setBudget] = useState<number>(0);
    const [tags, setTags] = useState<string[]>([]);
    const [metadata, setMetadata] = useState<string>();
    const [rewardRate, setRewardRate] = useState<number>(0);
    const [lifetime, setLifetime] = useState<number>();
    const [createTag, setCreateTag] = useState<boolean>(false);

    const [tagInputVisible, setTagInputVisible] = useState<boolean>(false);
    const [tagInputValue, setTagInputValue] = useState<string>('');
    const [tagEditInputIndex, setTagEditInputIndex] = useState<number>(-1);
    const [tagEditInputValue, setTagEditInputValue] = useState<string>('');
    const tagInputRef = useRef<Input>(null);

    const intl = useIntl();

    const existTag = async (tag: string) => {
        try {
            const res = await ExistTag(tag);
            if (!res.toHuman()) {
                return false;
            }
            return true;
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
            return false;
        }
    };

    const newTag = async (tag: string) => {
        try {
            await CreateTag(tag, JSON.parse(currentAccount));
            let Tags = tags;
            if (tagInputValue && tags.indexOf(tagInputValue) === -1) {
                Tags = [...tags, tagInputValue];
            }
            setTags(Tags);
            setTagInputVisible(false);
            setTagInputValue('');
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    }

    const handleTagInputConfirm = async () => {
        const exist = await existTag(tagInputValue);
        if (!exist) {
            setCreateTag(true);
            return;
        }
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

    const handleSubmit = async () => {
        try {
            await CreateAds(parseAmount(budget.toString()), tags, metadata as string, rewardRate.toString(), (lifetime as number), JSON.parse(currentAccount));
            setCreateModal(false);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    };

    return (
        <>
            <div className={styles.modalBody}>
                {errorState.Message && <Message content={errorState.Message} />}
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
                    </div>
                    <div className={styles.value}>
                        {tags.map((tag, index) => {
                            if (tagEditInputIndex === index) {
                                return (
                                    <Input
                                        key={tag}
                                        size="large"
                                        className="tag-input"
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
                                    color="volcano"
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
                                type="text"
                                size="large"
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
                                color="volcano"
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
                        <Input
                            size='large'
                            onChange={(e) => setMetadata(e.target.value)}
                            placeholder='ipfs://<CID>/<path>'
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
                        <br />
                        <small>
                            {intl.formatMessage({
                                id: 'dashboard.ads.create.lifetime.desc',
                            })}
                        </small>
                    </div>
                    <div className={styles.value}>
                        <InputNumber
                            className={styles.withAfterInput}
                            placeholder="0"
                            size='large'
                            type='number'
                            maxLength={18}
                            value={lifetime}
                            min={0}
                            onChange={(e) => setLifetime(e)}
                        />
                        <div className={style.buttons}>
                            <Button
                                type='primary'
                                shape='round'
                                size='large'
                                onClick={() => {
                                    setLifetime(3 * 24 * 60 * 60 / 6)
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'dashboard.ads.create.lifetime.3days',
                                })}
                            </Button>
                            <Button
                                type='primary'
                                shape='round'
                                size='large'
                                onClick={() => {
                                    setLifetime(7 * 24 * 60 * 60 / 6)
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'dashboard.ads.create.lifetime.7days',
                                })}
                            </Button>
                            <Button
                                type='primary'
                                shape='round'
                                size='large'
                                onClick={() => {
                                    setLifetime(15 * 24 * 60 * 60 / 6)
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'dashboard.ads.create.lifetime.15days',
                                })}
                            </Button>
                        </div>
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
                        disabled={!budget || !tags || !metadata || !lifetime}
                        onClick={() => { handleSubmit() }}
                    >
                        {intl.formatMessage({
                            id: 'common.submit',
                        })}
                    </Button>
                </div>
            </div>
            <BigModal
                visable={createTag}
                title={tagInputValue}
                content={intl.formatMessage({
                    id: 'dashboard.ads.create.tag.create',
                })}
                footer={
                    <>
                        <Button
                            block
                            shape='round'
                            type='primary'
                            size='large'
                            onClick={() => {
                                newTag(tagInputValue);
                                setCreateTag(false);
                            }}
                        >
                            {intl.formatMessage({
                                id: 'common.submit',
                            })}
                        </Button>
                    </>
                }
                close={() => { setCreateTag(false) }}
            />
        </>
    )
}

export default Create;
