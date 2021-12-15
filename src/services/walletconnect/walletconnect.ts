import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { ITxData, IWalletConnectSession } from '@walletconnect/types';
import { convertUtf8ToHex } from '@walletconnect/utils';

import config from '@/config/config';

interface EventHandlers {
  handleInit?(uri: string): void;
  handleConnect?({
    address,
    chainId,
    session,
  }: {
    address: string;
    chainId: number;
    session: IWalletConnectSession;
  }): void;
  handleError?(error: Error): void;
  handleReject?(error: Error): void;
  handleUpdate?({
    address,
    chainId,
  }: {
    address: string;
    chainId: number;
  }): void;
  handleDisconnect?(params: any): void;
}

export default function WalletConnectService({
  handleInit = () => {},
  handleConnect = () => {},
  handleError = () => {},
  handleReject = () => {},
  handleUpdate = () => {},
  handleDisconnect = () => {},
}: EventHandlers) {
  const connector = new WalletConnect({
    bridge: config.walletConnect.bridge,
    qrcodeModal: QRCodeModal,
  });

  const getMessage = (payload: any) =>
    payload.params ? payload.params[0].message : false;

  const sendTx = async (tx: ITxData) => connector.sendTransaction(tx);

  const signMessage = async (msg: string, address: string) =>
    connector.signPersonalMessage([msg, address]);

  const kill = async () => connector.killSession();

  const init = async () => {
    if (connector.connected) await kill();

    connector.createSession().then(() => {
      handleInit(connector.uri);
    });
  };

  connector.on('connect', (error, payload) => {
    if (error) {
      return handleError(error);
    }

    const { accounts, chainId } = payload.params[0];
    handleConnect({
      address: accounts[0] as string,
      chainId,
      session: connector.session,
    });
  });

  connector.on('session_update', (error, payload) => {
    if (error) {
      return handleError(error);
    }

    const { accounts, chainId } = payload.params[0];
    handleUpdate({ address: accounts[0] as string, chainId });
  });

  connector.on('disconnect', (error, payload) => {
    if (error) {
      return handleError(error);
    }

    if (handleReject && getMessage(payload) === 'Session Rejected') {
      handleReject(payload.params);
    } else {
      handleDisconnect(payload);
    }
  });

  return {
    init,
    kill,
    sendTx,
    signMessage,
    isConnected: connector.connected,
  };
}

export const signPersonalMessage = async (message: string) => {
  return new Promise((resolve, reject) => {
    const service = WalletConnectService({
      handleConnect: async ({ address, chainId, session }) => {
        try {
          const result = await service.signMessage(
            convertUtf8ToHex(message),
            address
          );

          resolve({
            address,
            result,
          });

          await service.kill();
        } catch (e) {
          reject(e);
        }
      },
    });

    try {
      service.init();
    } catch (e) {
      reject(e);
    }
  });
};
