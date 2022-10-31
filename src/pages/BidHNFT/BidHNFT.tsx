import React, { useEffect, useState } from 'react';
import { useModel, useParams } from 'umi';
import { Button, Input, message, notification, Select, Tag, Upload, Typography, Image, Collapse, Card, Modal, Steps, Col, Row, InputNumber } from 'antd';
import FormFieldTitle from '@/components/FormFieldTitle';
import style from './BidHNFT.less';
import styles from '@/pages/wallet.less';
import { GetSimpleUserInfo } from '@/services/parami/RPC';
import config from '@/config/config';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { didToHex, hexToDid, parseAmount } from '@/utils/common';
import FormErrorMsg from '@/components/FormErrorMsg';
import CreateUserInstruction, { UserInstruction } from '../Dashboard/pages/Advertisement/Create/CreateUserInstruction/CreateUserInstruction';
import ParamiScoreTag from '../Creator/Explorer/components/ParamiScoreTag/ParamiScoreTag';
import ParamiScore from '../Creator/Explorer/components/ParamiScore/ParamiScore';
import { UserBidSlot, UserCreateAds } from '@/services/parami/Advertisement';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import AdvertisementPreview from '@/components/Advertisement/AdvertisementPreview/AdvertisementPreview';
import { uploadIPFS } from '@/services/parami/IPFS';
import { IMAGE_TYPE } from '@/constants/advertisement';
import { compressImageFile } from '@/utils/advertisement.util';
import { QueryAssetById } from '@/services/parami/HTTP';
import BidSection from './components/BidSection/BidSection';
import { Asset } from '@/services/parami/typings';

export interface BidHNFTProps { }

const NUM_BLOCKS_PER_DAY = 24 * 60 * 60 / 12;
const { Title } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { Step } = Steps;

const defaultInstruction: UserInstruction = {
    text: 'Follow Parami on Twitter',
    tag: 'Twitter',
    score: 1,
    link: 'https://twitter.com/intent/follow?screen_name=ParamiProtocol'
}

function BidHNFT({ }: BidHNFTProps) {
    const [sponsorName, setSponsorName] = useState<string>('');
    const [content, setContent] = useState<string>('View Ads. Get Paid.');
    const [userInfo, setUserInfo] = useState<{ nickname?: string; avatar?: string }>();
    const [iconUrl, setIconUrl] = useState<string>();
    const [posterUrl, setPosterUrl] = useState<string>();
    const { wallet } = useModel('currentUser');
    const apiWs = useModel('apiWs');
    const [instructions, setInstructions] = useState<UserInstruction[]>([defaultInstruction]);
    const [createInstructionModal, setCreateInstructionModal] = useState<boolean>(false);

    // advanced settings
    const [rewardRate, setRewardRate] = useState<number>(10);
    const [lifetime, setLifetime] = useState<number>(1 * NUM_BLOCKS_PER_DAY);
    const [payoutBase, setPayoutBase] = useState<number>(3);
    const [payoutMin, setPayoutMin] = useState<number>(1);
    const [payoutMax, setPayoutMax] = useState<number>(10);
    const [payoutMinError, setPayoutMinError] = useState<string>('');
    const [payoutMaxError, setPayoutMaxError] = useState<string>('');

    const [price, setPrice] = useState<number>();
    const [asset, setAsset] = useState<Asset>();
    const [passphrase, setPassphrase] = useState<string>('');
    const [adConfig, setAdConfig] = useState<any>();
    const [bidInProgress, setBidInProgress] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0);

    const [createAdSecModal, setCreateAdSecModal] = useState<boolean>(false);
    const [bidSecModal, setBidSecModal] = useState<boolean>(false);

    const [adId, setAdId] = useState<string>();

    const params: {
        nftId: string;
    } = useParams();

    const adPreviewData = {
        instructions,
        icon: iconUrl,
        sponsorName,
        poster: posterUrl,
        content,
        assetName: asset?.name,
    }

    const queryAsset = async (assetId: string) => {
        const { data } = await QueryAssetById(assetId);
        if (!data?.token) {
            notification.error({
                message: 'Loading Asset Error',
                description: `tokenAssetId: ${assetId}`
            });
            return;
        }
        setAsset(data.token);
    }

    useEffect(() => {
        if (apiWs && params.nftId) {
            queryAsset(params.nftId)
        }
    }, [apiWs, params]);

    useEffect(() => {
        if (apiWs && wallet.did) {
            GetSimpleUserInfo(wallet.did).then(userInfo => {
                setUserInfo(userInfo);
            });
        }
    }, [apiWs, wallet]);

    useEffect(() => {
        if (userInfo && wallet) {
            setSponsorName(userInfo.nickname?.toString() || hexToDid(wallet.did));

            if (userInfo.avatar && userInfo.avatar.startsWith('ipfs://')) {
                const hash = userInfo.avatar.substring(7);
                setIconUrl(config.ipfs.endpoint + hash);
            }
        }
    }, [userInfo, wallet]);

    const handleBeforeUpload = (imageType: IMAGE_TYPE) => {
        return async (file) => {
            return await compressImageFile(file, imageType);
        }
    }

    const handleUploadOnChange = (imageType: IMAGE_TYPE) => {
        return (info) => {
            if (info.file.status === 'done') {
                const ipfsHash = info.file.response.Hash;
                const imageUrl = config.ipfs.endpoint + ipfsHash;
                imageType === IMAGE_TYPE.POSTER ? setPosterUrl(imageUrl) : setIconUrl(imageUrl);
                return;
            }
            if (info.file.status === 'error') {
                message.error('Upload Image Error');
            }
        }
    }

    useEffect(() => {
        setPayoutMaxError('');
        setPayoutMinError('');
        if (payoutMax < payoutMin) {
            setPayoutMaxError('Payout Max cannot be less than Payout Min')
        }
    }, [payoutMax]);

    useEffect(() => {
        setPayoutMaxError('');
        setPayoutMinError('');
        if (payoutMin > payoutMax) {
            setPayoutMinError('Payout Min cannot be more than Payout Max')
        }
    }, [payoutMin]);

    const bidAd = async (preTx?: boolean, account?: string) => {
        try {
            const info: any = await UserBidSlot(adId!, params.nftId, parseAmount((price as number).toString()), passphrase, wallet?.keystore, preTx, account);
            if (preTx && account) {
                return info;
            }
            console.log('bid success');
            setBidInProgress(false);
            notification.success({
                message: 'Bid Success'
            });
            // todo: jump to ad page?
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
            setBidInProgress(false);
            return;
        }
    }

    const handleSubmit = async () => {
        setBidInProgress(true);
        const adConfig = await createAdConfig();
        setAdConfig(adConfig);
        setCreateAdSecModal(true);
    }

    const createAd = async (preTx?: boolean, account?: string) => {
        try {
            const info: any = await UserCreateAds(adConfig, passphrase, wallet?.keystore, preTx, account);
            // set loading false
            if (preTx && account) {
                console.log('preTx ', info);
                return info;
            }
            console.log('post tx', info);

            const adId = info.ad.Created[0][0];
            setAdId(adId);
            setStep(1);
            setBidSecModal(true);
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
            setBidInProgress(false);
            return;
        }
    }

    const createAdConfig = async () => {
        let adMetadata = {
            media: posterUrl,
            icon: iconUrl,
            content,
            instructions: instructions.map(ins => ({ ...ins, link: encodeURIComponent(ins.link ?? '') })),
            sponsorName
        };

        const bufferred = await Buffer.from(JSON.stringify(adMetadata));
        const { response, data } = await uploadIPFS(bufferred);
        if (!response.ok) {
            throw ('Create Metadata Error');
        }

        const metadataUrl = `ipfs://${data.Hash}`;
        const delegatedDidHex = didToHex(config.advertisement.defaultDelegatedDid);
        const allTags = Array.from(new Set([...instructions.map(ins => ins.tag).filter(Boolean)]));

        return {
            tags: allTags,
            metadata: metadataUrl,
            rewardRate: rewardRate.toString(),
            lifetime,
            payoutBase: parseAmount(payoutBase.toString()),
            payoutMin: parseAmount(payoutMin.toString()),
            payoutMax: parseAmount(payoutMax.toString()),
            delegatedAccount: delegatedDidHex
        }
    }

    return <>
        <div className={styles.mainTopContainer}>
            <div className={styles.pageContainer}>
                <div className={style.headerContainer}>
                    <div className={style.titleContainer}>
                        <Title
                            level={1}
                            className={style.sectionTitle}
                        >
                            <Image
                                src='/images/icon/vip.svg'
                                className={style.sectionIcon}
                                preview={false}
                            />
                            Bid on HNFT
                        </Title>
                    </div>
                    <div className={style.subtitle}>
                        Place your advertisement on {asset?.name}
                    </div>
                </div>

                <Row style={{ width: '100%' }} gutter={20}>
                    <Col span={12}>
                        <Card title="Config your Ad" className={styles.card}>
                            <div className={style.formContainer}>
                                <div className={style.field}>
                                    <div className={style.title}>
                                        <FormFieldTitle title={'Sponsor Name'} required />
                                    </div>
                                    <div className={style.value}>
                                        <Input
                                            size='large'
                                            value={sponsorName}
                                            onChange={(e) => setSponsorName(e.target.value)}
                                            placeholder='Advertisement Sponsor Name'
                                        />
                                    </div>
                                </div>
                                <div className={style.field}>
                                    <div className={style.title}>
                                        <FormFieldTitle title={'Content'} />
                                    </div>
                                    <div className={style.value}>
                                        <Input
                                            size='large'
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder='Advertisement Content'
                                        />
                                    </div>
                                </div>
                                <div className={style.field}>
                                    <div className={style.title}>
                                        <FormFieldTitle title={'Ad Icon'} required />
                                    </div>
                                    <div className={style.value}>
                                        <Upload
                                            showUploadList={false}
                                            action={config.ipfs.upload}
                                            onChange={handleUploadOnChange(IMAGE_TYPE.ICON)}
                                            beforeUpload={handleBeforeUpload(IMAGE_TYPE.ICON)}
                                        >
                                            {iconUrl
                                                ? <img src={iconUrl} style={{ width: '100%', maxWidth: '100px' }} />
                                                : <Button icon={<UploadOutlined />}>Click to Upload</Button>}
                                        </Upload>
                                    </div>
                                </div>
                                <div className={style.field}>
                                    <div className={style.title}>
                                        <FormFieldTitle title={'Poster'} required />
                                    </div>
                                    <div className={style.value}>
                                        <Upload
                                            showUploadList={false}
                                            action={config.ipfs.upload}
                                            onChange={handleUploadOnChange(IMAGE_TYPE.POSTER)}
                                            beforeUpload={handleBeforeUpload(IMAGE_TYPE.POSTER)}
                                        >
                                            {posterUrl
                                                ? <img src={posterUrl} style={{ width: '100%', maxWidth: '400px' }} />
                                                : <Button icon={<UploadOutlined />}>Click to Upload</Button>}
                                        </Upload>
                                    </div>
                                </div>

                                <div className={style.field}>
                                    <div className={style.title}>
                                        <FormFieldTitle title="instructions" required />
                                    </div>
                                    <div className={style.value}>
                                        <Button onClick={() => setCreateInstructionModal(true)}>Add New Instruction</Button>
                                    </div>
                                </div>
                                {instructions.length > 0 &&
                                    <div className={style.field}>
                                        {instructions.map(instruction => <p>
                                            <Tag closable onClose={(e) => {
                                                e.preventDefault();
                                                setInstructions(instructions.filter(ins => ins !== instruction))
                                            }}>
                                                {instruction.text}
                                                {!!instruction.tag && <ParamiScoreTag tag={instruction.tag} />}
                                                {!!instruction.score && <ParamiScore score={instruction.score} />}
                                                {!!instruction.link && <a href={instruction.link} target="_blank">(link)</a>}
                                            </Tag>
                                        </p>)}
                                    </div>
                                }

                                <Collapse ghost>
                                    <Panel header="Advanced Settings" key="1">
                                        <div className={style.field}>
                                            <div className={style.title}>
                                                <FormFieldTitle title={'Reward Rate'} required />
                                            </div>
                                            <div className={style.value}>
                                                <InputNumber
                                                    className={style.withAfterInput}
                                                    placeholder="0.00"
                                                    size='large'
                                                    maxLength={18}
                                                    min={0}
                                                    onChange={(value) => setRewardRate(value)}
                                                    value={rewardRate}
                                                />
                                                <span className={style.fieldInfo}>Referrer gets {rewardRate}% from each referral.</span>
                                            </div>
                                        </div>
                                        <div className={style.field}>
                                            <div className={style.title}>
                                                <FormFieldTitle title={'lifetime'} required />
                                            </div>
                                            <div className={style.value}>
                                                <Select
                                                    size='large'
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    placeholder={'Please select a lifetime'}
                                                    onChange={(value) => {
                                                        setLifetime(Number(value));
                                                    }}
                                                    value={lifetime}
                                                >
                                                    <Option value={1 * NUM_BLOCKS_PER_DAY}>
                                                        1 day
                                                    </Option>
                                                    <Option value={3 * NUM_BLOCKS_PER_DAY}>
                                                        3 days
                                                    </Option>
                                                    <Option value={7 * NUM_BLOCKS_PER_DAY}>
                                                        7 days
                                                    </Option>
                                                    <Option value={15 * NUM_BLOCKS_PER_DAY}>
                                                        15 days
                                                    </Option>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className={style.field}>
                                            <div className={style.title}>
                                                <FormFieldTitle title={'Payout Base'} required />
                                            </div>
                                            <div className={style.value}>
                                                <InputNumber
                                                    className={style.withAfterInput}
                                                    placeholder="0.00"
                                                    size='large'
                                                    value={payoutBase}
                                                    maxLength={18}
                                                    min={0}
                                                    onChange={(value) => setPayoutBase(value)}
                                                />
                                            </div>
                                        </div>
                                        <div className={style.field}>
                                            <div className={style.title}>
                                                <FormFieldTitle title={'Payout Min'} required />
                                            </div>
                                            <div className={style.value}>
                                                <InputNumber
                                                    className={`${style.withAfterInput} ${payoutMinError ? style.inputError : ''}`}
                                                    placeholder="0.00"
                                                    size='large'
                                                    maxLength={18}
                                                    min={0}
                                                    max={payoutMax}
                                                    value={payoutMin}
                                                    onChange={(value) => setPayoutMin(value)}
                                                />
                                                {payoutMinError && <FormErrorMsg msg={payoutMinError} />}
                                            </div>
                                        </div>
                                        <div className={style.field}>
                                            <div className={style.title}>
                                                <FormFieldTitle title={'Payout Max'} required />
                                            </div>
                                            <div className={style.value}>
                                                <InputNumber
                                                    className={`${style.withAfterInput} ${payoutMaxError ? style.inputError : ''}`}
                                                    placeholder="0.00"
                                                    size='large'
                                                    maxLength={18}
                                                    value={payoutMax}
                                                    min={payoutMin}
                                                    onChange={(value) => setPayoutMax(value)}
                                                />
                                                {payoutMaxError && <FormErrorMsg msg={payoutMaxError} />}
                                            </div>
                                        </div>
                                    </Panel>
                                </Collapse>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Ad Preview" className={styles.card}>
                            <div className={style.previewContainer}>
                                <AdvertisementPreview ad={adPreviewData} kolIcon={asset?.icon}></AdvertisementPreview>
                            </div>
                        </Card>

                        <Card title="Bid your price" className={styles.card} style={{ marginTop: '20px' }}>
                            <BidSection asset={asset} onBid={(price) => {
                                setPrice(price);
                                handleSubmit();
                            }}></BidSection>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>

        {createInstructionModal && <>
            <CreateUserInstruction
                onCancel={() => setCreateInstructionModal(false)}
                onCreateInstruction={newInstruction => {
                    setInstructions([...instructions, newInstruction]);
                    setCreateInstructionModal(false);
                }}
            ></CreateUserInstruction>
        </>}

        <SecurityModal
            visable={createAdSecModal}
            setVisable={setCreateAdSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={createAd}
        />

        <SecurityModal
            visable={bidSecModal}
            setVisable={setBidSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={bidAd}
        />

        {bidInProgress && <>
            <Modal
                title="Bid Advertisement"
                visible
                closable={false}
                footer={null}
            >
                <Steps direction="vertical" size="default" current={step} className={style.stepContainer}>
                    <Step title="Generate Advertisement" icon={step === 0 ? <LoadingOutlined /> : false} />
                    <Step title="Bid Advertisement on HNFT" icon={step === 1 ? <LoadingOutlined /> : false} />
                    <Step title="Completing" icon={step === 2 ? <LoadingOutlined /> : false} />
                </Steps>
            </Modal>
        </>}
    </>;
};

export default BidHNFT;
