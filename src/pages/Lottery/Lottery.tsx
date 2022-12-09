import Footer from '@/components/Footer';
import Token from '@/components/Token/Token';
import { GetBalanceOfAsset } from '@/services/parami/Assets';
import { ClockInVO, QueryLottery } from '@/services/parami/ClockIn.service';
import { QueryAssetById } from '@/services/parami/HTTP';
import { Asset } from '@/services/parami/typings';
import { getNumberOfHolders } from '@/services/subquery/subquery';
import { parseUrlParams } from '@/utils/url.util';
import { ArrowLeftOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import style from './Lottery.less';

const { Step } = Steps;

export interface LotteryProps { }

function Lottery({ }: LotteryProps) {
    const apiWs = useModel('apiWs');
    const { wallet } = useModel('currentUser');
    const [nftId, setNftId] = useState<string>();
    const [lottery, setLottery] = useState<ClockInVO>();
    const [asset, setAsset] = useState<Asset>();
    const [numHolders, setNumHolders] = useState<number>();
    const [balance, setBalance] = useState<string>();
    const [userLevel, setUserLevel] = useState<any>({});
    // const [winningChance, setWinningChance] = useState<string>();

    useEffect(() => {
        const params = parseUrlParams() as { nftId: string };
        if (params.nftId) {
            setNftId(params.nftId);
        }
    })

    useEffect(() => {
        if (nftId && wallet && apiWs) {
            QueryLottery(nftId).then(res => setLottery(res));

            QueryAssetById(nftId).then(({ data }) => {
                if (data.token) {
                    setAsset(data.token);
                }
            })

            getNumberOfHolders(nftId).then(num => setNumHolders(num));

            GetBalanceOfAsset(nftId, wallet.account).then(balance => setBalance(balance || '0'));
        }
    }, [apiWs, nftId, wallet])

    useEffect(() => {
        if (lottery && balance) {
            let levelIndex = 0;
            (lottery.levelEndpoints ?? []).forEach(endpoint => {
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
                            everyday!
                        </div>
                        <div className={style.hint}>
                            Hold more {asset?.name} NFT power to increase your winning chance
                        </div>
                    </div>
                    <div className={style.levels}>
                        <Steps
                            direction="vertical"
                        >
                            {lottery.levelProbability.map((probability, index) => {
                                if (!index) {
                                    return <Step
                                        status='finish'
                                        title="Base level"
                                        icon={userLevel.levelIndex >= index ? <UnlockOutlined /> : <LockOutlined />}
                                        description={`${probability}% chance of winning`}
                                    ></Step>
                                }
                                return <Step
                                    status='finish'
                                    title={<>
                                        <Token value={lottery.levelEndpoints[index - 1]} symbol={asset?.symbol}></Token>
                                    </>}
                                    icon={userLevel.levelIndex >= index ? <UnlockOutlined /> : <LockOutlined />}
                                    description={`${probability}% chance of winning`}
                                    subTitle={userLevel.levelIndex === index && <>
                                        <div className={style.userBalance}>
                                            <ArrowLeftOutlined />
                                            You have <Token value={balance || ''} symbol={asset?.symbol}></Token>
                                        </div>
                                    </>}
                                ></Step>
                            })}
                        </Steps>
                    </div>
                </>}

            </div>

            <Footer />
        </div>
    </>;
};

export default Lottery;
