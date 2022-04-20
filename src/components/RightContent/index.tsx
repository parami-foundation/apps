import { message, Space, Upload } from 'antd';
import { ScanOutlined } from '@ant-design/icons';
import React from 'react';
import { useIntl, useModel, SelectLang, history, useAccess } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import loadImg from '@/utils/decode';
import { hexToDid } from '@/utils/common';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const access = useAccess();
  const intl = useIntl();

  if (!initialState) {
    return null;
  }

  const onChange = async (info: any) => {
    if (info.event) {
      loadImg(URL.createObjectURL(info.file.originFileObj))
        .then((result) => {
          if (result === 'error') {
            message.error(
              intl.formatMessage({
                id: 'error.decodeDidFromImg.notFound',
              })
            );
            return;
          }
          history.push(`/${hexToDid(result)}`)
        });
    }
  };

  return (
    <Space className={styles.right}>
      <Upload
        accept="image/*"
        showUploadList={false}
        className={styles.action}
        onChange={onChange}
      >
        <ScanOutlined />
      </Upload>
      {access.canWalletUser && (
        <Avatar />
      )}
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
