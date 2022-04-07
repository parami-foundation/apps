import React, { useRef, useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Button, Input, InputNumber, notification, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CreateAds, CreateTag, ExistTag } from '@/services/parami/dashboard';
import BigModal from '@/components/ParamiModal/BigModal';
import { parseAmount } from '@/utils/common';
import { message } from 'antd';

const currentAccount = localStorage.getItem('dashboardCurrentAccount') as string;

const Create: React.FC<{
    setCreateModal: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setCreateModal }) => {
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
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const tagInputRef = useRef<Input>(null);

    const intl = useIntl();
    const { Search } = Input;

    const existTag = async (tag: string) => {
        try {
            const res = await ExistTag(tag);
            if (!res.toHuman()) {
                return false;
            }
            return true;
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
            return false;
        }
    };

    const newTag = async (tag: string) => {
        setSubmitLoading(true);
        try {
            await CreateTag(tag, JSON.parse(currentAccount));
            let Tags = tags;
            if (tagInputValue && tags.indexOf(tagInputValue) === -1) {
                Tags = [...tags, tagInputValue];
            }
            setTags(Tags);
            setTagInputVisible(false);
            setTagInputValue('');
            setSubmitLoading(false);
        } catch (e: any) {
            notification.error({
                message: intl.formatMessage({ id: e.message || e }),
                duration: null,
            });
            setSubmitLoading(false);
        }
    };

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
        setTagEditInputIndex(0);
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
            notification.error({
                message: e.message || e,
                duration: null,
            });
        }
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
                    </div>
                    <div className={styles.value}>
                        {tags.map((tag, index) => {
                            if (tagEditInputIndex === index) {
                                return (
                                    <Search
                                        key={tag}
                                        size="large"
                                        className="tag-input"
                                        enterButton={intl.formatMessage({
                                            id: 'common.confirm',
                                        })}
                                        loading={submitLoading}
                                        onChange={(e) => {
                                            setTagEditInputValue(e.target.value);
                                        }}
                                        onSearch={() => {
                                            if (!tagEditInputValue) {
                                                message.error('Please Input Tag');
                                                return;
                                            }
                                            handleTagEditInputConfirm();
                                        }}
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
                            <Search
                                ref={tagInputRef}
                                type="text"
                                size="large"
                                enterButton={intl.formatMessage({
                                    id: 'common.confirm',
                                })}
                                className={style.tagInput}
                                loading={submitLoading}
                                onChange={(e) => {
                                    setTagInputValue(e.target.value);
                                }}
                                onSearch={() => {
                                    if (!tagInputValue) {
                                        message.error('Please Input Tag');
                                        return;
                                    }
                                    handleTagInputConfirm();
                                }}
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
