import Wallet from '@project-serum/sol-wallet-adapter';

const providerUrl = 'https://www.sollet.io';
const wallet = new Wallet(providerUrl, 'devnet');

export function solanaSignMessage(message: string) {
    return new Promise(async (resolve) => {
        wallet.on('connect', async (publicKey) => {
            console.log('Connected to ' + publicKey.toBase58());
            const account = publicKey.toBase58();

            const data = new TextEncoder().encode(message);
            const { signature } = await wallet.sign(data, 'utf8');
            console.log(signature.toString('hex'));

            resolve({ account, signedMsg: signature.toString('hex') });
        });
        wallet.on('disconnect', () => console.log('Disconnected'));
    });
}
