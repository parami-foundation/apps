import { Card, Typography } from 'antd';
import React, { useEffect } from 'react';
import styles from '../style.less';
import style from './Tags.less';
import { useIntl, useModel, history } from 'umi';
import config from '@/config/config';
import { SVG3DTagCloud } from '@/utils/svg3dTagCloud';

const { Title } = Typography;

const Tags: React.FC = () => {
    const { tagsArr, guideTagsArr } = useModel('tags');

    const intl = useIntl();

    const entries = [
        { label: 'Dev Blog', url: 'http://niklasknaack.blogspot.de/', target: '_top', tooltip: 'Lorem ipsum' },
        { label: 'Flashforum', url: 'http://www.flashforum.de/', target: '_top', tooltip: 'Dolor sit amet' },
        { label: 'jQueryScript.net', url: 'http://www.jqueryscript.net/', target: '_top', tooltip: 'Consetetur sadipscing' },
        { label: 'Javascript-Forum', url: 'http://forum.jswelt.de/', target: '_top', tooltip: 'Sed diam' },
        { label: 'JSFiddle', url: 'https://jsfiddle.net/user/NiklasKnaack/fiddles/', target: '_top' },
        { label: 'CodePen', url: 'http://codepen.io/', target: '_top', tooltip: 'At vero' },
        { label: 'three.js', url: 'http://threejs.org/', target: '_top', tooltip: 'Nonumy eirmod' },
        { label: 'WebGLStudio.js', url: 'http://webglstudio.org/', target: '_top', tooltip: 'Stet clita' },
        { label: 'JS Compress', url: 'http://jscompress.com/', target: '_top', tooltip: 'Justo duo' }
    ];

    const settings = {
        entries: entries,
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
        fontFamily: 'Oswald, Arial, sans-serif',
        fontSize: '15',
        fontColor: '#000',
        fontWeight: 'normal',//bold
        fontStyle: 'normal',//italic 
        fontStretch: 'normal',//wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
        fontToUpperCase: true,
        tooltipFontFamily: 'Oswald, Arial, sans-serif',
        tooltipFontSize: '11',
        tooltipFontColor: '#000',
        tooltipFontWeight: 'normal',//bold
        tooltipFontStyle: 'normal',//italic 
        tooltipFontStretch: 'normal',//wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
        tooltipFontToUpperCase: false,
        tooltipTextAnchor: 'middle',
        tooltipDiffX: 0,
        tooltipDiffY: 20
    };

    useEffect(() => {
        if (tagsArr && guideTagsArr) {
            try {
                SVG3DTagCloud(document.getElementById('tagcloud'), settings);
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
                <div id='tagcloud'><svg /></div>
            </Card>
        </>
    )
};

export default Tags;
