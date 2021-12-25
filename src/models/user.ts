import { useEffect, useState } from "react";
import config from "@/config/config";
import { GetAvatar } from "@/services/parami/api";
import { useModel } from "umi";

export default () => {
    const apiWs = useModel('apiWs');
    const [nickname, setNickname] = useState<string>('Nickname');
    const [avatar, setAvatar] = useState<string>();

    const did = localStorage.getItem('did') as string;

    const getUserInfo = async () => {
        if (!apiWs) {
            return;
        }

        await apiWs.query.did.metadata(did, async (res) => {
            const info = res.toHuman();
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
        nickname,
        avatar,
        setNickname,
        setAvatar,
    }
}