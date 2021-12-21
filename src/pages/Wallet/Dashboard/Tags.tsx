import { Card, Tag, Typography } from 'antd';
import React, { useEffect } from 'react';
import styles from '../style.less';
import style from './Tags.less';
import { useIntl, useModel } from 'umi';
import { TagCanvas } from '@/utils/TagCanvas';

const { Title } = Typography;

const Tags: React.FC = () => {
    const { tagsArr } = useModel('tags');

    const intl = useIntl();

    useEffect(() => {
        try {
            TagCanvas.Start(
                'tagcloud',
                '',
            );
        }
        catch (e) {
            console.log(e)
        }
    });

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
                <canvas height="300" id="tagcloud">
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
                    <ul className={style.tagCloud}>
                        {tagsArr.map((tag) => (
                            <li>
                                <a
                                    style={{
                                        color: tag.color,
                                        backgroundColor: '#fff2f0',
                                        borderColor: '#ffccc7',
                                        fontSize: `${1 + tag.value / 100}rem`,
                                    }}
                                >
                                    <small>{tag.value}</small>
                                    {tag.count}
                                </a>
                            </li>
                        ))}
                    </ul>
                </canvas>
                {/* <div className={style.tagContainer}>
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
                </div> */}
            </Card>
        </>
    )
};

export default Tags;
