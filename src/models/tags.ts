import { useEffect, useState } from "react";
import { GetTagsMap } from "@/services/parami/api";
import { getOrInit } from "@/services/parami/init";

export default () => {
    const [tags, setTags] = useState<any>();

    const colorPool = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

    const getTags = async () => {
        const did = localStorage.getItem('did') as string;

        const api = await getOrInit();

        const allTags = await api.query.tag.personasOf.entries(did);

        const tmpTags: any[] = [];
        const convertTags: any[] = [];

        for (let i = 0; i < allTags.length; i++) {
            const [key, value] = allTags[i];
            const shortKey = key.toHuman();
            if (!!shortKey) {
                tmpTags.push({
                    value: value.toHuman(),
                    count: shortKey[1]
                })
            }
        }

        tmpTags.map((item) => {
            GetTagsMap().then(({ response, data: Data }) => {
                if (response?.status === 200) {
                    if (Data[item.count]) {
                        convertTags.push({
                            value: item.value,
                            count: Data[item.count],
                            color: colorPool[Math.floor((item.value - 1) / (11 - 1))],
                        });
                    }
                    setTags(convertTags);
                }
            });
        });
    }

    useEffect(() => {
        getTags();
    }, []);

    return tags;
}