import { parseUrlParams } from '@/utils/url.util';
import React, { useEffect, useState } from 'react';
import style from './IPO.less';
import styles from '@/pages/wallet.less';
import { history, useModel } from 'umi';
import { Col, Row, Typography, Image, Card, Button, Input, notification, Descriptions, Progress, Spin } from 'antd';
import { ClaimTokens, ParticipateIPO, QueryIcoMetadata } from '@/services/parami/NFT';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import AD3 from '@/components/Token/AD3';
import { hexToDid, parseAmount } from '@/utils/common';
import { BigIntToFloatString, deleteComma } from '@/utils/format';
import { FloatStringToBigInt } from '@/utils/format';
import Token from '@/components/Token/Token';
import { GetClaimInfo } from '@/services/parami/RPC';
import { retrieveOpenseaAsset } from '@/services/parami/HTTP';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
const { Title } = Typography;

export interface IPOProps { }

function IPO({ }: IPOProps) {
    const [nftId, setNftId] = useState<string>();
    const { balance } = useModel('balance');
    const [loading, setLoading] = useState<boolean>(false);
    const { wallet } = useModel('currentUser');
    const apiWs = useModel('apiWs');
    const [passphrase, setPassphrase] = useState<string>('');
    const [depositeSecModal, setDepositeSecModal] = useState<boolean>(false);
    const [claimSecModal, setClaimSecModal] = useState<boolean>(false);
    const [ad3Amount, setAd3Amount] = useState<string>('');
    const [ipo, setIPO] = useState<any>(); // todo: type this...
    const [claimInfo, setClaimInfo] = useState<any>();
    const [purchaseAmount, setPurchaseAmount] = useState<string>('');

    useEffect(() => {
        const params = parseUrlParams() as { nftId: string };
        if (params.nftId) {
            setNftId(params.nftId);
        } else {
            history.push('/wallet');
        }
    }, []);

    const queryIpoData = async (nftId: string) => {
        const icoMetadata = await QueryIcoMetadata(nftId);
        if (!icoMetadata) {
            setIPO({});
            return;
        }

        const nftExternalRes = await apiWs!.query.nft.external(nftId);
        const nftExternal = nftExternalRes.toHuman() as any;

        const osNFT = await retrieveOpenseaAsset(nftExternal.namespace, parseInt(nftExternal.token));

        const assetMetadata = (await apiWs!.query.assets.metadata(nftId)).toHuman() as any;
        const assetInfo = (await apiWs!.query.assets.asset(nftId)).toHuman() as any;
        const totalSupply = BigIntToFloatString(deleteComma(assetInfo.supply), 18);

        const nftMetadata = (await apiWs!.query.nft.metadata(nftId)).toHuman() as any;

        const expectedAD3Amount = BigIntToFloatString(icoMetadata.expectedCurrency, 18);
        const offeredTokens = BigIntToFloatString(icoMetadata.offeredTokens, 18);
        const price = FloatStringToBigInt(expectedAD3Amount, 18) * BigInt(10 ** 18) / FloatStringToBigInt(offeredTokens, 18);
        const totalDeposit = (await apiWs!.query.nft.deposit(nftId)).toHuman() as string;
        const ad3Received = BigIntToFloatString(deleteComma(totalDeposit), 18);
        const progressPercent = (parseFloat(ad3Received) * 100 / parseFloat(expectedAD3Amount)).toFixed(1);

        const userDepositeRes = await apiWs!.query.nft.deposits(nftId, wallet.did);

        setIPO({
            name: assetMetadata.name,
            symbol: assetMetadata.symbol,
            totalSupply,
            ownerDid: hexToDid(nftMetadata.owner),
            nftImageUrl: osNFT?.image_url ?? '/images/logo-square-core.svg',
            offeredTokens,
            ad3Received,
            price,
            progressPercent,
            expectedAD3Amount,
            complete: (parseFloat(progressPercent) >= 100),
            ended: icoMetadata.done,
            userDepositAd3Amount: userDepositeRes.isEmpty ? '0' : deleteComma(userDepositeRes.toHuman() as string)
        })
    }

    const queryClaimInfo = async (nftId: string) => {
        try {
            const claimInfo = await GetClaimInfo(wallet.did, nftId);
            const [total, totalUnlocked, canClaim] = claimInfo;
            const claimed = (BigInt(totalUnlocked) - BigInt(canClaim)).toString();
            const locked = (BigInt(total) - BigInt(totalUnlocked)).toString();
            const claimableIntString = BigIntToFloatString(canClaim, 18);
            setClaimInfo({
                total,
                totalUnlocked,
                claimed,
                canClaim,
                claimableIntString,
                locked
            });
        } catch (e) {
            console.log('get claim info error', e)
            setClaimInfo({})
        }
    }

    useEffect(() => {
        if (purchaseAmount && ipo) {
            const ad3Amount = ((FloatStringToBigInt(purchaseAmount, 18) / BigInt(ipo.offeredTokens)) * BigInt(ipo.expectedAD3Amount)).toString();
            setAd3Amount(ad3Amount);
        }
    }, [purchaseAmount, ipo]);

    useEffect(() => {
        if (nftId && apiWs) {
            queryIpoData(nftId);
            queryClaimInfo(nftId);
        }
    }, [nftId, apiWs])

    const handleDeposite = async (preTx?: boolean, account?: string) => {
        setLoading(true);
        try {
            const info = await ParticipateIPO(nftId!, parseAmount(purchaseAmount!), passphrase, wallet?.keystore, preTx, account);
            if (preTx && account) {
                return info
            }
            setLoading(false);
            queryIpoData(nftId!);
        } catch (e: any) {
            notification.error({
                message: e.message,
                duration: null,
            });
            setLoading(false);
        }
    }

    const handleClaim = async (preTx?: boolean, account?: string) => {
        setLoading(true);
        try {
            const info = await ClaimTokens(nftId!, passphrase, wallet?.keystore, preTx, account);
            if (preTx && account) {
                return info
            }
            setLoading(false);
            queryClaimInfo(nftId!);
        } catch (e: any) {
            notification.error({
                message: e.message,
                duration: null,
            });
            setLoading(false);
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
                                src='/images/icon/stake.svg'
                                className={style.sectionIcon}
                                preview={false}
                            />
                            Initial NFT Power Offering
                        </Title>
                    </div>
                    <div className={style.subtitle}>
                        Purchase NFT Power with AD3
                    </div>
                </div>

                <Spin spinning={!ipo}>
                    {ipo && <>
                        <Row>
                            <Col span={6}>
                                <Image src={ipo.nftImageUrl} className={style.nftImage} preview={false}></Image>
                            </Col>
                            <Col span={18}>
                                <div className={style.ipoInfo}>
                                    <Descriptions title={
                                        <>
                                            <div className={style.ipoTitle}>
                                                <span className={style.ipoName}>{ipo.name} NFT Power</span>
                                                {!ipo.complete && !ipo.ended && <>
                                                    <span className={`${style.ipoStatus} ${style.active}`}>
                                                        <ClockCircleOutlined />
                                                        {' Active'}
                                                    </span>
                                                </>}
                                                {ipo.complete || ipo.ended && <>
                                                    <span className={`${style.ipoStatus} ${style.finished}`}>
                                                        <CheckCircleOutlined />
                                                        {' Finished'}
                                                    </span>
                                                </>}
                                            </div>
                                        </>
                                    } className={style.ipoDescription}>
                                        <Descriptions.Item label='HNFT owner' span={3}>{ipo.ownerDid}</Descriptions.Item>
                                        <Descriptions.Item label='Total supply'>
                                            {ipo.totalSupply} ${ipo.symbol}
                                        </Descriptions.Item>
                                        <Descriptions.Item label='Tokens for sale'>
                                            {ipo.offeredTokens} ${ipo.symbol}
                                        </Descriptions.Item>
                                        <Descriptions.Item label='Total AD3 amount'>
                                            {ipo.expectedAD3Amount} $AD3
                                        </Descriptions.Item>
                                        <Descriptions.Item label='Price' span={2}>
                                            <Token value={FloatStringToBigInt('1', 18).toString()} symbol={ipo?.symbol} />
                                            <span>≈</span>
                                            <AD3 value={ipo.price ?? ''} />
                                        </Descriptions.Item>
                                    </Descriptions>

                                    <div className={style.ipoProgress}>
                                        <div className={style.progressText}>
                                            {ipo.ad3Received} / {ipo.expectedAD3Amount} AD3 Received
                                        </div>
                                        <Progress percent={ipo.progressPercent} strokeColor="#ff5b00" />
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row style={{ width: '100%', marginTop: '30px' }}>
                            <Col span={12} style={{ paddingRight: '30px' }}>
                                <Card className={styles.card} title="Purchase">
                                    <div className={style.field}>
                                        <div className={style.label}>
                                            <span>Token Amount</span>
                                        </div>
                                        <div className={style.value}>
                                            <Input
                                                autoFocus
                                                size='large'
                                                type='number'
                                                min={0}
                                                disabled={ipo.complete || ipo.ended}
                                                placeholder={`Enter an amount of $${ipo?.symbol}`}
                                                className={style.input}
                                                value={purchaseAmount}
                                                onChange={e => setPurchaseAmount(e.target.value)}
                                            ></Input>
                                        </div>
                                    </div>

                                    {!!purchaseAmount && <>
                                        <div className={style.field}>
                                            <div className={style.label}>
                                                <div>You pay</div>
                                                <div>
                                                    <AD3 value={ad3Amount}></AD3>
                                                    <span> (available: <AD3 value={balance?.free}></AD3>)</span>
                                                </div>
                                            </div>
                                            <div className={style.label}>
                                                <div>You get</div>
                                                <div>
                                                    <Token value={parseAmount(purchaseAmount)} symbol={ipo?.symbol}></Token>
                                                </div>
                                            </div>
                                        </div>
                                    </>}

                                    <div className={style.buttons}>
                                        <Button
                                            block
                                            type='primary'
                                            shape='round'
                                            size='middle'
                                            loading={loading}
                                            disabled={!ad3Amount || ipo.complete || ipo.ended}
                                            onClick={(e) => {
                                                setDepositeSecModal(true)
                                            }}
                                        >
                                            Purchase
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card className={styles.card} title="Tokens">
                                    <div className={style.field}>
                                        <div className={style.label}>
                                            <div>Your deposit</div>
                                            <div>
                                                <AD3 value={ipo.userDepositAd3Amount}></AD3>
                                            </div>
                                        </div>
                                    </div>

                                    {!ipo.ended && <>
                                        <div>You will be able to claim your tokens after IPO ends.</div>
                                    </>}

                                    {ipo.ended && <>
                                        <Spin spinning={!claimInfo}>
                                            {claimInfo && <>
                                                {claimInfo.total && <>
                                                    <div className={style.field}>
                                                        <div className={style.label}>
                                                            <div>Total amount</div>
                                                            <div>
                                                                <Token value={claimInfo.total} symbol={ipo?.symbol}></Token>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={style.field}>
                                                        <div className={style.label}>
                                                            <div>Total claimed</div>
                                                            <div>
                                                                <Token value={claimInfo.claimed} symbol={ipo?.symbol}></Token>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={style.field}>
                                                        <div className={style.label}>
                                                            <div>Locked</div>
                                                            <div>
                                                                <Token value={claimInfo.locked} symbol={ipo?.symbol}></Token>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={style.field}>
                                                        <div className={style.label}>
                                                            <div>Claimable</div>
                                                        </div>
                                                        <div className={style.value}>
                                                            <Input
                                                                disabled
                                                                size='large'
                                                                className={style.input}
                                                                value={claimInfo.claimableIntString}
                                                            ></Input>
                                                        </div>
                                                    </div>
                                                    <div className={style.buttons}>
                                                        <Button
                                                            block
                                                            type='primary'
                                                            shape='round'
                                                            size='middle'
                                                            loading={loading}
                                                            disabled={!claimInfo.claimableIntString}
                                                            onClick={(e) => {
                                                                setClaimSecModal(true);
                                                            }}
                                                        >
                                                            Claim
                                                        </Button>
                                                    </div>
                                                </>}
                                            </>}
                                        </Spin>
                                    </>}
                                </Card>
                            </Col>
                        </Row>
                    </>}
                </Spin>
            </div>
        </div>

        <SecurityModal
            visable={depositeSecModal}
            setVisable={setDepositeSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={handleDeposite}
        />

        <SecurityModal
            visable={claimSecModal}
            setVisable={setClaimSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={handleClaim}
        />
    </>;
};

export default IPO;
