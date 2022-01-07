import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import config from "../config/config";
const KOL_URL = 'https://wallet.parami.io/did:ad3:2BNi8qXrGFBLWLJcGyaNg9yyGmWE?referrer=0x549e237e4154630d1467a3250b7ad118f216ea27';
const HOME_URL = 'https://wallet.parami.io/';

beforeAll(async () => {
    await page.goto(HOME_URL);
    await page.evaluate(() => {
        localStorage.setItem('controllerKeystore', 'eaeb15bc3ad07183e668bdaa7cce8310ab53cab834b85be79d06cdf7db4f4c23ea722d2d02fa049f402b31e5939b0671ea8f32fd1ab9948bceac63462dbea5a65c8a2febd253676765d59941bb7650bc');
        localStorage.setItem('controllerUserAddress', '5GpyXikKcJBdT2sKV2AYQS9duH4HmXAs7Xhf1scs22vYFEBm');
        localStorage.setItem('stamp', '7191d5');
        localStorage.setItem('magicUserAddress', '5C5vhYWyBT4EYaaNZNiaQsjxeo6phtmuxL7V9BRQh8s7si6S');
        localStorage.setItem('did', '0xc6636a8106809919bb9252881259e0b0c6f6d58c');
        localStorage.setItem('stashUserAddress', '5EYCAe5ijQkVKBy52wmC34BKLy4Sc8Fey42mry1a7DkHzEPG');
    });
});
describe('get Ad reward', () => {
    it('check create button', async () => {
        await page.goto(HOME_URL);

        const createBtn = await page.waitForSelector('.ant-btn-primary');
        const spantext = await createBtn.evaluate(el => el.textContent);
        await createBtn.click();
    });
    it('goto Create page', async () => {
        const manualBtn = await page.waitForSelector('.ant-btn-primary');
        const spantext = await manualBtn.evaluate(el => el.textContent);
        expect(spantext).toBe('Manual Deposit');
        await manualBtn.click();
    });
    it('got recovery link', async () => {
        const recoveryLinkElement = await page.waitForSelector('input.ant-input-lg');
        const recoveryLink = await recoveryLinkElement.evaluate(el => el.value);
        expect(recoveryLink.indexOf('https://wallet.parami.io/recover/#') > -1).toBe(true);
        const confirmBtn = await page.waitForSelector('.ant-btn-primary');
        await confirmBtn.click();
    })
    it('deposit and got a did', async () => {
        const addressInputarea = await page.waitForSelector('textarea.ant-input');
        const address = await addressInputarea.evaluate(el => el.value);
        const instanceKeyring = new Keyring({ type: 'sr25519' });
        const decodedMnemonic = 'dirt stuff common usual hunt floor method bubble blood unknown venture hold';
        const payUser = instanceKeyring.createFromUri(decodedMnemonic);
        const provider = new WsProvider(config.main.socketServer);
        const api = await ApiPromise.create({
            provider,
            types: config.types,
            rpc: config.rpc
        });
        await api.tx.balances.transfer(address, 1000000000000000000n).signAndSend(payUser);
        await page.waitForNavigation({ timeout: 60000 });
        const avatar = await page.waitForSelector('span.ant-avatar');
        expect(avatar).toBeTruthy();
    });
});
