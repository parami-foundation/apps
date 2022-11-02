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

    await apiWs.query.ad.adsOf(dashboard?.did, async (adListRaw) => {
      const adIds: any = adListRaw.toHuman() ?? [];

      const adList = await Promise.all(adIds.map(async adId => {
        const metadataRaw = await apiWs.query.ad.metadata(adId);
        const metadata: any = metadataRaw.toHuman();
        const endtime: any = await GetEndtimeOf(adId);

        let adMetadata;
        try {
          adMetadata = await (await fetch(`${config.ipfs.endpoint}${metadata.metadata.substring(7)}`)).json();
        } catch (e) {
          adMetadata = {};
        }

        return {
          id: adId,
          tag: await GetTagsOf(adId),
          metadataIpfs: metadata.metadata,
          metadata: adMetadata ?? {},
          rewardRate: metadata.rewardRate,
          endtime: endtime.toString(),
        }
      }));
      
      setAdList(adList);
    });
  };

  return {
    AdList,
    getAdList
  }
}