import { getOrInit } from '@/services/parami/init';
import { formatBalance } from '@polkadot/util';
import { notification } from 'antd';
import { useState, useEffect } from 'react';

export default () => {
  const [controller, setController] = useState<State.Controller>({});
  const [stash, setStash] = useState<State.Stash>({});

  const controllerUserAddress = localStorage.getItem('controllerUserAddress') as string;
  const stashUserAddress = localStorage.getItem('stashUserAddress') as string;

  const getController = async () => {
    const api = await getOrInit();

    if (!!controllerUserAddress) {
      let free: any;
      await api.query.system.account(controllerUserAddress, (info) => {
        const data: any = info.data;
        const total: any = data.free.add(data.reserved);
        if (free && free !== `${data.free}`) {
          notification.info({
            message: 'Changes in Gas Balance',
            description: formatBalance(BigInt(`${data.free}`) - BigInt(free), { withUnit: 'AD3' }, 18),
          })
        }
        setController({
          free: `${data.free}`,
          reserved: `${data.reserved}`,
          total: `${total}`,
          nonce: `${info.nonce}`,
        });
        free = `${data.free}`;
      });
    }

    if (!!stashUserAddress) {
      let free: any;
      await api.query.system.account(stashUserAddress, (info) => {
        const data: any = info.data;
        const total: any = data.free.add(data.reserved);
        if (free && free !== `${data.free}`) {
          notification.info({
            message: 'Changes in Balance',
            description: formatBalance(BigInt(`${data.free}`) - BigInt(free), { withUnit: 'AD3' }, 18),
          })
        }
        setStash({
          free: `${data.free}`,
          reserved: `${data.reserved}`,
          total: `${total}`,
          nonce: `${info.nonce}`,
        });
        free = `${data.free}`;
      });
    }
  }

  useEffect(() => {
    getController();
  }, []);

  return {
    controller,
    stash,
  }
}
