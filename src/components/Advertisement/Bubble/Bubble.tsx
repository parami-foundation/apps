import React, { ReactNode } from 'react';
import style from './Bubble.less';

export interface BubbleProps {
    children: ReactNode
}

function Bubble({ children }: BubbleProps) {
    return <>
        <div className={style.bubble}>
            <div className={`${style.bubbleArrow} ${style.front}`}></div>
            <div className={`${style.bubbleArrow} ${style.back}`}></div>
            <div className={style.content}>
                {children}
            </div>
        </div>
    </>;
};

export default Bubble;
