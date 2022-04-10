import { formatBalance } from '@polkadot/util';
import { notification } from 'antd';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';

export default () => {
  const apiWs = useModel('apiWs');
  const [controller, setController] = useState<State.Controller>({});
  const [stash, setStash] = useState<State.Stash>({});

  const controllerUserAddress = localStorage.getItem('dashboardControllerUserAddress') as string;
  const stashUserAddress = localStorage.getItem('dashboardStashUserAddress');

  const getController = async () => {
    if (!apiWs) {
      return;
    }
    if (!!controllerUserAddress) {
      let free: any;
      await apiWs.query.system.account(controllerUserAddress, (info) => {
        const data: any = info.data;
        const total: any = data.free.add(data.reserved);
        if (free && free !== `${data.free}`) {
          notification.success({
            key: 'gasBalanceChange',
            message: 'Dashboard: Changes in Gas Balance',
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
      await apiWs.query.system.account(stashUserAddress, (info) => {
        const data: any = info.data;
        const total: any = data.free.add(data.reserved);
        if (free && free !== `${data.free}`) {
          notification.success({
            key: 'stashBalanceChange',
            message: 'Dashboard: Changes in Balance',
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
    if (apiWs) {
      getController();
    }
  }, [apiWs]);

  return {
    controller,
    stash,
  }
}
