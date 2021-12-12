import { useEffect, useState } from "react";
import { getOrInit } from "@/services/parami/init";
import config from "@/config/config";
import { GetAvatar } from "@/services/parami/api";

export default () => {
    const [nickname, setNickname] = useState<string>('Nickname');
    const [avatar, setAvatar] = useState<string>();

    const did = localStorage.getItem('did') as string;

    const getUserInfo = async () => {
        const api = await getOrInit();

        await api.query.did.metadata(did, async (res) => {
            const info = res.toHuman();
            if (!info) {
                return;
            }
            setNickname(info.nickname);

            if (info.avatar.indexOf('ipfs://') > -1) {
                const hash = info.avatar.substring(7);

                const { response, data } = await GetAvatar(config.ipfs.endpoint + hash);
                if (response.status === 200) {
                    setAvatar(window.URL.createObjectURL(data));
                }
            }
        });
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    return {
        nickname,
        avatar,
        setNickname,
        setAvatar,
    }
}