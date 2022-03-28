import React, { useState } from 'react';
import style from './style.less';
import { useIntl, useModel } from 'umi';
import BigModal from '@/components/ParamiModal/BigModal';
import { Button, Form, Input, Select, notification } from 'antd';
import { SiBinance, SiEthereum } from 'react-icons/si';
import { OriginContract, WrapContract } from '../contract/contract';
import { contractAddresses } from '../contract/config';
import { PortNFT } from '@/services/parami/nft';

const ImportNFTModal: React.FC<{
    setImportModal: React.Dispatch<React.SetStateAction<boolean>>;
    password: string;
    keystore: string;
}> = ({ setImportModal, password, keystore }) => {
    const { Signer, ChainId, connect } = useModel('web3');
    const [loading, setLoading] = useState<boolean>(false);

    const intl = useIntl();
    const { Option } = Select;
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        if (!Signer) {
            await connect();
            return;
        };

        try {
            const originContract = await OriginContract(values.namespace, Signer);
            await originContract?.approve(contractAddresses.wrap[ChainId], values.tokenID);
            const wrapContract = await WrapContract(ChainId, Signer);
            await wrapContract?.wrap(values.namespace, values.tokenID, null);

            const events = await PortNFT(password, keystore, values.network, values.namespace, values.tokenID);
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
                    label="Contract"
                    name="namespace"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Contract Address!',
                        }
                    ]}
                >
                    <Input
                        size='large'
                        placeholder="Please input your Contract Address"
                    />
                </Form.Item>
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
                <Form.Item
                    name="network"
                    label="Network"
                    rules={[
                        {
                            required: true,
                            message: 'Please select your network!',
                        }
                    ]}
                >
                    <Select
                        placeholder="Please select your network"
                        size='large'
                    >
                        <Option value="Ethereum">
                            <div className={style.networkSelect}>
                                <SiEthereum className={style.icon} />
                                Ethereum
                            </div>
                        </Option>
                        <Option value="Binance">
                            <div className={style.networkSelect}>
                                <SiBinance className={style.icon} />
                                Binance
                            </div>
                        </Option>
                    </Select>
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
