import SecurityModal from '@/components/ParamiModal/SecurityModal';
import config from '@/config/config';
import { IMAGE_TYPE } from '@/constants/advertisement';
import { NUM_BLOCKS_PER_DAY } from '@/constants/chain';
import { UserBatchCreateAds } from '@/services/parami/Advertisement';
import { compressImageFile, generateAdConfig } from '@/utils/advertisement.util';
import { UploadOutlined } from '@ant-design/icons';
import { notification, Table } from 'antd';
import { Button, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import style from './BatchCreateAd.less';

export interface BatchCreateAdProps { }

function BatchCreateAd({ }: BatchCreateAdProps) {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const [iconList, setIconList] = useState<UploadFile[]>([]);
    const [posterList, setPosterList] = useState<UploadFile[]>([]);
    const [adInfoList, setAdInfoList] = useState<any[]>([]);
    const [adConfigList, setAdConfigList] = useState<any[]>([]);
    const [passphrase, setPassphrase] = useState<string>('');
    const [secModal, setSecModal] = useState<boolean>(false);
    const [adIds, setAdIds] = useState<string[]>([]);

    useEffect(() => {
        if (adInfoList.length && iconList.length && posterList.length) {
            notification.info({ message: 'Preparing ad data...' });
            const ads = adInfoList.map(info => {
                const icon = iconList.find(file => file.name.toLowerCase() === info.iconFileName.toLowerCase());
                const poster = iconList.find(file => file.name.toLowerCase() === info.posterFileName.toLowerCase());

                return {
                    ...info,
                    poster: poster?.url,
                    icon: icon?.url
                }
            });

            Promise.all(ads.map(ad => generateAdConfig(ad))).then(configs => {
                notification.success({
                    message: 'Ready to create'
                })
                setAdConfigList(configs);
            }).catch((e) => {
                notification.error({
                    message: 'Generate Ad Config Error',
                    description: JSON.stringify(e)
                })
            });
        }
    }, [adInfoList, iconList, posterList]);

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
                    posterFileName: props[2],
                    iconFileName: props[3],
                    content: props[4],
                    sponsorName: props[5],
                    instructions: [{
                        text: props[6],
                        tag: 'Twitter',
                        score: 1,
                        link: props[7]
                    }],
                    rewardRate: parseInt(props[8], 10),
                    payoutBase: parseInt(props[9], 10),
                    payoutMin: parseInt(props[10], 10),
                    payoutMax: parseInt(props[11], 10),
                    lifetime: NUM_BLOCKS_PER_DAY
                }
            });
            console.log('got ad infos', adInfo);
            setAdInfoList(adInfo);
        }
        reader.readAsText(file);
        return false;
    }

    const handleBeforeUpload = (imageType: IMAGE_TYPE) => {
        return async (file) => {
            return await compressImageFile(file, imageType);
        }
    }

    const handleUploadOnChange = (imageType: IMAGE_TYPE) => {
        return (info) => {
            let newFileList = [...info.fileList];

            newFileList = newFileList.map(file => {
                if (file.response) {
                    const ipfsHash = file.response.Hash;
                    const imageUrl = config.ipfs.endpoint + ipfsHash;
                    file.url = imageUrl;
                }
                return file;
            });

            imageType === IMAGE_TYPE.POSTER ? setPosterList(newFileList) : setIconList(newFileList);
        }
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

    return <>
        <div className={style.container}>
            <div className={style.form}>
                <div className={style.field}>
                    <div className={style.title}>upload icons</div>
                    <div className={style.content}>
                        <Upload
                            action={config.ipfs.upload}
                            multiple
                            beforeUpload={handleBeforeUpload(IMAGE_TYPE.ICON)}
                            onChange={handleUploadOnChange(IMAGE_TYPE.ICON)}
                            fileList={iconList}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </div>
                </div>

                <div className={style.field}>
                    <div className={style.title}>upload posters</div>
                    <div className={style.content}>
                        <Upload
                            action={config.ipfs.upload}
                            multiple
                            beforeUpload={handleBeforeUpload(IMAGE_TYPE.POSTER)}
                            onChange={handleUploadOnChange(IMAGE_TYPE.POSTER)}
                            fileList={posterList}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </div>
                </div>

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

            <div className={style.btnContainer}>
                <Button
                    onClick={() => {
                        setSecModal(true);
                    }}
                    disabled={!apiWs || !adConfigList.length}
                >Batch Create Ads</Button>
            </div>

            {adIds.length > 0 && <>
                <div className={style.tableContainer}>
                    <Table dataSource={adIds.map(id => ({id}))} columns={[{
                        title: 'Ad id',
                        dataIndex: 'id',
                        key: 'id',
                    },]} />;
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
