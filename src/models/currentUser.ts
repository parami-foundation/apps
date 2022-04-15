import { formatBoolean } from '@/utils/format';

export default () => {
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