import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import config from "../config/config";
const KOL_URL = 'https://wallet.parami.io/did:ad3:2BNi8qXrGFBLWLJcGyaNg9yyGmWE?referrer=0x549e237e4154630d1467a3250b7ad118f216ea27';
const HOME_URL = 'https://wallet.parami.io/';


describe('Register', () => {
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