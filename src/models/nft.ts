import { useModel } from 'umi';
import { useEffect } from 'react';

export default () => {
    const apiWs = useModel('apiWs');

    const currentAccount = localStorage.getItem('stashUserAddress');

    const getNFTs = async () => {
        if (!apiWs) {
            return;
        }
        const allEntries = await apiWs.query.uniques.account.keys(currentAccount);
        console.log(allEntries);
    }

    useEffect(() => {
        if (apiWs) {
            getNFTs();
        }
    }, [apiWs]);
}