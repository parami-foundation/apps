import React from 'react';
import { useParams, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from './Swap.less';
import { Card } from 'antd';

import SwapAsset from '@/components/SwapAsset/SwapAsset';

const Swap: React.FC = () => {
    const params: { assetId: string } = useParams();

    return (
        <>
        <div className={style.container}>
            <Card
                className={styles.card}
                bodyStyle={{
                    width: '100%',
                    padding: '24px 8px',
                }}
                style={{
                    marginTop: 50,
                    maxWidth: '600px'
                }}
            >
                <SwapAsset assetId={params?.assetId} onSelectAsset={(asset) => {
                    history.push(`/swap/${asset.id}`);
                }}></SwapAsset>
            </Card>
        </div>
        </>
    )
};

export default Swap;
