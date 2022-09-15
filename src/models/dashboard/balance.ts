import { formatBalance } from '@polkadot/util';
import { notification } from 'antd';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';

export default () => {
  const apiWs = useModel('apiWs');
  const { dashboard } = useModel('currentUser');
  const [balance, setBalance] = useState<State.Controller>({});

  const getController = async () => {
    if (!apiWs) {
      return;
    }
    if (!!dashboard && !!dashboard.account) {
      let free: any;
      await apiWs.query.system.account(dashboard?.account, (info) => {
        const data: any = info.data;
        const total: any = data.free.add(data.reserved);
        if (free && free !== `${data.free}`) {
          notification.success({
            key: 'gasBalanceChange',
            message: 'Dashboard: Changes in Gas Balance',
            description: formatBalance(BigInt(`${data.free}`) - BigInt(free), { withUnit: 'AD3' }, 18),
          })
        }
        setBalance({
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
    balance,
  }
}
