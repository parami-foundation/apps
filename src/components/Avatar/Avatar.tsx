import React from 'react';
import { Image } from 'antd';
import styles from './style.less';

const Avatar: React.FC<{
  avatar: string;
  width?: number;
  height?: number;
  preview?: boolean;
}> = ({ avatar, width, height, preview }) => {
  return (
    <Image
      src={avatar || '/images/logo-square-core.svg'}
      className={styles.avatar}
      preview={preview}
      fallback='/images/logo-square-core.svg'
      width={width || 200}
      height={height || 200}
    />
  )
}

export default Avatar;
