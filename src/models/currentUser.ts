import { useIntl, useModel } from 'umi';
import { useEffect } from 'react';
import { notification } from 'antd';

export default () => {
  const apiWs = useModel('apiWs');

  const intl = useIntl();

  // Common Info
  const languageCode = localStorage.getItem('languageCode');
  const releaseNotesModal = localStorage.getItem('parami.wallet.releaseNotesModal');

  // Wallet Info
  const walletPassphrase = localStorage.getItem('parami:wallet:passphrase');
  const walletKeystore = localStorage.getItem('parami:wallet:keystore');
  const walletAccount = localStorage.getItem('parami:wallet:account');
  const walletDID = localStorage.getItem('parami:wallet:did');
  const paramiCustomPassphrase = localStorage.getItem('parami:wallet:customPassphrase');

  // Dashboard Info
  const dashboardAccountMeta = localStorage.getItem('parami:dashboard:accountMeta');
  const dashboardAccount = localStorage.getItem('parami:dashboard:account');
  const dashboardDID = localStorage.getItem('parami:dashboard:did');
  const dashboardAccounts = localStorage.getItem('parami:dashboard:accounts');
  const dashboardAssets = localStorage.getItem('parami:dashboard:assets');

  const checkWalletAccount = async () => {
    if (walletAccount && apiWs) {
      const account = await apiWs.query.system.account(walletAccount);
      if (account.isEmpty) {
        notification.error({
          message: intl.formatMessage({
            id: 'error.identity.zeroBalance',
          }),
          duration: null,
        });
      }
    }
  };

  useEffect(() => {
    checkWalletAccount();
  }, [apiWs]);

  return {
    common: {
      languageCode,
      releaseNotesModal,
    },
    wallet: {
      passphrase: walletPassphrase,
      keystore: walletKeystore,
      account: walletAccount,
      did: walletDID,
      customPassphrase: paramiCustomPassphrase,
    },
    dashboard: {
      accountMeta: dashboardAccountMeta,
      account: dashboardAccount,
      did: dashboardDID,
      accounts: dashboardAccounts,
      assets: dashboardAssets,
    }
  }
}