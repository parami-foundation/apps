import React, { useEffect, useState } from 'react';
import styles from '@/pages/wallet.less';
import QuickSign from './CreateAccount/QuickSign';
import RecoveryLink from './CreateAccount/RecoveryLink';
import VerifyIdentity from './CreateAccount/VerifyIdentity';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { CreateAccountAddress } from '@/services/parami/Identity';
import { useAccess, history, useModel } from 'umi';
import config from '@/config/config';
import BeforeStart from './CreateAccount/BeforeStart';
import NotSupport from './CreateAccount/NotSupport';
import isiOSSafari from '@/utils/isSafaiApp';
import InApp from 'detect-inapp';

const inapp = new InApp(navigator.userAgent || navigator.vendor || (window as any).opera);

const CreateAccount: React.FC = () => {
  const apiWs = useModel('apiWs');
  const [step, setStep] = useState<number>(1);
  const [password, setPassword] = useState<string>('');
  const [qsTicket, setQsTicket] = useState<any>();
  const [qsPlatform, setQsPlatform] = useState<string>();

  // Controller Account
  const [controllerUserAddress, setControllerUserAddress] = useState<string>('');
  const [controllerKeystore, setControllerKeystore] = useState<string>('');
  const [controllerMnemonic, setControllerMnemonic] = useState<string>('');

  // Magic Account
  const [magicMnemonic, setMagicMnemonic] = useState('');
  const [magicUserAddress, setMagicUserAddress] = useState<string>('');

  // Exist Data
  const ExistPassword = localStorage.getItem('stamp') as string;
  const ControllerUserAddress = localStorage.getItem('controllerUserAddress') as string;
  const ControllerKeystore = localStorage.getItem('controllerKeystore') as string;
  const MagicUserAddress = localStorage.getItem('magicUserAddress') as string;
  const Did = localStorage.getItem('did') as string;

  const access = useAccess();

  // Magic Account
  const createMagicAccount = async () => {
    const newMnemonic = await mnemonicGenerate(12);
    setMagicMnemonic(newMnemonic);
    const { address } = await CreateAccountAddress(newMnemonic);

    setMagicUserAddress(address);

    localStorage.setItem('magicUserAddress', address);
  };

  useEffect(() => {
    // Wait for chain to be ready
    if (!apiWs) {
      return;
    };

    // Check if user is already logged in
    if (access.canUser) {
      history.push(config.page.walletPage);
      return;
    };

    // Tag create account process
    localStorage.setItem('process', 'createAccount');

    // Check if user has already created a magic account
    if ((MagicUserAddress === null || magicMnemonic === '') && ControllerUserAddress === null) {
      createMagicAccount();
    };

    // Check if user has already created a password
    if (!!ExistPassword) {
      setPassword(ExistPassword);
    };

    // Check if user has already created a controller account
    if (!!ControllerUserAddress && !!ControllerKeystore && !!MagicUserAddress) {
      setControllerUserAddress(ControllerUserAddress);
      setControllerKeystore(ControllerKeystore);
      setMagicUserAddress(MagicUserAddress);
      setStep(3);
      return;
    };

    // In minimal mode
    if (!!ControllerUserAddress && !!ControllerKeystore && !Did) {
      localStorage.clear();
      setStep(1);
      return;
    };
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
            controllerUserAddress={ControllerUserAddress}
            controllerKeystore={ControllerKeystore}
            magicUserAddress={MagicUserAddress}
            setStep={setStep}
            setQsTicket={setQsTicket}
            setQsPlatform={setQsPlatform}
          />
        }
        {step === 2 &&
          <RecoveryLink
            magicMnemonic={magicMnemonic}
            controllerMnemonic={controllerMnemonic}
            setStep={setStep}
            setPassword={setPassword}
            setControllerMnemonic={setControllerMnemonic}
            setControllerKeystore={setControllerKeystore}
            setControllerUserAddress={setControllerUserAddress}
          />
        }
        {step === 3 &&
          <VerifyIdentity
            password={password}
            magicUserAddress={magicUserAddress}
            controllerUserAddress={controllerUserAddress}
            controllerKeystore={controllerKeystore}
            qsTicket={qsTicket}
            qsPlatform={qsPlatform}
            setQsTicket={setQsTicket}
            setQsPlatform={setQsPlatform}
          />
        }
      </div>
    </div>
  );
};

export default CreateAccount;
