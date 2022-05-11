import { formatBoolean } from '@/utils/format';
import { useModel } from 'umi';
import { notification } from 'antd';
import { useEffect } from 'react';

export default () => {
  const apiWs = useModel('apiWs');

  // Common Info
  const languageCode = localStorage.getItem('languageCode');
  const releaseNotesModal = localStorage.getItem('parami.wallet.releaseNotesModal');

  // Wallet Info
  const walletPassphrase = localStorage.getItem('parami:wallet:passphrase');
  const walletKeystore = localStorage.getItem('parami:wallet:keystore');
  const walletAccount = localStorage.getItem('parami:wallet:account');
  const walletDID = localStorage.getItem('parami:wallet:did');
  const walletCustomPassphrase = localStorage.getItem('parami:wallet:customPassphrase');
  const walletInProcess = localStorage.getItem('parami:wallet:inProcess');
  const walletRedirect = localStorage.getItem('parami:wallet:redirect');

  // Dashboard Info
  const dashboardAccountMeta = localStorage.getItem('parami:dashboard:accountMeta');
  const dashboardAccount = localStorage.getItem('parami:dashboard:account');
  const dashboardDID = localStorage.getItem('parami:dashboard:did');
  const dashboardAccounts = localStorage.getItem('parami:dashboard:accounts');
  const dashboardAssets = localStorage.getItem('parami:dashboard:assets');

  const QueryAccountExist = async (account: string) => {
    if (!apiWs) {
      return;
    }

    const existDID = await apiWs.query.did.didOf(account);
    if (existDID.isEmpty) {
      notification.error({
        key: 'accessDenied',
        message: 'Access Denied',
        description: 'The account does not exist',
        duration: null,
      });
    }
  };

  useEffect(() => {
    if (!!apiWs && !!walletAccount && !!walletDID) {
      QueryAccountExist(walletAccount);
    }
    if (!!apiWs && !!dashboardAccount && !!dashboardDID) {
      QueryAccountExist(dashboardAccount);
    }
  }, [apiWs]);

  return {
    common: {
      languageCode,
      releaseNotesModal: releaseNotesModal ? JSON.parse(releaseNotesModal) : [],
    },
    wallet: {
      passphrase: walletPassphrase,
      keystore: walletKeystore,
      account: walletAccount,
      did: walletDID,
      customPassphrase: formatBoolean(walletCustomPassphrase),
      inProcess: walletInProcess,
      redirect: walletRedirect,
    },
    dashboard: {
      accountMeta: dashboardAccountMeta,
      account: dashboardAccount,
      did: dashboardDID,
      accounts: dashboardAccounts ? JSON.parse(dashboardAccounts) : {},
      assets: dashboardAssets ? JSON.parse(dashboardAssets) : {},
    }
  } as API.Info;
}