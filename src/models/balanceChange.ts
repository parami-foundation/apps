import { useState, useEffect } from 'react';
import { useModel } from '../.umi/plugin-model/useModel';

export default () => {
    const apiWs = useModel('apiWs');
    if (!apiWs) {
        return;
    }
    const [controllerChange, setControllerChange] = useState<any>();

    const controllerUserAddress = localStorage.getItem('controllerUserAddress') as string;
    const stashUserAddress = localStorage.getItem('stashUserAddress') as string;

    const getControllerChange = async () => {
        if (!!controllerUserAddress) {
            await apiWs.query.system.events();
        }
    }

    useEffect(() => { }, [apiWs]);
}