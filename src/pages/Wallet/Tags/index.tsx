import { Card, Typography } from 'antd';
import React, { useEffect } from 'react';
import styles from '../style.less';
import { useIntl, useModel } from 'umi';
import { SVG3DTagCloud } from '@/utils/svg3dTagCloud';
import Skeleton from '@/components/Skeleton';

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
    speed: 0.5,
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
    let destroy;
    if (allTagsArr) {
      try {
        destroy = SVG3DTagCloud(document.getElementById('tagcloud'), settings);
      }
      catch (e) {
        console.log(e)
      }
    }
    return () => {
      destroy && destroy();
    }
  }, [allTagsArr, SVG3DTagCloud]);

  function onfocus() {
    const body = document.querySelector("body") as HTMLBodyElement;
    body.style.overflow = "hidden";
  }
  function onblur() {
    const body = document.querySelector("body") as HTMLBodyElement;
    body.style.overflow = "auto";
  }

  return (
    <>
      <Skeleton
        loading={!allTagsArr.length}
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
            <div
              id='tagcloud'
              tabIndex={0}
              onFocus={onfocus}
              onBlur={onblur}
            >
              <svg />
            </div>
          </Card>
        }
      />
    </>
  )
};

export default Tags;
