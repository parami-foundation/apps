import React, { useEffect, useState } from 'react';
import { useParams, useAccess } from 'umi';
import styles from '@/pages/wallet.less';
import InputLink from './RecoverAccount/InputLink';
import WithLink from './RecoverAccount/WithLink';
import RecoverDeposit from './RecoverAccount/RecoverDeposit';
import BypassPasswd from './RecoverAccount/BypassPasswd';

const RecoverAccount: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [mnemonic, setMnemonic] = useState<string>('');
  const [password, setPassword] = useState('');

  const [magicKeystore, setMagicKeystore] = useState<string>('');
  const [oldController, setOldController] = useState<string>('');

  const params: {
    mnemonic: string;
  } = useParams();

  const isRecoverLink = async () => {
    if (params.mnemonic !== undefined) {
      setMnemonic(params.mnemonic.replace(/%20/g, ' '));
      setStep(2);
    }
  };

  const access = useAccess();

  // useEffect(() => {
  //   if (access.canRecover) {
  //     setStep(3);
  //     return;
  //   }
  //   isRecoverLink();
  // }, []);

  //bypass passwd
  useEffect(() => {
    if (params.mnemonic !== undefined) {
      setMnemonic(params.mnemonic.replace(/%20/g, ' '));
      setStep(4);
    }
  }, []);
  useEffect(() => {

  }, [mnemonic]);
  //bypass passwd end

  return (
    <>
      <div className={styles.mainBgContainer}>
        <div className={styles.pageContainer}>
          {step === 1 && (
            <InputLink
              mnemonic={mnemonic}
              setMnemonic={setMnemonic}
              setStep={setStep}
            />
          )}
          {step === 2 && (
            <WithLink
              mnemonic={mnemonic}
              setStep={setStep}
              password={password}
              setPassword={setPassword}
              setMagicKeystore={setMagicKeystore}
              setOldController={setOldController}
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
              mnemonic={mnemonic}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RecoverAccount;
