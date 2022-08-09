import React, { useState } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Divider, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import Did from '../Did/did';
import { UserLogout } from '@/utils/user.util';

const { Title } = Typography;

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const { wallet } = useModel('currentUser');
  const { nickname, avatar } = useModel('user');

  const intl = useIntl();

  const menuHeaderDropdown = (
    <div className={styles.menuContainer}>
      <Title
        level={5}
      >
        {intl.formatMessage({
          id: 'common.account',
        })}
      </Title>
      <div className={styles.account}>
        <span className={styles.nickname}>
          {nickname.toString() || 'Nickname'}
        </span>
        <Did did={wallet.did!} />
      </div>
      <Divider />
      <div
        className={styles.logout}
        onClick={() => { UserLogout() }}
      >
        <LogoutOutlined
          style={{
            marginRight: 20,
          }}
        />
        {intl.formatMessage({
          id: 'common.logout',
        })}
      </div>
    </div>
  );

  return (
    <HeaderDropdown
      overlay={menuHeaderDropdown}
      visible={menuVisible}
      onVisibleChange={() => { setMenuVisible(!menuVisible) }}
    >
      <span
        className={`${styles.action} ${styles.account}`}
        onClick={() => { setMenuVisible(!menuVisible) }}
      >
        <Avatar
          size="small"
          className={styles.avatar}
          src={avatar || '/images/logo-square-core.svg'}
          alt="avatar"
        />
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
