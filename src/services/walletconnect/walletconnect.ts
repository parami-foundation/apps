import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from 'ethers';

export async function signPersonalMessage(message: string) {
  const provider = new WalletConnectProvider({
    infuraId: "774b1e4252de48c3997d66ac5f5078d8",
  });
  try {
    await provider.enable();
    //  Wrap with Web3Provider from ethers.js
    const web3Provider = new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const account = await signer.getAddress();
    console.log(account);
    const signedMsg = await signer.signMessage(message);
    console.log(signedMsg);
    // Send JSON RPC requests
    //const result = await provider.request(payload: RequestArguments);
    await provider.disconnect()
    return { account, signedMsg };
  } catch (e) {
    console.log(e);
    await provider.disconnect()
    return { account: "", signedMsg: "" };
  }
  // Close provider session
}
