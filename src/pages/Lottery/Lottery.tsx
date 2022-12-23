import Footer from '@/components/Footer';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import Token from '@/components/Token/Token';
import { POST_MESSAGE_PREFIX } from '@/config/constant';
import { GetBalanceOfAsset } from '@/services/parami/Assets';
import { ClockInData, QueryLotteryMetadata, QueryUserLotteryStatus, UserClockIn, UserLotteryStatus } from '@/services/parami/ClockIn.service';
import { QueryAssetById } from '@/services/parami/HTTP';
import { Asset } from '@/services/parami/typings';
import { getNumberOfHolders } from '@/services/subquery/subquery';
import { parseUrlParams } from '@/utils/url.util';
import { ArrowLeftOutlined, GiftOutlined, LockFilled, ShareAltOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, notification, Steps } from 'antd';
import copy from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import style from './Lottery.less';

const { Step } = Steps;

export interface LotteryProps { }

function Lottery({ }: LotteryProps) {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const [passphrase, setPassphrase] = useState<string>('');
    const [nftId, setNftId] = useState<string>();
    const [lottery, setLottery] = useState<ClockInData | null>();
    const [userLotterStatus, setUserLotteryStatus] = useState<UserLotteryStatus>();
    const [asset, setAsset] = useState<Asset>();
    const [numHolders, setNumHolders] = useState<number>();
    const [balance, setBalance] = useState<string>();
    const [userLevel, setUserLevel] = useState<{ levelIndex?: number; probability?: string }>({});
    const [claiming, setClaiming] = useState<boolean>(false);
    const [secModal, setSecModal] = useState<boolean>(false);

    useEffect(() => {
        const params = parseUrlParams() as { nftId: string };
        if (params.nftId) {
            setNftId(params.nftId);
        }
    })

    const refreshUserStatus = async () => {
        const status = await QueryUserLotteryStatus(nftId!, wallet.did);
        setUserLotteryStatus(status);
    }

    useEffect(() => {
        if (nftId && wallet && apiWs) {
            QueryLotteryMetadata(nftId).then(res => setLottery(res));

            QueryAssetById(nftId).then(({ data }) => {
                if (data.token) {
                    setAsset(data.token);
                }
            })

            getNumberOfHolders(nftId).then(num => setNumHolders(num));

            GetBalanceOfAsset(nftId, wallet.account).then(balance => setBalance(balance || '0'));

            refreshUserStatus();
        }
    }, [apiWs, nftId, wallet])

    useEffect(() => {
        if (lottery && balance) {
            let levelIndex = 0;
            (lottery.levelUpperBounds ?? []).forEach(endpoint => {
                if (BigInt(balance) > BigInt(endpoint)) {
                    levelIndex++;
                }
            })

            setUserLevel({
                probability: `${lottery.levelProbability[levelIndex]}%`,
                levelIndex
            })
        }
    }, [lottery, balance])

    const claim = async (preTx?: boolean, account?: string) => {
        try {
            const info: any = await UserClockIn(lottery!.nftId, passphrase, wallet?.keystore, preTx, account);

            if (preTx && account) {
                return info;
            }

            if (info?.assets?.Transferred?.length) {
                notification.success({
                    message: 'Congratulations, You Won!',
                    description: 'Come back and try again tomorrow!'
                })
            } else {
                notification.open({
                    message: 'Better luck next time!',
                    description: 'Come back and try again tomorrow!'
                })
            }
            
            refreshUserStatus();
            setClaiming(false);

            if (window.opener) {
                window.opener.postMessage(`${POST_MESSAGE_PREFIX.AD_CLAIMED}:${nftId}`, '*');
            }
        } catch (e: any) {
            notification.error({
                message: e.message || e,
                duration: null,
            });
            setClaiming(false);
        }
    }

    const handleShare = async () => {
        const link = `${window.location.origin}/lottery/?nftId=${nftId}`;
        const text = `Try your luck and win ${asset?.name} NFT powers everyday!`;

        const shareData = {
            title: 'Para Metaverse Identity',
            text,
            url: link,
        };
        if (navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (e) {
                console.log(e);
            }
        } else {
            copy(link + ` ${text}`);
            notification.success({
                message: 'Referral link copied!'
            })
        }
    }

    return <>
        <div className={style.lotteryContainer}>
            <div className={style.title}>
                Daily Lotto
            </div>
            <div className={style.subTitle}>Win NFT powers everyday!</div>
            <div className={style.lotterySection}>
                <div className={style.daoInfo}>
                    <img referrerPolicy='no-referrer' className={style.icon} src={asset?.icon}></img>
                    <div className={style.daoToken}>
                        {asset?.name} NFT Power
                    </div>
                    <div className={style.daoHolderNumber}>
                        {numHolders} holders
                    </div>
                </div>
                {!lottery?.nftId && <>
                    <div className={style.inactive}>Daily Lotto is not enabled for {asset?.name} NFT Power</div>
                </>}
                {!!lottery?.nftId && <>
                    <div className={style.winningInfo}>
                        <div>
                            You have
                            <span className={style.userProbability}>{userLevel?.probability}</span>
                            chance of winning
                            <span className={style.winningAward}>
                                <Token value={lottery.awardPerShare} symbol={asset?.symbol}></Token>
                            </span>
                            once a day!
                        </div>
                        <div className={style.hint}>
                            Hold more {asset?.name} NFT power to increase your winning chance!
                        </div>
                    </div>
                    <div className={style.levels}>
                        <Steps
                            direction="vertical"
                        >
                            {lottery.levelProbability.map((probability, index) => {
                                return <Step
                                    status='finish'
                                    key={index}
                                    title={<>
                                        {index === 0 && <>Base level</>}
                                        {index > 0 && <>
                                            <Token value={lottery.levelUpperBounds[index - 1]} symbol={asset?.symbol}></Token>
                                        </>}
                                    </>}
                                    icon={
                                        <>
                                            <div className={style[`levelColor${index}`]}>
                                                {userLevel.levelIndex >= index ? <UnlockOutlined /> : <LockFilled />}
                                            </div>
                                        </>
                                    }
                                    description={<>
                                        <div className={`${style[`levelColor${index}`]} ${style[`levelFont${index}`]}`}>
                                            {`${probability}% chance of winning`}
                                        </div>
                                    </>}
                                    subTitle={userLevel.levelIndex === index && <>
                                        <div className={style.userBalance}>
                                            <span className={style.arrow}>
                                                <ArrowLeftOutlined />
                                            </span>
                                            You have <Token value={balance || ''} symbol={asset?.symbol}></Token>
                                        </div>
                                    </>}
                                ></Step>
                            })}
                        </Steps>
                    </div>

                    <div className={style.btnContainer}>
                        {userLotterStatus?.claimable && <>
                            <Button
                                className={style.actionBtn}
                                block
                                type='primary'
                                shape='round'
                                size='large'
                                icon={<GiftOutlined />}
                                loading={claiming}
                                onClick={() => {
                                    setSecModal(true);
                                }}
                            >I'm Feeling Lucky</Button>
                        </>}
                        {!userLotterStatus?.claimable && <>
                            <div className={style.claimInfoText}>
                                You have already participated. Try again tomorrow!
                            </div>
                            <Button
                                className={style.actionBtn}
                                block
                                type='primary'
                                shape='round'
                                size='large'
                                icon={<ShareAltOutlined />}
                                onClick={() => {
                                    handleShare();
                                }}
                            >Share</Button>
                        </>}
                    </div>
                </>}
            </div>

            <Footer />
        </div>

        {secModal && <SecurityModal
            visable={secModal}
            setVisable={setSecModal}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            func={claim}
        ></SecurityModal>}
    </>;
};

export default Lottery;
