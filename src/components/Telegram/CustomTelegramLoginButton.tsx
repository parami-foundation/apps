import React from 'react';
import styles from './style.less';
import TG_ICON from './images/telegram.svg';
import TelegramLoginButton from 'react-telegram-login';

const CustomTelegramLoginButton: React.FC<{
  dataOnauth: (response: any) => void;
  botName: string;
}> = ({ dataOnauth, botName }) => {
  return (
    <div className={styles.telegramButton}>
      <TelegramLoginButton
        dataOauth={dataOnauth}
        botName={botName}
        className={styles.telegramLoginBtn}
      ></TelegramLoginButton>
      <div className={styles.loginButton}>
        <img
          src={TG_ICON}
          className={styles.loginIcon}
        />
        Create by Telegram
      </div>
    </div>
  )
}

export default CustomTelegramLoginButton;