import { GetEndtimeOf } from '@/services/parami/Advertisement';
import { GetTagsOf } from '@/services/parami/Tag';
import { deleteComma } from '@/utils/format';
import { formatBalance } from '@polkadot/util';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';

export default () => {
  const apiWs = useModel('apiWs');
  const { dashboard } = useModel('currentUser');
  const [AdList, setAdList] = useState<any[]>([]);

  const getAdList = async () => {
    if (!apiWs) {
      return;
    }
    const data: any[] = [];

    await apiWs.query.ad.adsOf(dashboard?.did, async (adListRaw) => {
      const adList: any = adListRaw.toHuman();
      for (const adItem in adList) {
        const metadataRaw = await apiWs.query.ad.metadata(adList[adItem]);
        const metadata: any = metadataRaw.toHuman();
        const endtime: any = await GetEndtimeOf(adList[adItem]);

        data.push({
          id: adList[adItem],
          budget: formatBalance(deleteComma(metadata.budget), { withUnit: 'AD3' }, 18),
          tag: await GetTagsOf(adList[adItem]),
          metadata: metadata.metadata,
          rewardRate: metadata.rewardRate,
          endtime: endtime.toString(),
        });
      }
      setAdList(data);
    });
  };

  useEffect(() => {
    if (apiWs) {
      getAdList();
    };
  }, [apiWs]);

  return {
    AdList,
  }
}