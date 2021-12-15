import { Card, Tag, Typography } from 'antd';
import React from 'react';
import styles from '../style.less';
import style from './Tags.less';
import { useIntl, useModel } from 'umi';

const { Title } = Typography;

const Tags: React.FC = () => {
    const { tagsArr } = useModel('tags');

    const intl = useIntl();

    return (
        <>
            <Card
                className={styles.sideCard}
                bodyStyle={{
                    width: '100%',
                }}
                style={{
                    marginBottom: 20,
                }}
            >
                <Title level={4}>
                    {intl.formatMessage({
                        id: 'wallet.tags.title',
                    })}
                </Title>
                <div className={style.tagContainer}>
                    {tagsArr.map((tag) => (
                        <Tag
                            color={tag.color}
                            className={style.tagItem}
                            style={{
                                fontSize: `${1 + tag.value / 100}rem`,
                            }}
                            icon={
                                <span className={style.value}>
                                    {tag.value}
                                </span>
                            }
                        >
                            {tag.count}
                        </Tag>
                    ))}
                </div>
            </Card>
        </>
    )
};

export default Tags;
