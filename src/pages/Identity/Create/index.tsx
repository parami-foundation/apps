import React, { useEffect, useState } from 'react';
import styles from '@/pages/wallet.less';
import NotSupport from '../NotSupport';
import BeforeStart from './components/BeforeStart';
import QuickSign from './components/QuickSign';
import Mnemonic from './components/Mnemonic';
import VerifyIdentity from './components/VerifyIdentity';
import { CreateAccount, CreateMnemonic } from '@/services/parami/Identity';
import { useAccess, history, useModel } from 'umi';
import config from '@/config/config';
import isiOSSafari from '@/utils/isSafaiApp';
import InApp from 'detect-inapp';

const inapp = new InApp(navigator.userAgent || navigator.vendor || (window as any).opera);

const Create: React.FC = () => {
  const apiWs = useModel('apiWs');
  const { initialState } = useModel('@@initialState');
  const [step, setStep] = useState<number>(1);
  const [qsTicket, setQsTicket] = useState<any>();
  const [qsPlatform, setQsPlatform] = useState<string>();

  // Account Info
  const [passphrase, setPassphrase] = useState<string>('');
  const [keystore, setKeystore] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [did, setDID] = useState<string>('');
  const [mnemonic, setMnemonic] = useState<string>('');

  const access = useAccess();
  const walletInfo = initialState?.currentInfo?.wallet;

  // Create Account
  const createAccount = async () => {
    const { mnemonic: newMnemonic } = await CreateMnemonic();
    setMnemonic(newMnemonic);

    const { address } = await CreateAccount(newMnemonic);
    setAccount(address);

    localStorage.setItem('parami:wallet:account', address);
  };

  useEffect(() => {
    // Wait for chain to be ready
    if (!apiWs) {
      return;
    };

    // Check if user is already logged in
    if (access.canWalletUser) {
      localStorage.removeItem('parami:wallet:inProcess');
      history.push(config.page.walletPage);
      return;
    };

    // Tag create account process
    localStorage.setItem('parami:wallet:inProcess', 'createAccount');

    // Check if user has already created a account
    if (!!walletInfo?.account && !!walletInfo?.keystore && !!walletInfo?.passphrase) {
      setAccount(walletInfo.account);
      setKeystore(walletInfo.keystore);
      setPassphrase(walletInfo.passphrase);
      setStep(3);
      return;
    };

    // Create a new account
    createAccount();
  }, [apiWs]);

  // Check support browser
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
          <NotSupport
          />
        }
        {step === 0 &&
          <BeforeStart
            setStep={setStep}
          />
        }
        {step === 1 &&
          <QuickSign
            setStep={setStep}
            setQsTicket={setQsTicket}
            setQsPlatform={setQsPlatform}
          />
        }
        {step === 2 &&
          <Mnemonic
            mnemonic={mnemonic}
            passphrase={passphrase}
            setStep={setStep}
            setPassphrase={setPassphrase}
            setKeystore={setKeystore}
          />
        }
        {step === 3 &&
          <VerifyIdentity
            qsTicket={qsTicket}
            qsPlatform={qsPlatform}
            passphrase={passphrase}
            account={account}
            keystore={keystore}
            did={did}
            setQsTicket={setQsTicket}
            setQsPlatform={setQsPlatform}
            setDID={setDID}
          />
        }
      </div>
    </div>
  );
};

export default Create;
