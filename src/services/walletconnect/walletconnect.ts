import WalletConnectProvider from "@walletconnect/web3-provider";
import { message } from "antd";
import { providers } from 'ethers';
import Web3Modal from 'web3modal';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: '836f7f85d3104fae9263dee3bcac66c9' // required
    },
  }
};

export async function signETHMessage(msg: string) {
  try {
    const web3Modal = new Web3Modal({
      network: 'rinkeby', // optional
      cacheProvider: false, // optional
      providerOptions // required
    });
    const provider = await web3Modal.connect();
    await provider.enable();
    //  Wrap with Web3Provider from ethers.js
    const web3Provider = new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const account = await signer.getAddress();
    console.log(account);
    const signedMsg = await signer.signMessage(msg);
    console.log(signedMsg);
    // Send JSON RPC requests
    //const result = await provider.request(payload: RequestArguments);
    return { account, signedMsg };
  } catch (e: any) {
    console.log(e);
    message.error(e.message);
    return { account: "", signedMsg: "" };
  }
  // Close provider session
}

export async function signBSCMessage(msg: string) {
  try {
    const web3Modal = new Web3Modal({
      network: 'binance', // optional
      cacheProvider: false, // optional
      providerOptions // required
    });
    const provider = await web3Modal.connect();
    await provider.enable();
    //  Wrap with Web3Provider from ethers.js
    const web3Provider = new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const account = await signer.getAddress();
    console.log(account);
    const signedMsg = await signer.signMessage(msg);
    console.log(signedMsg);
    // Send JSON RPC requests
    //const result = await provider.request(payload: RequestArguments);
    return { account, signedMsg };
  } catch (e: any) {
    console.log(e);
    message.error(e.message);
    return { account: "", signedMsg: "" };
  }
  // Close provider session
}
