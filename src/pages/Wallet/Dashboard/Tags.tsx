import { Card, Typography } from 'antd';
import React, { useEffect } from 'react';
import styles from '../style.less';
import style from './Tags.less';
import { useIntl, useModel, history } from 'umi';
import { TagCanvas } from '@/utils/TagCanvas';
import config from '@/config/config';

const { Title } = Typography;

const Tags: React.FC = () => {
    const { tagsArr, guideTagsArr } = useModel('tags');

    const intl = useIntl();

    useEffect(() => {
        if (tagsArr && guideTagsArr) {
            try {
                TagCanvas.Start(
                    'tagcloud',
                    '',
                );
            }
            catch (e) {
                console.log(e)
            }
        }
    }, [tagsArr, guideTagsArr]);

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
                    <ul className={style.tagCloud}>
                        {guideTagsArr.map((tag) => (
                            <li>
                                <a
                                    style={{
                                        color: tag.textColor,
                                        backgroundColor: tag.bgColor,
                                        borderColor: 'transparent',
                                        fontSize: `2rem`,
                                    }}
                                    className='tagItem'
                                    onClick={() => { history.push(`${config.page.socialPage}/?type=${tag.count.type}&from=${tag.count.chain}`) }}
                                >
                                    👉{tag.count.name}
                                </a>
                            </li>
                        ))}
                        {tagsArr.map((tag) => (
                            <li>
                                <a
                                    style={{
                                        color: tag.textColor,
                                        backgroundColor: tag.bgColor,
                                        borderColor: tag.borderColor,
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
            </Card>
        </>
    )
};

export default Tags;
