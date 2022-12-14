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
	rewardTokenSymbol?: string;
}> = ({ collapse, nfts, rewardTokenSymbol }) => {
	const { getTokenList } = useModel('stake');
	const { wallet } = useModel('currentUser');
	const [claimSecModal, setClaimSecModal] = useState(false);
	const [unstakeSecModal, setUnstakeSecModal] = useState(false);
	const [passphrase, setPassphrase] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [nftItem, setNFTItem] = useState<any>({});

	const intl = useIntl();

	const handleClaim = async (preTx?: boolean, account?: string) => {
		if (!!wallet && !!wallet?.keystore) {
			setSubmitting(true);

			try {
				const info: any = await ClaimLPReward(nftItem?.lpId, passphrase, wallet?.keystore, preTx, account);
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

	const handleUnstake = async (preTx?: boolean, account?: string) => {
		if (!!wallet && !!wallet?.keystore) {
			setSubmitting(true);

			try {
				const token = await DrylyRemoveLiquidity(nftItem?.lpId);
				const info: any = await RemoveLiquidity(nftItem?.lpId, token[3], token[2], passphrase, wallet?.keystore, preTx, account);
				setSubmitting(false);

				if (preTx && account) {
					return info
				}
				getTokenList();
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
												id: 'stake.lpTokenList.lpTokenId',
												defaultMessage: 'LP Token Id',
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
