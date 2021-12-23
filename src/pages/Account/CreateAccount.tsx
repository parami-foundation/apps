import React, { useEffect, useState } from 'react';
import styles from '@/pages/wallet.less';
import QuickSign from './CreateAccount/QuickSign';
import SetPassword from './CreateAccount/SetPassword';
import ConfirmPassword from './CreateAccount/ConfirmPassword';
import MagicLink from './CreateAccount/MagicLink';
import InitialDeposit from './CreateAccount/initialDeposit';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { CreateAccount as createAccount } from '@/services/parami/wallet';
import { useAccess, history } from 'umi';
import config from '@/config/config';

const CreateAccount: React.FC<{
  minimal?: boolean;
}> = ({ minimal }) => {
  const [step, setStep] = useState<number>(1);
  const [password, setPassword] = useState<string>('');
  const [qsTicket, setQsTicket] = useState<any>();
  const [magicLink, setMagicLink] = useState<string>('');

  // Controller Account
  const [controllerUserAddress, setControllerUserAddress] = useState<string>('');
  const [controllerKeystore, setControllerKeystore] = useState<string>('');

  // Magic Account
  const [magicMnemonic, setMagicMnemonic] = useState('');
  const [magicUserAddress, setMagicUserAddress] = useState<string>('');

  // Exist Data
  const ExistPassword = localStorage.getItem('stamp') as string;
  const ControllerUserAddress = localStorage.getItem('controllerUserAddress') as string;
  const ControllerKeystore = localStorage.getItem('controllerKeystore') as string;
  const MagicUserAddress = localStorage.getItem('magicUserAddress') as string;
  const Did = localStorage.getItem('did') as string;

  const createMagicAccount = async () => {
    const newMnemonic = await mnemonicGenerate(12);
    setMagicMnemonic(newMnemonic);
    const createMagicData = await createAccount(newMnemonic);
    setMagicUserAddress(createMagicData?.userAddress as string);

    localStorage.setItem('magicUserAddress', createMagicData?.userAddress as string);
  };
  // Magic Account

  const access = useAccess();

  useEffect(() => {
    if (access.canUser) {
      history.push(config.page.walletPage);
      return;
    }
    if (MagicUserAddress === null || magicMnemonic === '') {
      createMagicAccount();
    };

    if (!!ExistPassword) {
      setPassword(ExistPassword);
    };

    if (!!ControllerUserAddress && !!ControllerKeystore && !!MagicUserAddress) {
      setControllerUserAddress(ControllerUserAddress);
      setControllerKeystore(ControllerKeystore);
      setMagicUserAddress(MagicUserAddress);
      setStep(5);
      return;
    };

    if (minimal && !!ControllerUserAddress && !!ControllerKeystore && !Did) {
      localStorage.clear();
      setStep(1);
      return;
    };
  }, []);

  return (
    <>
      {minimal && (
        <>
          {step === 1 &&
            <QuickSign
              setStep={setStep}
              setQsTicket={setQsTicket}
              minimal={minimal}
            />
          }
          {step === 2 &&
            <MagicLink
              setStep={setStep}
              magicMnemonic={magicMnemonic}
              minimal={minimal}
              setMagicLink={setMagicLink}
              qsTicket={qsTicket}
            />
          }
          {step === 3 &&
            <SetPassword
              setStep={setStep}
              password={password}
              setPassword={setPassword}
              setControllerUserAddress={setControllerUserAddress}
              setControllerKeystore={setControllerKeystore}
            />
          }
          {step === 4 &&
            <ConfirmPassword
              setStep={setStep}
              password={password}
            />
          }
          {step === 5 &&
            <InitialDeposit
              password={password}
              minimal={minimal}
              magicUserAddress={magicUserAddress}
              qsTicket={qsTicket}
              magicLink={magicLink}
              controllerUserAddress={controllerUserAddress}
              controllerKeystore={controllerKeystore}
            />
          }
        </>
      )}
      {!minimal && (
        <div className={styles.mainBgContainer}>
          <div className={styles.pageContainer}>
            {step === 1 &&
              <QuickSign
                setStep={setStep}
                setQsTicket={setQsTicket}
              />
            }
            {step === 2 &&
              <MagicLink
                setStep={setStep}
                qsTicket={qsTicket}
                magicMnemonic={magicMnemonic}
              />
            }
            {step === 3 &&
              <SetPassword
                setStep={setStep}
                password={password}
                setPassword={setPassword}
                setControllerUserAddress={setControllerUserAddress}
                setControllerKeystore={setControllerKeystore}
              />
            }
            {step === 4 &&
              <ConfirmPassword
                setStep={setStep}
                password={password}
              />
            }
            {step === 5 &&
              <InitialDeposit
                password={password}
                magicUserAddress={magicUserAddress}
                controllerUserAddress={controllerUserAddress}
                controllerKeystore={controllerKeystore}
                qsTicket={qsTicket}
              />
            }
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAccount;
