import React, { useState } from 'react';
import style from './style.less';
import { useIntl } from 'umi';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Form, Input, notification } from 'antd';
import { PortNFT } from '@/services/parami/nft';
import { contractAddresses } from '../contract/config';

const ImportNFTModal: React.FC<{
    setImportModal: React.Dispatch<React.SetStateAction<boolean>>;
    password: string;
    keystore: string;
}> = ({ setImportModal, password, keystore }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const intl = useIntl();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);

        try {
            const events = await PortNFT(password, keystore, 'Rinkeby', contractAddresses.wrap[4], values.tokenID);
            console.log(events);

            setLoading(false);
            setImportModal(false);
            form.resetFields();
        } catch (e: any) {
            notification.error({
                message: e.message,
            });
            setLoading(false);
            return;
        }
    };

    return (
        <div className={style.importContainer}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                form={form}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Token ID"
                    name="tokenID"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Token ID!',
                        }
                    ]}
                >
                    <Input
                        size='large'
                        placeholder="Please input your Token ID"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        block
                        shape='round'
                        size='large'
                        type='primary'
                        htmlType='submit'
                        loading={loading}
                    >
                        {intl.formatMessage({
                            id: 'common.confirm',
                        })}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
};

const Import: React.FC<{
    importModal: boolean;
    setImportModal: React.Dispatch<React.SetStateAction<boolean>>;
    password: string;
    keystore: string;
}> = ({ importModal, setImportModal, password, keystore }) => {
    const intl = useIntl();

    return (
        <BigModal
            visable={importModal}
            title={intl.formatMessage({
                id: 'wallet.nfts.import',
            })}
            content={
                <ImportNFTModal
                    setImportModal={setImportModal}
                    password={password}
                    keystore={keystore}
                />
            }
            footer={false}
            close={() => { setImportModal(false) }}
        />
    )
};

export default Import;
