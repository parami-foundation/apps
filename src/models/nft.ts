import { useModel } from 'umi';

export default () => {
    const apiWs = useModel('apiWs');

    const currentAccount = localStorage.getItem('stashUserAddress');

    const getNFTs = async () => {
        if (!apiWs) {
            return;
        }
        const allEntries = await apiWs.query.uniques.account(currentAccount);
    }
}