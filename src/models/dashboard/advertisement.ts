import { GetEndtimeOf } from '@/services/parami/Advertisement';
import { GetTagsOf } from '@/services/parami/Tag';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import config from "@/config/config";

export interface AdListItem {
  id: string;
  tag: number;
  metadataIpfs: string;
  metadata: any;
  rewardRate: string;
  endtime: string;
}

export default () => {
  const apiWs = useModel('apiWs');
  const { dashboard } = useModel('currentUser');
  const [AdList, setAdList] = useState<AdListItem[]>([]);

  const getAdList = async () => {
    if (!apiWs) {
      return;
    }
    const data: AdListItem[] = [];

    await apiWs.query.ad.adsOf(dashboard?.did, async (adListRaw) => {
      const adList: any = adListRaw.toHuman();
      for (const adItem in adList) {
        const metadataRaw = await apiWs.query.ad.metadata(adList[adItem]);
        const metadata: any = metadataRaw.toHuman();
        const endtime: any = await GetEndtimeOf(adList[adItem]);

        let adMetadata;
        try {
          adMetadata = await (await fetch(`${config.ipfs.endpoint}${metadata.metadata.substring(7)}`)).json();
        } catch (e) {
          adMetadata = {};
        }

        data.push({
          id: adList[adItem],
          tag: await GetTagsOf(adList[adItem]),
          metadataIpfs: metadata.metadata,
          metadata: adMetadata ?? {},
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