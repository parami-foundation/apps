import { useCallback, useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const apiWs = useModel('apiWs');
  const [Events, setEvents] = useState<any[]>([]);

  const SubParamiEvents = useCallback(async () => {
    if (!apiWs) {
      return;
    }

    const unsub = await apiWs.query.system.events((events) => {
      setEvents(events);
    });
    return unsub;
  }, []);

  return {
    Events,
    SubParamiEvents
  }
}
