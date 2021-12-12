import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { convertUtf8ToHex } from "@walletconnect/utils";
import config from "@/config/config";

export const walletConnectInit = async () => {
    // Create a connector
    const connector = new WalletConnect({
        bridge: config.walletConnect.bridge,
        qrcodeModal: QRCodeModal,
    });

    // Check if connection is already established
    if (!connector.connected) {
        // create new session
        connector.createSession();
    };

    return connector;
};

export const signPersonalMessage = async (message: string) => {
    return new Promise(async (resolve, reject) => {
        const connector = await walletConnectInit();
        if (!connector) return;

        // Subscribe to connection events
        connector.on("connect", async (error, payload) => {
            if (error) {
                throw error;
            }

            // Get provided accounts and chainId
            const { accounts } = payload.params[0];

            const msgParams = [
                accounts[0],
                convertUtf8ToHex(message),
            ];

            // Sign personal message
            try {
                const result = await connector.signPersonalMessage(msgParams);

                await connector.killSession();

                connector.on("disconnect", (err) => {
                    if (err) {
                        throw err;
                    }
                });

                resolve({
                    account: accounts[0],
                    result
                });
            } catch (e: any) {
                reject(e);
            }
        });
    })
};
