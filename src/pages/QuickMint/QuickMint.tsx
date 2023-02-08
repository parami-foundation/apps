import { POST_MESSAGE_PREFIX } from '@/config/constant';
import { useParams } from 'umi';
import MintNFTModal from '../Creator/NFTs/Mint';

function QuickMint() {
    const { nftId } = useParams() as { nftId: string };

    return <>
        <MintNFTModal
            nftId={nftId}
            onClose={() => {
                window.close();
            }}
            onMint={() => {
                if (window.opener) {
                    window.opener.postMessage(POST_MESSAGE_PREFIX.NFT_MINT, '*');
                }
                window.close();
            }}
        ></MintNFTModal>
    </>;
};

export default QuickMint;
