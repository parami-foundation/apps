import { useEffect, useState } from "react";
import { GetAllTags } from "@/services/parami/Tag";
import { useModel } from "umi";

export default () => {
  const [tagOptions, setTagOptions] = useState<{ key: string; tag: string }[]>([]);
  const apiWs = useModel('apiWs');

  useEffect(() => {
    if (apiWs) {
      (async () => {
        const tags = await GetAllTags();
        setTagOptions(tags);
      })();
    }
  }, [apiWs]);

  return {
    tagOptions
  }
}
