import React from 'react';
import style from './style.less';

const Skeleton: React.FC<{
  children: React.ReactNode;
  loading: boolean;
  height?: number | string;
  styles?: React.CSSProperties,
}> = ({ children, loading, height, styles }) => {
  return (
    <div
      className={style.skeletonContainer}
      style={styles}
    >
      {loading ? (
        <div
          className={style.skeleton}
          style={{
            height: height || '10vh',
          }}
        />
      ) : (
        children
      )}
    </div>
  )
}

export default Skeleton;
