import { useEffect, useState } from "react";
import config from "@/config/config";
import { GetAvatar } from "@/services/parami/api";
import { useModel } from "umi";

export default () => {
    const apiWs = useModel('apiWs');
    const [Nickname, setNickname] = useState<string>('Nickname');
    const [Avatar, setAvatar] = useState<any>();

    const did = localStorage.getItem('dashboardDid');

    const getUserInfo = async () => {
        if (!apiWs || !did) {
            return;
        }
        await apiWs.query.did.metadata(did, async (res) => {
            let info = res.toHuman();
            const [avatar, nickname] = await (window.apiWs.rpc as any).did.batchGetMetadata(did, ['pic', 'name']);
            info = { ...info, avatar, nickname };
            if (!info) {
                return;
            }
            setNickname(info.nickname);
            if (info.avatar.indexOf('ipfs://') > -1) {
                const hash = info.avatar.substring(7);

                const { response, data } = await GetAvatar(config.ipfs.endpoint + hash);
                if (response?.status === 200) {
                    setAvatar(window.URL.createObjectURL(data));
                }
            }
        });
    }

    useEffect(() => {
        if (apiWs) {
            getUserInfo();
        }
    }, [apiWs]);

    return {
        nickname: Nickname,
        avatar: Avatar,
        setNickname,
        setAvatar,
    }
}