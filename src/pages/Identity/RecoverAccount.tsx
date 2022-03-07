import React, { useEffect, useState } from 'react';
import { useAccess, history, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import InputLink from './RecoverAccount/InputLink';
import WithLink from './RecoverAccount/WithLink';
import RecoverDeposit from './RecoverAccount/RecoverDeposit';
import config from '@/config/config';
import NotSupport from './CreateAccount/NotSupport';
import isiOSSafari from '@/utils/isSafaiApp';
import InApp from 'detect-inapp';

const inapp = new InApp(navigator.userAgent || navigator.vendor || (window as any).opera);

const RecoverAccount: React.FC = () => {
  const apiWs = useModel('apiWs');
  const [step, setStep] = useState<number>(1);
  const [password, setPassword] = useState('');

  const { hash } = history.location;
  const mnemonicHash = hash.substring(1);

  // Controller Account
  const [controllerUserAddress, setControllerUserAddress] = useState<string>('');

  // Magic Account
  const [magicUserAddress, setMagicUserAddress] = useState<string>('');
  const [magicMnemonic, setMagicMnemonic] = useState('');
  const [magicKeystore, setMagicKeystore] = useState<string>('');

  // Exist Data
  const ExistPassword = localStorage.getItem('stamp') as string;
  const ControllerUserAddress = localStorage.getItem('controllerUserAddress') as string;
  const MagicUserAddress = localStorage.getItem('magicUserAddress') as string;

  const isRecoverLink = async () => {
    if (!!mnemonicHash) {
      setMagicMnemonic(mnemonicHash.replace(/%20/g, ' '));
      setStep(2);
    }
  };

  const access = useAccess();

  useEffect(() => {
    if (!apiWs) {
      return;
    }
    if (access.canUser) {
      history.push(config.page.walletPage);
      return;
    }

    // Tag recover account process
    localStorage.setItem('process', 'recoverAccount');

    if (!!ExistPassword) {
      setPassword(ExistPassword);
    };

    if (!!ControllerUserAddress && !!MagicUserAddress) {
      setControllerUserAddress(ControllerUserAddress);
      setMagicUserAddress(MagicUserAddress);
      setStep(3);
      return;
    };
    isRecoverLink();
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
    <>
      <div className={styles.mainContainer}>
        <div className={styles.background} />
        <div className={styles.logoMark} />
        <div className={styles.pageContainer}>
          {step === -1 &&
            <NotSupport />
          }
          {step === 1 && (
            <InputLink
              magicMnemonic={magicMnemonic}
              setMagicMnemonic={setMagicMnemonic}
              setMagicUserAddress={setMagicUserAddress}
              setStep={setStep}
            />
          )}
          {step === 2 && (
            <WithLink
              magicMnemonic={magicMnemonic}
              password={password}
              setPassword={setPassword}
              setMagicKeystore={setMagicKeystore}
              setControllerUserAddress={setControllerUserAddress}
              setMagicUserAddress={setMagicUserAddress}
              setStep={setStep}
            />
          )}
          {step === 3 && (
            <RecoverDeposit
              magicKeystore={magicKeystore}
              password={password}
              controllerUserAddress={controllerUserAddress}
              magicUserAddress={magicUserAddress}
              setStep={setStep}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RecoverAccount;
