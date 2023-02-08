import { POST_MESSAGE_PREFIX } from '@/config/constant';
import React, { useEffect, useState } from 'react';
import { useModel, useParams } from 'umi';
import IdoModal from '../Creator/NFTs/IdoModal/IdoModal';

function QuickAddLiquidity() {
    const apiWs = useModel('apiWs');
    const { nftId } = useParams() as { nftId: string };

    const [swapMetadata, setSwapMetadata] = useState<any>();
    const [assetMetadata, setAssetMetadata] = useState<any>();

    const queryAssetInfo = async (nftId: string) => {
        const swapMetadata = (await apiWs?.query.swap.metadata(nftId))?.toHuman();
        const assetMetadata = (await apiWs?.query.assets.metadata(nftId))?.toHuman();
        setSwapMetadata(swapMetadata);
        setAssetMetadata(assetMetadata);
    }

    useEffect(() => {
        if (apiWs && nftId) {
            queryAssetInfo(nftId);
        }
    }, [apiWs, nftId]);

    return <>
        <IdoModal
            nftId={nftId}
            onClose={() => {
                window.close();
            }}
            onIDO={() => {
                // success
                if (window.opener) {
                    window.opener.postMessage(POST_MESSAGE_PREFIX.ADD_LIQUIDITY, '*');
                }
                window.close();
            }}
            symbol={assetMetadata?.symbol}
            swapMetadata={swapMetadata}
        ></IdoModal>
    </>;
};

export default QuickAddLiquidity;
