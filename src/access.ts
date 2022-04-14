export const access = (initialState: { currentInfo?: API.Info | undefined }) => {
  const { currentInfo } = initialState || {};
  return {
    canWalletUser:
      !!currentInfo &&
      !!currentInfo?.wallet &&
      !!currentInfo?.wallet.account &&
      !!currentInfo?.wallet.keystore &&
      !!currentInfo?.wallet.did,
    canDashboard:
      !!currentInfo?.dashboard,
    canPreDID:
      !!currentInfo &&
      !!currentInfo?.wallet &&
      !!currentInfo?.wallet.account &&
      !!currentInfo?.wallet.keystore,
  };
}

export default access;
