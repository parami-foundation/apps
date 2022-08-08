import { useCallback, useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const apiWs = useModel('apiWs');
  const [Events, setEvents] = useState<any[]>([]);

  const SubParamiEvents = useCallback(async () => {
    if (!apiWs) {
      return;
    }

    const unsub = await apiWs.rpc.chain.subscribeNewHeads(async (header) => {
      const blockHash = await apiWs.rpc.chain.getBlockHash(header.number.unwrap());
      const at = await apiWs.at(blockHash);
      const events = await at.query.system.events();
      const hash = blockHash.toString();
      setEvents(events.map(event => ({
        ...event,
        blockHash: hash
      })));
    });

    return unsub;
  }, [apiWs]);

  return {
    Events,
    SubParamiEvents
  }
}
