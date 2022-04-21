import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import style from '../style.less';
import { Divider, Space, Button, message, notification } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import Token from '@/components/Token/Token';
import { ClaimLPReward, RemoveLiquidity } from '@/services/parami/Swap';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { DrylyRemoveLiquidity } from '@/services/parami/RPC';

const Rows: React.FC<{
	collapse: boolean;
	nfts: any[];
}> = ({ collapse, nfts }) => {
	const { getTokenList } = useModel('stake');
	const { wallet } = useModel('currentUser');
	const [claimSecModal, setClaimSecModal] = useState(false);
	const [unstakeSecModal, setUnstakeSecModal] = useState(false);
	const [passphrase, setPassphrase] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [nftItem, setNFTItem] = useState<any>({});

	const intl = useIntl();

	const handleClaim = async () => {
		if (!!wallet && !!wallet?.keystore) {
			setSubmitting(true);

			try {
				await ClaimLPReward(nftItem?.lpId, passphrase, wallet?.keystore);
				getTokenList();
				setSubmitting(false);
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

	const handleUnstake = async () => {
		if (!!wallet && !!wallet?.keystore) {
			setSubmitting(true);

			try {
				const token = await DrylyRemoveLiquidity(nftItem?.lpId);
				await RemoveLiquidity(nftItem?.lpId, token[1], token[0], passphrase, wallet?.keystore);
				getTokenList();
				setSubmitting(false);
			} catch (e: any) {
				message.error(e);
				setSubmitting(false);
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
				passphrase={passphrase}
				setPassphrase={setPassphrase}
				func={handleClaim}
			/>
			<SecurityModal
				visable={unstakeSecModal}
				setVisable={setUnstakeSecModal}
				passphrase={passphrase}
				setPassphrase={setPassphrase}
				func={handleUnstake}
			/>
		</>
	)
}

export default Rows;
