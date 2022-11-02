import AdvertisementPreview from '@/components/Advertisement/AdvertisementPreview/AdvertisementPreview';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import config from '@/config/config';
import { IMAGE_TYPE } from '@/constants/advertisement';
import { NUM_BLOCKS_PER_DAY } from '@/constants/chain';
import { UserBatchCreateAds } from '@/services/parami/Advertisement';
import { GetAvatar } from '@/services/parami/HTTP';
import { uploadIPFS } from '@/services/parami/IPFS';
import { compressImageFile, generateAdConfig } from '@/utils/advertisement.util';
import { UploadOutlined } from '@ant-design/icons';
import { notification, Popover, Table } from 'antd';
import { Button, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import style from './BatchCreateAd.less';

export interface BatchCreateAdProps { }

function BatchCreateAd({ }: BatchCreateAdProps) {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const [adInfoList, setAdInfoList] = useState<any[]>([]);
    const [adConfigList, setAdConfigList] = useState<any[]>([]);
    const [passphrase, setPassphrase] = useState<string>('');
    const [secModal, setSecModal] = useState<boolean>(false);
    const [adIds, setAdIds] = useState<string[]>([]);
    const [adPreviews, setAdPreviews] = useState<any[]>([]);

    const compressImageUrl = async (imageUrl, type: IMAGE_TYPE) => {
        const download = await GetAvatar(imageUrl);
        if (download.data.type === 'image/gif') {
            return imageUrl;
        }
        const compressedFile = await compressImageFile(download.data, type);
        const { data } = await uploadIPFS(compressedFile);
        const newUrl = config.ipfs.endpoint + data.Hash;
        console.log('compressed:', newUrl);
        return newUrl;
    }

    const generateAdWithCompression = async (ad) => {
        if (ad.icon) {
            ad.icon = await compressImageUrl(ad.icon, IMAGE_TYPE.ICON);
        }

        if (ad.poster) {
            ad.poster = await compressImageUrl(ad.poster, IMAGE_TYPE.POSTER);
        }
        
        return generateAdConfig(ad);
    }

    useEffect(() => {
        if (adInfoList.length) {
            notification.info({ message: 'Preparing ad data...' });
            Promise.all(adInfoList.map(ad => generateAdWithCompression(ad))).then(configs => {
                notification.success({
                    message: 'Ready to create'
                })
                setAdPreviews(adInfoList);
                setAdConfigList(configs);
            }).catch((e) => {
                notification.error({
                    message: 'Generate Ad Config Error',
                    description: JSON.stringify(e)
                })
            });
        }
    }, [adInfoList]);

    const beforeUploadTSV = (file) => {
        console.log('reading file', file);
        if (file.type !== 'text/tab-separated-values') {
            notification.error({
                message: 'File Type Error',
                description: 'Please upload tsv (tab-separated-values) file'
            })
            return false;
        }

        const reader = new FileReader();
        reader.onload = (res: any) => {
            const rows = res.target.result.split('\n').slice(1) as string[];
            const adInfo = rows.map(row => {
                const props = row.split('\t');
                return {
                    title: props[1],
                    poster: `${props[3] ? config.ipfs.endpoint + props[3] : ''}`,
                    icon: `${props[5] ? config.ipfs.endpoint + props[5] : ''}`,
                    content: props[6],
                    sponsorName: props[7],
                    instructions: [{
                        text: props[8],
                        tag: 'Social Media',
                        score: 1,
                        link: props[9]
                    }],
                    rewardRate: parseInt(props[10], 10),
                    payoutBase: parseInt(props[11], 10),
                    payoutMin: parseInt(props[12], 10),
                    payoutMax: parseInt(props[13], 10),
                    lifetime: NUM_BLOCKS_PER_DAY * 2
                }
            });
            console.log('got ad infos', adInfo);
            setAdInfoList(adInfo);
        }
        reader.readAsText(file);
        return false;
    }

    const batchCreateAd = async (preTx?: boolean, account?: string) => {
        if (!preTx) {
            notification.info({
                message: 'Creating Ads',
                description: 'This might take a while. Please wait...'
            })
        }
        const infos: any = await UserBatchCreateAds(adConfigList, passphrase, wallet?.keystore, preTx, account);

        if (preTx && account) {
            return infos;
        }

        // get ad ids
        const ids = infos.map(info => info.ad.Created[0][0]);
        setAdIds(ids);
        setSecModal(false);

        notification.success({
            message: 'Ad Create Success'
        })
    }

    const adPreviewTableColumns = [{
        title: 'Title',
        dataIndex: 'title'
    }, {
        title: 'Content',
        dataIndex: 'content'
    }, {
        title: 'Sponsor Name',
        dataIndex: 'sponsorName'
    }, {
        title: 'Preview',
        render: (_, preview) => {

            return <>
                <Popover content={
                    <div style={{ marginTop: '40px' }}>
                        <AdvertisementPreview ad={preview} />
                    </div>
                } trigger="hover">
                    <a>preview</a>
                </Popover>
            </>
        }
    }]

    return <>
        <div className={style.container}>
            <div className={style.form}>
                <div className={style.field}>
                    <div className={style.title}>upload tsv (tab-separated-values)</div>
                    <div className={style.content}>
                        <Upload
                            beforeUpload={beforeUploadTSV}
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </div>
                </div>
            </div>

            {adPreviews.length > 0 && <>
                <div className={style.previewTable}>
                    <Table dataSource={adPreviews} columns={adPreviewTableColumns} pagination={false}></Table>
                </div>

                <div className={style.btnContainer}>
                    <Button
                        onClick={() => {
                            setSecModal(true);
                        }}
                        disabled={!apiWs || !adConfigList.length}
                    >Batch Create Ads</Button>
                </div>
            </>}

            {adIds.length > 0 && <>
                <div className={style.adIdsTable}>
                    <Table pagination={false} dataSource={adIds.map(id => ({ id }))} columns={[{
                        title: 'Ad id',
                        dataIndex: 'id',
                        key: 'id',
                    }]} />
                </div>
            </>}
        </div>

        <SecurityModal
            visable={secModal}
            setVisable={setSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={batchCreateAd}
        />
    </>;
};

export default BatchCreateAd;
