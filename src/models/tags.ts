import { useEffect, useState } from "react";
import { GetTagsMap } from "@/services/parami/api";
import { getOrInit } from "@/services/parami/init";
import { notification } from "antd";

export default () => {
    const [first, setFirst] = useState((new Date()).getTime());
    const [tags, setTags] = useState<Map<string, any>>(new Map());
    const [tagsArr, setTagsArr] = useState<any[]>([]);
    const [guideTagsArr, setGuideTagsArr] = useState<any[]>([]);

    const textColor = ['#c41d7f', '#cf1322', '#d4380d', '#d46b08', '#d48806', '#7cb305', '#389e0d', '#08979c', '#096dd9', '#1d39c4', '#531dab'];
    const bgColor = ['#fff0f6', '#fff1f0', '#fff2e8', '#fff7e6', '#fffbe6', '#fcffe6', '#f6ffed', '#e6fffb', '#e6f7ff', '#f0f5ff', '#f9f0ff'];
    const borderColor = ['#ffadd2', '#ffa39e', '#ffbb96', '#ffd591', '#ffe58f', '#eaff8f', '#b7eb8f', '#87e8de', '#91d5ff', '#adc6ff', '#d3adf7'];

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
        const guide: Map<string, any> = new Map();
        tmpTags.map((item) => {
            GetTagsMap().then(({ response, data: Data }) => {
                if (response?.status === 200) {
                    if (((new Date()).getTime() - first >= 30000) && !data.has(Data.all[item.count])) {
                        notification.success({
                            message: 'Get new tag!',
                            description: Data[item.count],
                            duration: null,
                        });
                    }

                    if (Data.all[item.count]) {
                        data.set(Data.all[item.count], {
                            value: item.value,
                            count: Data.all[item.count],
                            hex: item.count,
                            textColor: '#d4380d',
                            bgColor: '#fff2e8',
                            borderColor: '#ffbb96',
                        });
                    }

                    Object.keys(Data.guide).map((guideItem) => {
                        guide.set(Data.guide[guideItem].name, {
                            count: Data.guide[guideItem],
                            textColor: '#909090',
                            bgColor: '#fafafa',
                            borderColor: '#d9d9d9',
                        });
                    })
                    if (Data.guide[item.count]) {
                        guide.delete(Data.guide[item.count].name);
                    }

                    setTags(data);
                    setTagsArr([...data?.values()]);
                    setGuideTagsArr([...guide?.values()]);
                }
            });
        });
    }

    useEffect(() => {
        getTags();
    }, []);

    return { tags, tagsArr, guideTagsArr };
}