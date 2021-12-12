export const GetSlotAdOf = async (did: string): Promise<any> => {
    const slot = await window.apiWs.query.ad.slotOf(did);
    if (slot.isEmpty) {
        return null;
    }
    const res = slot.toHuman() as any;
    const ad = await window.apiWs.query.ad.metadata(res.ad);
    if (ad.isEmpty) {
        return null;
    }
    res.ad = ad.toHuman();
    return res;
};

export const GetUserInfo = async (did: Uint8Array) => {
    const userInfo = await window.apiWs.query.did.metadata(did);
    return userInfo;
};

export const GetUserTags = async (did: string) => {
    const allTags = await window.apiWs.query.tag.personasOf.entries(did);

    const tags: any[] = [];

    for (let i = 0; i < allTags.length; i++) {
        const [key, value] = allTags[i];
        const shortKey = key.toHuman();
        if (!!shortKey) {
            tags.push({
                value: value.toHuman(),
                count: shortKey[1],
            })
        }
    }

    return tags;
};
