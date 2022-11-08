import { Card, Typography } from 'antd';
import React from 'react';
import styles from '../style.less';
const { Title } = Typography;

export interface ExtensionDownloadProps { }

function ExtensionDownload({ }: ExtensionDownloadProps) {
    return <>
        <Card
            className={styles.sideCard}
            bodyStyle={{
                width: '100%'
            }}
            style={{marginBottom: '2rem'}}
        >
            <Title level={4}>
                Chrome Extension
            </Title>

            <div>
                Try out our community built <a href='https://chrome.google.com/webstore/detail/hyperlink-nft-extension/gilmlbeecofjmogfkaocnjmbiblmifad' target='_blank'>chrome extension</a> for better experience with viewing hNFTs.
            </div>
        </Card>
    </>;
};

export default ExtensionDownload;
