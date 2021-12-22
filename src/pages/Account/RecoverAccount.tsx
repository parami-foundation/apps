import React, { useEffect, useState } from 'react';
import { useParams, useAccess, history } from 'umi';
import styles from '@/pages/wallet.less';
import InputLink from './RecoverAccount/InputLink';
import WithLink from './RecoverAccount/WithLink';
import RecoverDeposit from './RecoverAccount/RecoverDeposit';
import BypassPasswd from './RecoverAccount/BypassPasswd';
import config from '@/config/config';

const RecoverAccount: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [password, setPassword] = useState('');

  const params: {
    mnemonic: string;
  } = useParams();

  // Controller Account
  const [oldController, setOldController] = useState<string>('');
  const [controllerUserAddress, setControllerUserAddress] = useState<string>('');
  const [controllerKeystore, setControllerKeystore] = useState<string>('');

  // Magic Account
  const [magicUserAddress, setMagicUserAddress] = useState<string>('');
  const [magicMnemonic, setMagicMnemonic] = useState('');
  const [magicKeystore, setMagicKeystore] = useState<string>('');

  // Exist Data
  const ExistPassword = localStorage.getItem('stamp') as string;
  const ControllerUserAddress = localStorage.getItem('controllerUserAddress') as string;
  const ControllerKeystore = localStorage.getItem('controllerKeystore') as string;
  const MagicUserAddress = localStorage.getItem('magicUserAddress') as string;

  const isRecoverLink = async () => {
    if (params.mnemonic !== undefined) {
      setMagicMnemonic(params.mnemonic.replace(/%20/g, ' '));
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

    if (!!ControllerUserAddress && !!ControllerKeystore && !!MagicUserAddress) {
      setControllerUserAddress(ControllerUserAddress);
      setControllerKeystore(ControllerKeystore);
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
              setControllerKeystore={setControllerKeystore}
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
              setOldController={setOldController}
              setControllerKeystore={setControllerKeystore}
              setMagicUserAddress={setMagicUserAddress}
              setStep={setStep}
            />
          )}
          {step === 3 && (
            <RecoverDeposit
              setStep={setStep}
              magicKeystore={magicKeystore}
              oldController={oldController}
              password={password}
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
