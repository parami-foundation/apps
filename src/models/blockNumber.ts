import { useEffect, useState } from "react";
import { useModel } from "umi";

export default () => {
    const apiWs = useModel('apiWs');
    const [blockNumber, setblockNumber] = useState<any>(0);

    const getBlockNumber = async () => {
        if (!apiWs) {
            return;
        }
        await apiWs.rpc.chain.subscribeNewHeads((header) => {
            setblockNumber(header.number);
        });
    }

    useEffect(() => {
        if (apiWs) {
            getBlockNumber();
        }
    }, [apiWs]);

    return {
        blockNumber
    }
}