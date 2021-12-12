import { getOrInit } from '@/services/parami/init';
import { useState } from 'react';

export default () => {
    const [controllerChange, setControllerChange] = useState<any>();

    const controllerUserAddress = localStorage.getItem('controllerUserAddress') as string;
    const stashUserAddress = localStorage.getItem('stashUserAddress') as string;

    const getControllerChange = async () => {
        const api = await getOrInit();

        if (!!controllerUserAddress) {
            await api.query.system.events()
        }
    }
}