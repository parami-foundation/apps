import React, { useEffect, useState } from 'react';
import { EditOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, Input, message, Spin, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import config from '@/config/config';
import { setNickName } from '@/services/parami/wallet';
import BigModal from '../ParamiModal/BigModal';
import SecurityModal from '../ParamiModal/SecurityModal';
import Did from '../Did/did';
import ExportController from './ExportController/ExportController';

const { Title } = Typography;

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const keystore = localStorage.getItem('controllerKeystore') as string;

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const [nicknameModal, setNicknameModal] = useState<boolean>(false);
  const [secModal, setSecModal] = useState(false);
  const [password, setPassword] = useState('');
  const [spinning, setSpinning] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const { nickname, avatar, setNickname } = useModel('user');

  const intl = useIntl();

  const did = localStorage.getItem('did') as string;

  const loginOut = async () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = config.page.homePage;
  };

  const updateNickname = async () => {
    setSpinning(true);
    try {
      await setNickName(nickname, password, keystore);
      setNicknameModal(false);
      setSpinning(false);
    } catch (e: any) {
      message.error(e.message);
      setSpinning(false);
    }
  };

  useEffect(() => {
    if (password !== '' && nickname != '') {
      updateNickname();
    }
  }, [password, nickname]);

  const menuHeaderDropdown = (
    <>
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
            {nickname}
            <EditOutlined
              style={{
                marginLeft: 10,
              }}
              onClick={() => {
                setNicknameModal(true);
                setMenuVisible(false);
              }}
            />
          </span>
          <Did did={did} />
        </div>
        <div className={styles.buttons}>
          <ExportController />
        </div>
        <Divider />
        <div
          className={styles.logout}
          onClick={() => { loginOut() }}
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
      <Spin
        tip={intl.formatMessage({
          id: 'common.uploading',
        })}
        spinning={spinning}
      >
        <BigModal
          visable={nicknameModal}
          title={intl.formatMessage({
            id: 'wallet.nickname.edit',
          })}
          content={
            <>
              <Input
                size="large"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value)
                }}
              />
              <Button
                block
                type='primary'
                size='large'
                shape='round'
                className={styles.button}
                style={{
                  marginTop: 20,
                }}
                onClick={() => { setSecModal(true) }}
              >
                {intl.formatMessage({
                  id: 'common.submit',
                })}
              </Button>
            </>
          }
          footer={
            <>
              <Button
                block
                shape='round'
                size='large'
                className={styles.button}
                onClick={() => { setNicknameModal(false) }}
              >
                {intl.formatMessage({
                  id: 'common.close',
                })}
              </Button>
            </>
          }
        />
        <SecurityModal
          visable={secModal}
          setVisable={setSecModal}
          password={password}
          setPassword={setPassword}
        />
      </Spin>
    </>
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
