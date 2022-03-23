import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from '@/pages/wallet.less';
import InputLink from './RecoverAccount/InputLink';
import SelectMode from './RecoverAccount/SelectMode';
import RecoverDeposit from './RecoverAccount/RecoverDeposit';
import NotSupport from './CreateAccount/NotSupport';
import isiOSSafari from '@/utils/isSafaiApp';
import InApp from 'detect-inapp';

const inapp = new InApp(navigator.userAgent || navigator.vendor || (window as any).opera);

const RecoverAccount: React.FC = () => {
  const apiWs = useModel('apiWs');
  const [step, setStep] = useState<number>(1);
  const [password, setPassword] = useState('');


  // Controller Account
  const [controllerUserAddress, setControllerUserAddress] = useState<string>('');
  const [controllerMnemonic, setControllerMnemonic] = useState<string>('');

  // Old Controller Account
  const [oldControllerUserAddress, setOldControllerUserAddress] = useState<string>('');
  const [oldControllerMnemonic, setOldControllerMnemonic] = useState<string>('');

  // Magic Account
  const [magicUserAddress, setMagicUserAddress] = useState<string>('');
  const [magicMnemonic, setMagicMnemonic] = useState<string>('');
  const [magicKeystore, setMagicKeystore] = useState<string>('');

  // Did
  const [did, setDid] = useState<string>('');

  // Exist Data
  const ExistPassword = localStorage.getItem('stamp') as string;
  const ControllerUserAddress = localStorage.getItem('controllerUserAddress') as string;
  const ControllerKeystore = localStorage.getItem('controllerKeystore') as string;
  const MagicUserAddress = localStorage.getItem('magicUserAddress') as string;
  const MagicKeystore = localStorage.getItem('magicUserAddress') as string;

  useEffect(() => {
    if (!apiWs) {
      return;
    }

    // Tag recover account process
    localStorage.setItem('process', 'recoverAccount');

    if (!!ExistPassword) {
      setPassword(ExistPassword);
    };

    if (!!ControllerUserAddress && !!MagicUserAddress && !!ControllerKeystore && !!MagicKeystore) {
      setControllerUserAddress(ControllerUserAddress);
      setMagicUserAddress(MagicUserAddress);
      setMagicKeystore(MagicKeystore);
      setStep(3);
      return;
    };
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
            oldControllerMnemonic={oldControllerMnemonic}
            magicMnemonic={magicMnemonic}
            setStep={setStep}
            setOldControllerUserAddress={setOldControllerUserAddress}
            setOldControllerMnemonic={setOldControllerMnemonic}
            setMagicMnemonic={setMagicMnemonic}
            setMagicUserAddress={setMagicUserAddress}
            setDid={setDid}
          />
        )}
        {step === 2 && (
          <SelectMode
            password={password}
            did={did}
            oldControllerUserAddress={oldControllerUserAddress}
            oldControllerMnemonic={oldControllerMnemonic}
            magicMnemonic={magicMnemonic}
            controllerMnemonic={controllerMnemonic}
            setStep={setStep}
            setPassword={setPassword}
            setMagicKeystore={setMagicKeystore}
            setControllerUserAddress={setControllerUserAddress}
            setControllerMnemonic={setControllerMnemonic}
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
  );
};

export default RecoverAccount;
