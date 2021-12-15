import { useEffect, useState } from "react";
import { GetTagsMap } from "@/services/parami/api";
import { getOrInit } from "@/services/parami/init";
import { notification } from "antd";

export default () => {
    const [first, setFirst] = useState((new Date()).getTime());
    const [tags, setTags] = useState<Map<string, any>>(new Map());
    const [tagsArr, setTagsArr] = useState<any[]>([]);

    const colorPool = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

    const getTags = async () => {
        const did = localStorage.getItem('did') as string;

        const api = await getOrInit();

        const allTags = await api.query.tag.personasOf.entries(did);

        const tmpTags: any[] = [];

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

        const data: Map<string, any> = new Map();
        tmpTags.map((item) => {
            GetTagsMap().then(({ response, data: Data }) => {
                if (response?.status === 200) {
                    if (((new Date()).getTime() - first >= 30000) && !data.has(Data[item.count])) {
                        notification.success({
                            message: 'Get new tag!',
                            description: Data[item.count],
                            duration: null,
                        });
                    }

                    if (Data[item.count]) {
                        data.set(Data[item.count], {
                            value: item.value,
                            count: Data[item.count],
                            color: colorPool[Math.floor((item.value - 1) / (11 - 1))],
                        });
                    }
                    setTags(data);
                    setTagsArr([...data?.values()]);
                }
            });
        });
    }

    useEffect(() => {
        getTags();
    }, []);

    return { tags, tagsArr };
}