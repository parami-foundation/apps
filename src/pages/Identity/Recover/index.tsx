import React, { useEffect, useState } from 'react';
import { useAccess, useModel, history } from 'umi';
import styles from '@/pages/wallet.less';
import NotSupport from '../NotSupport';
import InputLink from './components/InputLink';
import SelectMode from './components/SelectMode';
import config from '@/config/config';
import isiOSSafari from '@/utils/isSafaiApp';
import InApp from 'detect-inapp';

const inapp = new InApp(navigator.userAgent || navigator.vendor || (window as any).opera);

const Recover: React.FC = () => {
  const apiWs = useModel('apiWs');
  const [step, setStep] = useState<number>(1);

  // Account Info
  const [passphrase, setPassphrase] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [did, setDID] = useState<string>('');
  const [mnemonic, setMnemonic] = useState<string>('');

  const access = useAccess();

  useEffect(() => {
    // Wait for chain to be ready
    if (!apiWs) {
      return;
    }

    // Check if user is already logged in
    if (access.canWalletUser) {
      localStorage.removeItem('parami:wallet:inProcess');
      history.push(config.page.walletPage);
      return;
    };

    // Tag recover account process
    localStorage.setItem('parami:wallet:inProcess', 'recoverAccount');
  }, [apiWs]);

  useEffect(() => {
    if (inapp.isInApp) {
      setStep(-1);
      return;
    }
    if (inapp.browser === 'safari' && !isiOSSafari) {
      setStep(-1);
      return;
    }
  }, [step]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.background} />
      <div className={styles.logoMark} />
      <div className={styles.pageContainer}>
        {step === -1 &&
          <NotSupport />
        }
        {step === 1 && (
          <InputLink
            setStep={setStep}
            setAccount={setAccount}
            setDID={setDID}
            setMnemonic={setMnemonic}
          />
        )}
        {step === 2 && (
          <SelectMode
            passphrase={passphrase}
            mnemonic={mnemonic}
            account={account}
            did={did}
            setPassphrase={setPassphrase}
          />
        )}
      </div>
    </div>
  );
};

export default Recover;
