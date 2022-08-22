import React from 'react';
import { Button, Card } from 'antd';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import Balance from './Balance';
import Record from './Record';
import Tags from './Tags';
import ExportMnemonicAlert from '@/components/ExportMnemonicAlert/ExportMnemonicAlert';

// Copied from the web-push documentation
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
const publicVapidKey = 'BPi-wkw9X92otk570yka-F-7TvUBqlXnnu4V0GHyBaqS4cJb0OHvruJy_-pEXWvW65sQ2xR2M2BVWshnxFg9etY';

const Wallet: React.FC = () => {
  const intl = useIntl();
  const { wallet } = useModel('currentUser');

  const handleSub = async () => {
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.ready;
  
    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await fetch(`http://localhost:8080/subscribe?account=${wallet.account}`, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'content-type': 'application/json',
      },
    });

    console.log('Subscribe!', subscription);
  }

  return (<>
    <ExportMnemonicAlert />
    <Button onClick={handleSub}>Subscribe</Button>
    <div className={styles.mainTopContainer}>
      <div className={style.indexContainer}>
        <div className={style.left}>
          <Card
            className={styles.card}
            bodyStyle={{
              padding: 0,
              width: '100%',
            }}
          >
            <div className={styles.tabSelector}>
              <div
                className={styles.tabItem}
              >
                {intl.formatMessage({
                  id: 'wallet.dashboard.balance',
                })}
              </div>
            </div>
            <Balance />
          </Card>
        </div>
        <div className={style.right}>
          <Tags />
          <Record />
        </div>
      </div>
    </div>
  </>
  );
};

export default Wallet;
