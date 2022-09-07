import React from 'react';
import styles from './style.less';
import { formatWithoutUint } from '@/utils/common';

const Token: React.FC<{
  value: string,
  symbol?: string,
  decimals?: number
}> = ({ value, symbol, decimals = 18 }) => {
  return (
    <div className={styles.ad3}>
      {value ? formatWithoutUint(value.replaceAll(',', ''), decimals) : '--'}
      {/* {BigIntToFloatString(value, 18)} */}
      {symbol && (<span className={styles.unit}>&nbsp;${symbol}</span>)}
    </div>
  )
}

export default Token;
