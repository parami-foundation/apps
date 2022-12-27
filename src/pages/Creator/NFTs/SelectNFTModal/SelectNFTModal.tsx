import React, { useEffect, useState } from 'react';
import { Card, Spin, List, Avatar, Typography, Modal } from 'antd';
import { OSCollection, OSNFT } from '@/models/openseaApi';
import { useModel } from 'umi';
import style from './SelectNFTModal.less';

const { Paragraph, Title } = Typography;

export interface SelectNFTModalProps {
    onCancel: () => void,
    onSelect: (nft: OSNFT) => void
}

function SelectNFTModal({ onCancel, onSelect }: SelectNFTModalProps) {

    const { retrieveCollections, retrieveAssets } = useModel('openseaApi');
    const [collections, setCollections] = useState<OSCollection[]>();
    const [selectedCollection, setSelectedCollection] = useState<OSCollection>();
    const [nfts, setNfts] = useState<OSNFT[]>([]);

    useEffect(() => {
        if (retrieveCollections) {
            retrieveCollections().then(collections => {
                setCollections(collections)
                setSelectedCollection(undefined)
            });
        }
    }, [retrieveCollections])

    useEffect(() => {
        if (selectedCollection && retrieveAssets) {
            setNfts([]);
            retrieveAssets({ collection: selectedCollection.slug }).then(nfts => {
                // todo: filter nfts
                setNfts(nfts);
            })
        }
    }, [selectedCollection, retrieveAssets])

    return <>
        <Modal visible centered width={1000} onCancel={onCancel} title="Select Your NFT" footer={null}>
            <div className={style.container}>
                {!collections && (
                    <div className={style.loadingContainer}>
                        <Spin tip="Loading..." />
                    </div>
                )}
                {collections && collections.length === 0 && (
                    <p>Could not find any NFTs. Please try create HNFT directly.</p>
                )}
                {collections && collections.length > 0 && (<>
                    <Title level={5}>Select Collection</Title>
                    <List
                        itemLayout="vertical"
                        size="large"
                        grid={{ column: 2 }}
                        pagination={{
                            pageSize: 6,
                        }}
                        dataSource={collections}
                        renderItem={item => (
                            <List.Item
                                key={item.slug}
                            >
                                <Card hoverable className={`${style.collectionCard} ${selectedCollection?.slug === item.slug ? style.selected : ''}`} onClick={() => setSelectedCollection(item)} bodyStyle={{ padding: '16px' }}>
                                    <Card.Meta
                                        avatar={<Avatar size="large" shape="square" src={item.image_url} />}
                                        title={item.name}
                                        description={<Paragraph style={{ margin: 0 }} ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>{item.description ?? ''}</Paragraph>}
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                </>)}


                {selectedCollection && (<>
                    <Title level={5}>{selectedCollection.name}</Title>
                    {nfts.length === 0 && (
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <Spin />
                        </div>
                    )}
                    {nfts.length > 0 && (
                        <List
                            itemLayout="vertical"
                            size="large"
                            grid={{ column: 3 }}
                            pagination={{
                                pageSize: 3,
                            }}
                            dataSource={nfts}
                            renderItem={item => (
                                <List.Item
                                    key={item.token_id}
                                >
                                    <Card hoverable onClick={() => onSelect(item)} bodyStyle={{padding: '20px'}}>
                                        <div className={style.nftCardContent}>
                                            <img className={style.nftImage} src={item.image_url}></img>
                                            <div className={style.nftName}>{item.name}</div>
                                            <Paragraph ellipsis={{ rows: 4, expandable: true, symbol: 'more' }}>{item.description ?? ''}</Paragraph>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )}
                </>)}
            </div>
        </Modal>
    </>;
};

export default SelectNFTModal;
