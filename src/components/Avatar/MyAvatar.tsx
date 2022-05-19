import React from 'react';
import { Image } from 'antd';
import { useModel } from 'umi';
import styles from './style.less';
import { CameraOutlined } from '@ant-design/icons';

const MyAvatar: React.FC<{
  width?: number;
  height?: number;
}> = ({ width, height }) => {
  const { avatar } = useModel('user');

  return (
    <div className={styles.avatarContainer}>
      {!avatar && (
        <div
          className={styles.uploadMask}
        >
          <CameraOutlined className={styles.icon} />
        </div>
      )}
      <Image
        src={avatar || '/images/logo-square-core.svg'}
        className={styles.avatar}
        preview={false}
        fallback='/images/logo-square-core.svg'
        width={width || 200}
        height={height || 200}
      />
    </div>
  )
}

export default MyAvatar;
