import React, { useState } from 'react';
import { useIntl } from 'umi';
import style from '../style.less';
import { Divider, Space, Button, message } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import Token from '@/components/Token/Token';
import { ClaimLPReward, DrylyRemoveLiquidity, RemoveLiquidity } from '@/services/parami/swap';
import SecurityModal from '@/components/ParamiModal/SecurityModal';

const Rows: React.FC<{
    collapse: boolean;
    nfts: any[];
}> = ({ collapse, nfts }) => {
    const [claimSecModal, setClaimSecModal] = useState(false);
    const [unstakeSecModal, setUnstakeSecModal] = useState(false);
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [nftItem, setNFTItem] = useState<any>({});

    const intl = useIntl();

    const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

    const handleClaim = async () => {
        try {
            await ClaimLPReward(nftItem?.lpId, password, controllerKeystore);
            window.location.reload();
        } catch (e: any) {
            message.error(e);
        }
        setSubmitting(false);
    };

    const handleUnstake = async () => {
        try {
            console.log(nftItem)
            DrylyRemoveLiquidity(nftItem?.lpId).then(async (res: any) => {
                console.log(res);
                await RemoveLiquidity(nftItem?.lpId, res[1], res[0], password, controllerKeystore as string).then(() => {
                    setSubmitting(false);
                });
            });
            window.location.reload();
        } catch (e: any) {
            message.error(e);
        }
        setSubmitting(false);
    };

    return (
        <>
            <div
                className={style.rowsContainer}
                style={{
                    maxHeight: collapse ? '100vh' : 0,
                }}
            >
                <Divider />
                <div className={style.rowsContentContainer}>
                    <div className={style.nftList}>
                        {nfts.map((nft) => (
                            <div className={style.nftItem}>
                                <div className={style.nftInfo}>
                                    <div className={style.nftItemBlock}>
                                        <div className={style.title}>
                                            {intl.formatMessage({
                                                id: 'stake.nftList.nftID',
                                                defaultMessage: 'NFTId',
                                            })}
                                        </div>
                                        <div className={style.value}>
                                            <Space>
                                                <LinkOutlined /> {nft?.lpId}
                                            </Space>
                                        </div>
                                    </div>
                                    <div className={style.nftItemBlock}>
                                        <div className={style.title}>
                                            Liquidity
                                        </div>
                                        <div className={style.value}>
                                            <Token value={nft?.amount} />
                                        </div>
                                    </div>
                                </div>
                                <div className={style.nftButtons}>
                                    <div className={style.nftReward}>
                                        <div className={style.nftItemBlock}>
                                            <div className={style.title}>
                                                Reward(AD3)
                                            </div>
                                            <div className={style.value}>
                                                {nft?.reward}
                                            </div>
                                        </div>
                                        <Button
                                            size='middle'
                                            shape='round'
                                            type='primary'
                                            onClick={() => {
                                                setSubmitting(true);
                                                setClaimSecModal(true);
                                                setNFTItem(nft);
                                            }}
                                            loading={submitting}
                                        >
                                            Harvest
                                        </Button>
                                    </div>
                                    <div className={style.nftItemBlock}>
                                        <Button
                                            danger
                                            size='middle'
                                            shape='round'
                                            type='primary'
                                            className={style.stakeButton}
                                            loading={submitting}
                                            onClick={() => {
                                                setSubmitting(true);
                                                setUnstakeSecModal(true);
                                                setNFTItem(nft);
                                            }}
                                        >
                                            Unstake
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <SecurityModal
                visable={claimSecModal}
                setVisable={setClaimSecModal}
                password={password}
                setPassword={setPassword}
                func={handleClaim}
            />
            <SecurityModal
                visable={unstakeSecModal}
                setVisable={setUnstakeSecModal}
                password={password}
                setPassword={setPassword}
                func={handleUnstake}
            />
        </>
    )
}

export default Rows;
