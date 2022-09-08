import { useEffect, useState } from "react";
import { GetTagsMap } from "@/services/parami/HTTP";

export default () => {
  const [tagOptions, setTagOptions] = useState<{ hash: string; name: string }[]>([]);

  useEffect(() => {
    (async () => {
      const { data }: any = await GetTagsMap();
      const tags = Object.keys(data).filter(tagHash => data[tagHash].guide).map(tagHash => {
        return {
          hash: tagHash,
          name: data[tagHash].label
        }
      });
      setTagOptions(tags);
    })();
  }, []);

  return {
    tagOptions
  }
}
