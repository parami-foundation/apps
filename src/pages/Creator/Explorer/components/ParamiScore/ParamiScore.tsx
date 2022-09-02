import React from 'react';
import style from './ParamiScore.less';

export interface ParamiScoreProps {
    score: number
}

function ParamiScore({ score }: ParamiScoreProps) {
    return <span className={style.scoreContainer}>
        {score >= 0 && <span className={style.positive}>
            +{score}
        </span>}
        {score < 0 && <span className={style.negative}>
            -{Math.abs(score)}
        </span>}
    </span>;
};

export default ParamiScore;
