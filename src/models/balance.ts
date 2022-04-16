import { formatBalance } from '@polkadot/util';
import { notification } from 'antd';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';

export default () => {
  const apiWs = useModel('apiWs');
  const { wallet } = useModel('currentUser');
  const [balance, setBalance] = useState<State.Controller>({});

  const getController = async () => {
    if (!apiWs) {
      return;
    }
    if (!!wallet && !!wallet.account) {
      let free: any;
      await apiWs.query.system.account(wallet.account, (info) => {
        const data: any = info.data;
        const total: any = data.free.add(data.reserved);
        if (free && free !== `${data.free}`) {
          notification.success({
            key: 'balanceChange',
            message: 'Changes in Balance',
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
    balance
  }
}
