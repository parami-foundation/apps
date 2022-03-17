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
  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  });
  try {
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const account = await signer.getAddress();
    const signedMsg = await signer.signMessage(msg);
    web3Modal.clearCachedProvider();
    return { account, signedMsg };
  } catch (e: any) {
    console.log(e);
    message.error(e.message);
    return { account: "", signedMsg: "" };
  }
}

export async function signBSCMessage(msg: string) {
  const web3Modal = new Web3Modal({
    network: 'binance',
    cacheProvider: true,
    providerOptions,
  });
  try {
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const account = await signer.getAddress();
    const signedMsg = await signer.signMessage(msg);
    web3Modal.clearCachedProvider();
    return { account, signedMsg };
  } catch (e: any) {
    console.log(e);
    message.error(e.message);
    return { account: "", signedMsg: "" };
  }
}
