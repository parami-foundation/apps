import React, { useEffect, useState } from 'react';
import { useModel, useParams } from 'umi';
import { Button, Input, message, notification, Select, Tag, Upload, Typography, Image, Collapse, Card } from 'antd';
import FormFieldTitle from '@/components/FormFieldTitle';
import style from './BidHNFT.less';
import styles from '@/pages/wallet.less';
import { DrylyBuyToken, DrylySellToken, GetSimpleUserInfo } from '@/services/parami/RPC';
import config from '@/config/config';
import { UploadOutlined } from '@ant-design/icons';
import { hexToDid, parseAmount, stringToBigInt } from '@/utils/common';
import FormErrorMsg from '@/components/FormErrorMsg';
import CreateUserInstruction, { UserInstruction } from '../Dashboard/pages/Advertisement/Create/CreateUserInstruction/CreateUserInstruction';
import ParamiScoreTag from '../Creator/Explorer/components/ParamiScoreTag/ParamiScoreTag';
import ParamiScore from '../Creator/Explorer/components/ParamiScore/ParamiScore';
import { deleteComma } from '@/utils/format';
import { BigIntToFloatString, FloatStringToBigInt } from '@/utils/format';
import { Asset, GetAssetInfo, GetBalanceOfBudgetPot } from '@/services/parami/Assets';
import AD3 from '@/components/Token/AD3';
import Token from '@/components/Token/Token';
import { GetSlotOfNft } from '@/services/parami/Advertisement';
import { formatBalance } from '@polkadot/util';
import { BuyToken } from '@/services/parami/Swap';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import AdvertisementPreview from '@/components/Advertisement/AdvertisementPreview/AdvertisementPreview';

export interface BidHNFTProps { }

const NUM_BLOCKS_PER_DAY = 24 * 60 * 60 / 12;
const { Title } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

enum IMAGE_TYPE {
    ICON = 'icon',
    POSTER = 'poster'
}

const defaultInstruction: UserInstruction = {
    text: 'Follow Parami on Twitter',
    tag: 'Twitter',
    score: 1,
    link: 'https://twitter.com/intent/follow?screen_name=ParamiProtocol'
}

function BidHNFT({ }: BidHNFTProps) {
    const [sponsorName, setSponsorName] = useState<string>('');
    const [content, setContent] = useState<string>('');
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

    // bid ad
    const [currentPrice, setCurrentPrice] = useState<string>('');
    const [price, setPrice] = useState<number>();
    const [priceErrorMsg, setPriceErrorMsg] = useState<string>();
    const minPrice = Math.max(Number(BigIntToFloatString(deleteComma(currentPrice), 18)) * 1.2, 1);
    const { balance } = useModel('balance');
    const [asset, setAsset] = useState<Asset>();
    const [assetPrice, setAssetPrice] = useState<string>();
    const [assetBalance, setAssetBalance] = useState<string>('');
    const [showSwap, setShowSwap] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');

    const [secModal, setSecModal] = useState<boolean>(false);

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

    const getCurrentBudgetBalance = async (nftId: string) => {
        const slot = await GetSlotOfNft(nftId);

        if (!slot) {
            return '0';
        }

        const budget = await GetBalanceOfBudgetPot(slot.budgetPot, slot.fractionId);
        if (!budget) {
            return '0';
        }

        return deleteComma(budget.balance);
    }

    const queryAsset = async (assetId: string) => {
        const assetData = await GetAssetInfo(assetId);
        if (assetData.isEmpty) {
            notification.error({
                message: 'Loading Asset Error',
                description: `tokenAssetId: ${assetId}`
            });
            return;
        }

        const assetInfo = assetData.toHuman() as Asset;
        setAsset(assetInfo);

        const value = await DrylySellToken(assetId, parseAmount('1'));
        setAssetPrice(value.toString());

        const accountRes: any = await apiWs!.query.assets.account(Number(assetId), wallet.account);
        const { balance } = accountRes.toHuman() ?? { balance: '' };
        setAssetBalance(deleteComma(balance));

        const budgetBalance = await getCurrentBudgetBalance(assetId);
        setCurrentPrice(budgetBalance);
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
        if (userInfo) {
            if (wallet) {
                setSponsorName(userInfo.nickname?.toString() || hexToDid(wallet.did));
            }

            if (userInfo.avatar && userInfo.avatar.startsWith('ipfs://')) {
                const hash = userInfo.avatar.substring(7);
                setIconUrl(config.ipfs.endpoint + hash);
            }
        }
    }, [userInfo, wallet]);

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

    useEffect(() => {
        setPriceErrorMsg('');
        setShowSwap(false);
        if (price !== undefined) {
            if (price < minPrice) {
                setPriceErrorMsg('price too low');
            } else if (FloatStringToBigInt(`${price}`, 18) > stringToBigInt(assetBalance)) {
                setPriceErrorMsg('Insufficient Balance, please swap more token');
                setShowSwap(true);
            }
        }
    }, [price]);

    // const trySwapToken = async () => {
    //     const tokenNumber = (FloatStringToBigInt(`${price}`, 18) - stringToBigInt(assetBalance)).toString();
    //     const ad3Number = await DrylyBuyToken(params?.nftId, tokenNumber);

    //     console.log('token number', tokenNumber);
    //     console.log('ad3 number', ad3Number);
    // }

    const swapMoreToken = async (preTx?: boolean, account?: string) => {
        // todo: set swap loading true
        try {
            // calculate token amount and ad3 amount
            const tokenNumber = (FloatStringToBigInt(`${price}`, 18) - stringToBigInt(assetBalance)).toString();
            const ad3Number = await DrylyBuyToken(params?.nftId, tokenNumber);

            console.log('token number', tokenNumber);
            console.log('ad3 number', ad3Number);

            const info: any = await BuyToken(params?.nftId, tokenNumber, ad3Number, passphrase, wallet?.keystore, preTx, account);
            
            // todo:set swap loading false
            if (preTx && account) {
                return info;
            }
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
            // set swap loading false
            // setLoading(false);
            return;
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
                        some sub title
                    </div>
                </div>

                <div className={style.formContainer}>
                    <Card title="Config your Ad">
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
                                        <Input
                                            className={style.withAfterInput}
                                            placeholder="0.00"
                                            size='large'
                                            type='number'
                                            maxLength={18}
                                            min={0}
                                            onChange={(e) => setRewardRate(Number(e.target.value))}
                                            suffix="%"
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
                                        <Input
                                            className={style.withAfterInput}
                                            placeholder="0.00"
                                            size='large'
                                            type='number'
                                            value={payoutBase}
                                            maxLength={18}
                                            min={0}
                                            onChange={(e) => setPayoutBase(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div className={style.field}>
                                    <div className={style.title}>
                                        <FormFieldTitle title={'Payout Min'} required />
                                    </div>
                                    <div className={style.value}>
                                        <Input
                                            className={`${style.withAfterInput} ${payoutMinError ? style.inputError : ''}`}
                                            placeholder="0.00"
                                            size='large'
                                            type='number'
                                            maxLength={18}
                                            min={0}
                                            max={payoutMax}
                                            value={payoutMin}
                                            onChange={(e) => setPayoutMin(Number(e.target.value))}
                                        />
                                        {payoutMinError && <FormErrorMsg msg={payoutMinError} />}
                                    </div>
                                </div>
                                <div className={style.field}>
                                    <div className={style.title}>
                                        <FormFieldTitle title={'Payout Max'} required />
                                    </div>
                                    <div className={style.value}>
                                        <Input
                                            className={`${style.withAfterInput} ${payoutMaxError ? style.inputError : ''}`}
                                            placeholder="0.00"
                                            size='large'
                                            type='number'
                                            maxLength={18}
                                            value={payoutMax}
                                            min={payoutMin}
                                            onChange={(e) => setPayoutMax(Number(e.target.value))}
                                        />
                                        {payoutMaxError && <FormErrorMsg msg={payoutMaxError} />}
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                    </Card>

                    <Card title="Ad Preview">
                        <AdvertisementPreview ad={adPreviewData} avatarSrc={iconUrl}></AdvertisementPreview>
                    </Card>

                    <Card title="Bid your price">
                        <div className={style.field}>
                            <div className={style.title}>
                                <FormFieldTitle title={'Current Price'} />
                            </div>
                            <div className={style.value}>
                                {`${formatBalance(currentPrice, { decimals: 18 })}`}
                            </div>
                        </div>

                        <div className={style.field}>
                            <div className={style.title}>
                                <FormFieldTitle title={'Offer a price'} required />
                                <br />
                                <small>
                                    {`The bid must be higher than ${minPrice} (20% higher than the current price)`}
                                </small>
                            </div>
                            <div className={style.value}>
                                <Input
                                    value={price}
                                    className={`${style.withAfterInput} ${priceErrorMsg ? style.inputError : ''}`}
                                    size='large'
                                    type='number'
                                    min={minPrice ? minPrice : 0}
                                    onChange={(e) => {
                                        setPrice(Number(e.target.value));
                                    }}
                                />
                                {priceErrorMsg && <FormErrorMsg msg={priceErrorMsg} />}
                            </div>
                        </div>
                        <div className={style.field}>
                            <span>available tokens: <Token value={assetBalance ?? ''} symbol={asset?.symbol} /></span>
                            <span>available ad3: <AD3 value={balance?.free} /></span>
                        </div>
                        {showSwap && <>
                            <div className={style.field}>
                                <Button onClick={() => {
                                    setSecModal(true);
                                }}>Swap more {asset?.symbol}</Button>
                            </div>
                        </>}

                    </Card>

                    <div
                        className={style.field}
                        style={{
                            marginTop: 50
                        }}
                    >
                        <Button
                            block
                            size='large'
                            shape='round'
                            type='primary'
                            disabled={false}
                            loading={false}
                            onClick={() => {
                                console.log('submit')
                            }}
                        >
                            submit
                        </Button>
                    </div>
                </div>
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
            visable={secModal}
            setVisable={setSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={swapMoreToken}
        />
    </>;
};

export default BidHNFT;
