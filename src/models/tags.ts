import { useEffect, useState } from "react";
import { useModel } from "umi";
import { GetAllTags } from "@/services/parami/Tag";

export default () => {
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');
	const [allTagsArr, setAllTagsArr] = useState<any[]>([]);

	const getTags = async () => {
		if (!apiWs) {
			return;
		}

		const userTagEntries = await apiWs.query.tag.personasOf.entries(wallet?.did);

		const userTags: {key: string; value: {extrinsic: string; intrinsic: string}}[] = [];

		for (let i = 0; i < userTagEntries.length; i++) {
			const [key, value] = userTagEntries[i];
			const shortKey = key.toHuman();
			if (!!shortKey) {
				userTags.push({
					value: value.toHuman() as any,
					key: shortKey[1]
				})
			}
		}

		const allTags = await GetAllTags();

		const allTagsArr = allTags.map(tag => {
			const userTag = userTags.find(t => t.key === tag.key);
			
			return {
				value: parseInt(userTag?.value?.extrinsic ?? '0', 10) + parseInt(userTag?.value?.intrinsic ?? '0', 10),
				data: {
					...tag,
					label: tag.tag
				},
				hex: tag.key,
				fontColor: '#d4380d',
				bgColor: '#fff2e8',
				borderColor: '#ffbb96',
			}
		})

		setAllTagsArr(allTagsArr);
	}

	useEffect(() => {
		if (apiWs) {
			getTags();
		}
	}, [apiWs]);

	return { allTagsArr };
}