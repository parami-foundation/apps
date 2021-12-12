import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import { Keyring } from '@polkadot/api';
import { TokenPocketWalletAdapter } from '@solana/wallet-adapter-tokenpocket';
import { toHexString } from '@/utils/hexcode';

export const signSolanaMessage = async (message: string) => {
    const adapter = new TokenPocketWalletAdapter({});
    adapter.connect();
    const publicKey = adapter.publicKey?.toBase58();

    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await adapter.signMessage(encodedMessage);
    return {
        address: publicKey as string,
        result: toHexString(signedMessage),
    }
};

export const signPolkadotMessage = async (message: string) => {
    const extensions = await web3Enable('Parami Wallet');
    if (extensions.length === 0) {
        throw new Error('Please use it in Token Pocket APP');
    }

    const Accounts = await web3Accounts();

    const instanceKeyring = new Keyring({ type: 'sr25519' });
    const keypair = instanceKeyring.getPair(Accounts[0].address);
    const signedMessage = keypair.sign(message);

    return {
        address: Accounts[0].address,
        result: toHexString(signedMessage),
    }
};