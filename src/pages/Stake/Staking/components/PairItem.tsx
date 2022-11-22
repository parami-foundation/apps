import React, { useEffect, useState } from 'react';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { Button, Card, Image, message, notification, Tooltip } from 'antd';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Rows from './Rows';
import Token from '@/components/Token/Token';
import { stringToBigInt } from '@/utils/common';
import { useIntl, useModel } from 'umi';
import { ClaimLPReward } from '@/services/parami/Swap';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
const ICON_AD3 = '/images/logo-round-core.svg';

const PairItem: React.FC<{
	logo: string;
	lp: any;
}> = ({ logo, lp }) => {
	const apiWs = useModel('apiWs');
	const { getTokenList } = useModel('stake');
	const { wallet } = useModel('currentUser');
	const [Collapse, setCollapse] = useState<boolean>(false);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [passphrase, setPassphrase] = useState('');
	const [secModal, setSecModal] = useState<boolean>(false);
	const [stakingEnabled, setStakingEnabled] = useState<boolean>(false);

	const intl = useIntl();

	useEffect(() => {
		if (lp && apiWs) {
			console.log(lp);
			(async () => {
				const swapMetaRes = await apiWs?.query.swap.metadata(lp.id);
				if (!swapMetaRes?.isEmpty) {
					const { enableStaking } = swapMetaRes?.toHuman() as { enableStaking: boolean };
					setStakingEnabled(enableStaking);
				}
			})()
		}
	}, [lp, apiWs])

	let totalLiquidity: bigint = BigInt(0);
	lp?.nfts.forEach((nft) => {
		totalLiquidity = totalLiquidity + stringToBigInt(nft.amount);
	});

	const handleHarvestReward = async (preTx?: boolean, account?: string) => {
		if (!!wallet && !!wallet?.keystore) {
			setSubmitting(true);

			try {
				const info: any = await ClaimLPReward(lp.nfts[0].lpId, passphrase, wallet?.keystore, preTx, account);
				setSubmitting(false);

				if (preTx && account) {
					return info
				}
				getTokenList();
			} catch (e: any) {
				message.error(e);
			}
		} else {
			notification.error({
				key: 'accessDenied',
				message: intl.formatMessage({
					id: 'error.accessDenied',
				}),
				duration: null,
			})
		}
	};

	return (
		<>
			<div className={style.stakeItem}>
				<Card
					className={styles.card}
					bodyStyle={{
						padding: 15,
						width: '100%',
					}}
				>

					<div className={style.stakeMain}>
						<div className={style.stakeInfo}>
							<div className={style.tokenPair}>
								<div className={style.tokenIcons}>
									<Image
										src={ICON_AD3}
										preview={false}
										className={style.icon}
									/>
									<Image
										src={logo || '/images/default-avatar.svg'}
										preview={false}
										className={style.icon}
									/>
								</div>
								<div className={style.tokenNameAndRate}>
									<div className={style.tokenName}>
										AD3-{lp?.symbol}
									</div>
								</div>
							</div>
							<div className={style.tokenLiquidity}>
								<div className={style.title}>
									Total Liquidity({lp?.symbol})
								</div>
								<div className={style.value}>
									<Token value={totalLiquidity.toString()} />
									<Tooltip
										placement="bottom"
										title={'The liquidity value is an estimation that only calculates the liquidity lies in the reward range.'}
									>
										<InfoCircleOutlined className={style.tipButton} />
									</Tooltip>
								</div>
							</div>
						</div>

						<div className={style.nftReward}>
							<div className={style.nftItemBlock}>
								<div className={style.title}>
									{`Reward(${lp?.symbol ?? 'AD3'}) `}
									{!stakingEnabled && <>
										<Tooltip
											title={'Staking reward is not enabled for this token. You could still earn fees by providing liquidity.'}
										>
											<InfoCircleOutlined className={style.tipButton} />
										</Tooltip>
									</>}
								</div>
								<div className={style.value}>
									<Token value={lp?.reward} />
								</div>
							</div>
							<Button
								size='middle'
								shape='round'
								type='primary'
								disabled={!lp?.reward || !lp?.nfts?.length}
								onClick={() => {
									setSubmitting(true);
									setSecModal(true);
								}}
								loading={submitting}
							>
								Harvest
							</Button>
						</div>

						<div className={style.expandButton}>
							<Button
								type="link"
								icon={
									<DownOutlined
										rotate={!Collapse ? 0 : -180}
										className={style.expandButtonIcon}
									/>
								}
								onClick={() => {
									setCollapse(prev => !prev);
								}}
							/>
						</div>
					</div>
					<Rows
						rewardTokenSymbol={lp?.symbol}
						collapse={Collapse}
						nfts={lp.nfts}
					/>
				</Card>
			</div>

			<SecurityModal
				visable={secModal}
				setVisable={setSecModal}
				passphrase={passphrase}
				setPassphrase={setPassphrase}
				func={handleHarvestReward}
			/>
		</>
	)
}

export default PairItem;
