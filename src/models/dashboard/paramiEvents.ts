import { getOrInit } from '@/services/parami/init';
import { useEffect, useState } from 'react';

export default () => {
  const [Events, setEvents] = useState<any[]>([]);
  const [unsubscribe, setUnsubscribe] = useState<any>(null);
  const SubParamiEvents = async () => {
    const api = await getOrInit();
    // Subscribe to system events via storage
    const unsub = await api.query.system.events((events) => {
      console.log(`\nReceived ${events.length} events:`);
      setEvents(events);
      // Loop through the Vec<EventRecord>
      events.forEach((record) => {
        // Extract the phase, event and the event types
        const { event, phase } = record;
        const types = event.typeDef;

        // Show what we are busy with
        console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
        console.log(`\t\t${event.meta.docs.toString()}`);

        // Loop through each of the parameters, displaying the type and data
        event.data.forEach((data, index) => {
          console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
        });
      });
    });
    setUnsubscribe(unsub);
  }
  useEffect(() => {
    SubParamiEvents();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [])

  return {
    Events
  }
}
