import React, { useEffect, useState } from 'react';
import style from './TagList.less';
import styles from '../style.less';
import Skeleton from '@/components/Skeleton';
import { useIntl, useModel } from 'umi';
import { Card, Progress, Typography } from 'antd';

const { Title } = Typography;

export interface TagListProps { }

function TagList({ }: TagListProps) {
    const { allTagsArr } = useModel('tags');
    const intl = useIntl();
    const [tags, setTags] = useState<{ label: string; value: number }[]>([]);

    useEffect(() => {
        if (allTagsArr?.length) {
            const tags = allTagsArr.map(tag => {
                return {
                    value: tag.value,
                    label: tag.data.label,
                }
            })
            tags.sort((t1, t2) => t2.value - t1.value);
            setTags(tags);
        }
    }, [allTagsArr])

    return <>
        <Skeleton
            loading={!tags.length}
            height={400}
            styles={{
                marginBottom: '2rem',
            }}
            children={
                <Card
                    className={styles.sideCard}
                    bodyStyle={{
                        width: '100%',
                    }}
                >
                    <Title level={4}>
                        {intl.formatMessage({
                            id: 'wallet.tags.title',
                        })}
                    </Title>
                    <div className={style.tagListContainer}>
                        {tags.map(tag => {
                            return <>
                                <div className={style.tag}>
                                    <div className={style.tagLabel}>{tag.label}</div>
                                    <div className={style.scoreBar}>
                                        <Progress percent={tag.value} strokeColor="#ff5b00" showInfo={false} />
                                    </div>
                                    <div className={style.score}>
                                        {tag.value}
                                    </div>
                                </div>
                            </>
                        })}
                    </div>
                </Card>
            }
        /></>;
};

export default TagList;
