import React, { useEffect, useState } from 'react';
import styles from '@/pages/wallet.less';
import NotSupport from '../NotSupport';
import QuickSign from './components/QuickSign';
import VerifyIdentity from './components/VerifyIdentity';
import { CreateAccount, CreateMnemonic } from '@/services/parami/Identity';
import { useAccess, history, useModel, useParams } from 'umi';
import config from '@/config/config';
import isiOSSafari from '@/utils/isSafaiApp';
import InApp from 'detect-inapp';
import { guid } from '@/utils/common';
import { CreateKeystore } from '@/services/parami/Identity';
import { notification } from 'antd';

const inapp = new InApp(navigator.userAgent || navigator.vendor || (window as any).opera);

const Create: React.FC = () => {
  const apiWs = useModel('apiWs');
  const { initialState } = useModel('@@initialState');
  const [step, setStep] = useState<number>(1);
  const [quickSign, setQuickSign] = useState<{ platform: string, ticket: any }>();

  // Account Info
  const [passphrase, setPassphrase] = useState<string>('');
  const [keystore, setKeystore] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [did, setDID] = useState<string>('');

  const access = useAccess();
  const walletInfo = initialState?.currentInfo?.wallet;

  const params: {
    type: string;
  } = useParams();

  useEffect(() => {
    if (params?.type) {
      localStorage.setItem('parami:wallet:type', params?.type);
    }
  }, [params]);

  // Create Account
  const createAccount = async () => {
    try {
      const { mnemonic: newMnemonic } = await CreateMnemonic();

      const { address } = await CreateAccount(newMnemonic);
      setAccount(address);

      localStorage.setItem('parami:wallet:account', address);

      const passphrase = guid().substring(0, 6);
      setPassphrase(passphrase);
      localStorage.setItem('parami:wallet:passphrase', passphrase);

      const { keystore } = await CreateKeystore(
        newMnemonic,
        passphrase,
      );
      setKeystore(keystore);
      localStorage.setItem('parami:wallet:keystore', keystore);
    } catch (e: any) {
      notification.error({
        message: 'Create Account Failed',
        description: e.message || e,
        duration: null,
      });
      return;
    }
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
        {step === 1 &&
          <QuickSign
            setStep={setStep}
            setQuickSign={setQuickSign}
          />
        }
        {step === 3 &&
          <VerifyIdentity
            quickSign={quickSign}
            passphrase={passphrase}
            account={account}
            keystore={keystore}
            did={did}
            setDID={setDID}
          />
        }
      </div>
    </div>
  );
};

export default Create;
