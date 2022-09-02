import React from 'react';
import style from './ParamiScoreTag.less'

export interface ParamiScoreTagProps {
    tag: string
}

function ParamiScoreTag({tag }: ParamiScoreTagProps) {
    return <span className={style.tag}>{tag}</span>;
};

export default ParamiScoreTag;
