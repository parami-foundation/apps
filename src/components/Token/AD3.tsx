import React from 'react';
import styles from './style.less';
import { formatWithoutUint } from '@/utils/common';

const AD3: React.FC<{
  value: string;
  style?: React.CSSProperties;
}> = ({ value, style }) => {
  return (
    <div
      className={styles.ad3}
      style={style}
    >
      {value ? formatWithoutUint(value) : '--'}
      {/* {BigIntToFloatString(value, 18, 8)} */}
      <span className={styles.unit}>&nbsp;$AD3</span>
    </div>
  )
}

export default AD3;
