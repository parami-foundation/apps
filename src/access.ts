export const access = (initialState: { currentInfo?: API.Info | undefined }) => {
  const { currentInfo } = initialState || {};
  return {
    canWalletUser:
      !!currentInfo &&
      !!currentInfo?.Wallet &&
      !!currentInfo?.Wallet.account &&
      !!currentInfo?.Wallet.keystore &&
      !!currentInfo?.Wallet.did,
    canDashboard:
      !!currentInfo?.Dashboard,
    canPreDID:
      !!currentInfo &&
      !!currentInfo?.Wallet &&
      !!currentInfo?.Wallet.account &&
      !!currentInfo?.Wallet.keystore,
  };
}

export default access;
