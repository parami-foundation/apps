/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export const access = () => {
  const controllerUserAddress = localStorage.getItem('controllerUserAddress') as string;
  const controllerKeystore = localStorage.getItem('controllerKeystore') as string;
  const magicUserAddress = localStorage.getItem('magicUserAddress') as string;
  const did = localStorage.getItem('did') as string;

  const dashboardDid = localStorage.getItem('dashboardDid');
  const dashboardCurrentAccount = localStorage.getItem('dashboardCurrentAccount');

  return {
    canPreDid:
      !!magicUserAddress &&
      !!controllerKeystore &&
      !!controllerUserAddress &&
      !did,
    canUser:
      !!magicUserAddress &&
      !!controllerKeystore &&
      !!controllerUserAddress &&
      !!did,
    canRecover:
      !!controllerKeystore &&
      !!controllerUserAddress,
    canDashboard:
      !!dashboardDid &&
      !!dashboardCurrentAccount,
  };
}

export default access;
