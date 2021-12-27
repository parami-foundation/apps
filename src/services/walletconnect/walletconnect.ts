
import QRCodeModal from '@walletconnect/qrcode-modal';
import WalletConnectProvider from "@walletconnect/web3-provider";
import type { ITxData, IWalletConnectSession } from '@walletconnect/types';
import { convertUtf8ToHex } from '@walletconnect/utils';

import config from '@/config/config';
import { providers } from 'ethers';

interface IAppState {
  connector: WalletConnect | null;
  fetching: boolean;
  connected: boolean;
  chainId: number;
  showModal: boolean;
  pendingRequest: boolean;
  uri: string;
  accounts: string[];
  address: string;
  result: any | null;
  assets: IAssetData[];
}

const INITIAL_STATE: IAppState = {
  connector: null,
  fetching: false,
  connected: false,
  chainId: 1,
  showModal: false,
  pendingRequest: false,
  uri: "",
  accounts: [],
  address: "",
  result: null,
  assets: [],
};

interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

export async function signPersonalMessage(message: string) {
  const provider = new WalletConnectProvider({
    infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
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
