import { useEffect, useState } from "react";
import { GetTagsMap } from "@/services/parami/api";
import { notification } from "antd";
import { useModel } from "umi";

export default () => {
    const apiWs = useModel('apiWs');
    const [first, setFirst] = useState((new Date()).getTime());
    const [tags, setTags] = useState<Map<string, any>>(new Map());
    const [tagsArr, setTagsArr] = useState<any[]>([]);
    const [guideTagsArr, setGuideTagsArr] = useState<any[]>([]);
    const [allTagsArr, setAllTagsArr] = useState<any[]>([]);

    const getTags = async () => {
        if (!apiWs) {
            return;
        }
        const did = localStorage.getItem('did') as string;

        const allTags = await apiWs.query.tag.personasOf.entries(did);

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

        GetTagsMap().then(({ response, data: Data }) => {
            if (response?.status === 200) {
                Object.keys(Data).map((item) => {
                    if (Data[item].guide) {
                        guide.set(Data[item].label, {
                            data: Data[item],
                            fontColor: '#909090',
                            bgColor: '#fafafa',
                            borderColor: '#d9d9d9',
                        });
                    }
                })

                tmpTags.map((item) => {
                    if (((new Date()).getTime() - first >= 30000) && !data.has(Data.all[item.count])) {
                        notification.success({
                            message: 'Get new tag!',
                            description: Data[item.count],
                            duration: null,
                        });
                    }

                    if (Data[item.count]) {
                        data.set(Data[item.count], {
                            value: item.value,
                            data: Data[item.count],
                            hex: item.count,
                            fontColor: '#d4380d',
                            bgColor: '#fff2e8',
                            borderColor: '#ffbb96',
                        });
                    }

                    if (Data[item.count]) {
                        guide.delete(Data[item.count].label);
                    }
                })

                setTags(data);
                setTagsArr([...data?.values()]);
                setGuideTagsArr([...guide?.values()]);
                setAllTagsArr([...data?.values()].concat([...guide?.values()]));
            }
        });
    }

    useEffect(() => {
        if (apiWs) {
            getTags();
        }
    }, [apiWs]);

    return { tags, tagsArr, guideTagsArr, allTagsArr };
}