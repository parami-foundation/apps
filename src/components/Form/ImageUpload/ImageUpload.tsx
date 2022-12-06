import { Button, message, Upload } from 'antd';
import React, { useState } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';
import { IMAGE_TYPE } from '@/constants/advertisement';
import { compressImageFile } from '@/utils/advertisement.util';
import config from '@/config/config';
import { UploadOutlined } from '@ant-design/icons';

export interface ImageUploadProps {
    imageUrl?: string;
    onImageUrlChange: (imageUrl: string) => void;
    imageType: IMAGE_TYPE
}

const createUploadFiles = (url?: string) => {
    if (!url) {
        return [];
    }
    return [{
        uid: '-1',
        status: 'done',
        url
    }] as UploadFile[]
}

function ImageUpload({ imageUrl, onImageUrlChange, imageType }: ImageUploadProps) {
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>(createUploadFiles(imageUrl));

    const handleBeforeUpload = async (file) => {
        return await compressImageFile(file, imageType);
    }

    const handleUploadOnChange = (info) => {
        const { fileList } = info;

        if (info.file.status === 'done') {
            const ipfsHash = info.file.response.Hash;
            const imageUrl = config.ipfs.endpoint + ipfsHash;
            fileList[0].url = imageUrl;
            onImageUrlChange(imageUrl);
        }
        if (info.file.status === 'error') {
            message.error('Upload Image Error');
            onImageUrlChange('')
        }
        if (info.file.status === 'removed') {
            onImageUrlChange('')
        }
        setUploadFiles(fileList);
    }
    
    return <Upload
        multiple={false}
        showUploadList={{ showPreviewIcon: false }}
        fileList={uploadFiles}
        action={config.ipfs.upload}
        listType="picture"
        onChange={handleUploadOnChange}
        beforeUpload={handleBeforeUpload}
    >
        {uploadFiles.length === 0 && <Button icon={<UploadOutlined />}>Click to Upload</Button>}
    </Upload>
};

export default ImageUpload;
