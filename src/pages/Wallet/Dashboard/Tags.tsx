import { Card, Typography } from 'antd';
import React, { useEffect } from 'react';
import styles from '../style.less';
import { useIntl, useModel } from 'umi';
import { SVG3DTagCloud } from '@/utils/svg3dTagCloud';

const { Title } = Typography;

const Tags: React.FC = () => {
    const { allTagsArr } = useModel('tags');

    const intl = useIntl();

    const settings = {
        entries: allTagsArr,
        width: '100%',
        height: '100%',
        radius: '65%',
        radiusMin: 75,
        bgDraw: true,
        bgColor: 'transparent',
        opacityOver: 1.00,
        opacityOut: 0.05,
        opacitySpeed: 6,
        fov: 800,
        speed: 1,
        fontFamly: 'Oswald, Arial, sans-serif',
        fontSize: '15',
        fontColor: '#d4380d',
        fontWeight: 'bold', //bold
        fontStyle: 'normal', //italic 
        fontStretch: 'normal', //wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
        fontToUpperCase: true,
        tooltipFontFamily: 'Oswald, Arial, sans-serif',
        tooltipFontSize: '11',
        tooltipFontColor: '#d4380d',
        tooltipFontWeight: 'normal', //bold
        tooltipFontStyle: 'normal', //italic 
        tooltipFontStretch: 'normal', //wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
        tooltipFontToUpperCase: false,
        tooltipTextAnchor: 'middle',
        tooltipDiffX: 0,
        tooltipDiffY: 20
    };

    useEffect(() => {
        console.log(allTagsArr)
        if (allTagsArr) {
            try {
                SVG3DTagCloud(document.getElementById('tagcloud'), settings);
            }
            catch (e) {
                console.log(e)
            }
        }
    }, [allTagsArr]);

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
                <div id='tagcloud'><svg /></div>
            </Card>
        </>
    )
};

export default Tags;
