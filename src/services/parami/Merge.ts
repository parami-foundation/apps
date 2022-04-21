import { notification } from "antd";

export const Merge = async () => {
  const controllerKeystore = localStorage.getItem('controllerKeystore');
  const controllerUserAddress = localStorage.getItem('controllerUserAddress');
  const stamp = localStorage.getItem('stamp');
  const did = localStorage.getItem('did');

  if (!!controllerKeystore && !!controllerUserAddress && !!stamp && !!did) {
    localStorage.setItem('parami:wallet:keystore', controllerKeystore);
    localStorage.setItem('parami:wallet:account', controllerUserAddress);
    localStorage.setItem('parami:wallet:passphrase', stamp);
    localStorage.setItem('parami:wallet:did', did);

    localStorage.removeItem('controllerKeystore');
    localStorage.removeItem('controllerUserAddress');
    localStorage.removeItem('stamp');
    localStorage.removeItem('did');
    localStorage.removeItem('magicUserAddress');
    localStorage.removeItem('stashUserAddress');
    localStorage.removeItem('dashboardCurrentAccount');
    localStorage.removeItem('dashboardDid');
    localStorage.removeItem('dashboardControllerUserAddress');
    localStorage.removeItem('dashboardAssets');
    localStorage.removeItem('dashboardStashUserAddress');
    localStorage.removeItem('redirect');

    notification.success({
      key: 'mergeNotice',
      message: 'Your Para Identity has been updated!',
      description: 'Now you can use your account more easily. The page will refresh in 10 seconds.',
      duration: null,
    });

    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }
};
