export const GetUserInfo = async (did: string) => {
    const userInfo = await window.apiWs.query.did.metadata(did);
    const [avatar, nickname] = await (window.apiWs.rpc as any).did.batchGetMetadata(did, ['pic', 'name']);

    if (userInfo.isEmpty) {
        return null;
    }
    const user = userInfo.toHuman() as any;
    return { ...user, avatar, nickname };
};