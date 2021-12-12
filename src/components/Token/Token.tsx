import React from 'react';
import styles from './style.less';
import { BigIntToFloatString } from '@/utils/format';
import { formatWithoutUint } from '@/utils/common';

const Token: React.FC<{
    value: string,
    symbol?: string,
}> = ({ value, symbol }) => {
    return (
        <>
            <div className={styles.did}>
                {formatWithoutUint(value)}
                {/* {BigIntToFloatString(value, 18)} */}
                {symbol && (<span className={styles.unit}>&nbsp;{symbol}</span>)}
            </div>
        </>
    )
}

export default Token;
