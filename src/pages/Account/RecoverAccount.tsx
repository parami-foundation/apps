import React, { useEffect, useState } from 'react';
import { useAccess, history } from 'umi';
import styles from '@/pages/wallet.less';
import InputLink from './RecoverAccount/InputLink';
import WithLink from './RecoverAccount/WithLink';
import RecoverDeposit from './RecoverAccount/RecoverDeposit';
import BypassPasswd from './RecoverAccount/BypassPasswd';
import config from '@/config/config';

const RecoverAccount: React.FC = () => {
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
    if (mnemonicHash !== undefined || mnemonicHash !== '') {
      setMagicMnemonic(mnemonicHash.replace(/%20/g, ' '));
      setStep(2);
    }
  };

  const access = useAccess();

  useEffect(() => {
    if (access.canUser) {
      history.push(config.page.walletPage);
      return;
    }

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
  }, []);

  return (
    <>
      <div className={styles.mainBgContainer}>
        <div className={styles.pageContainer}>
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
          {step === 4 && (
            <BypassPasswd
              mnemonic={magicMnemonic}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RecoverAccount;
