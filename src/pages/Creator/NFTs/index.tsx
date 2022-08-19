import { Button, Typography, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { FaFileImport } from 'react-icons/fa';
import Import from './Import';
import Skeleton from '@/components/Skeleton';
import NFTCard from './NFTCard';
import EthAddress from '@/components/EthAddress/EthAddress';

const NFTs: React.FC = () => {
	const apiWs = useModel('apiWs');
	const { connect } = useModel('web3');
	const { nftList, loading, getNFTs } = useModel('nft');
	const [importModal, setImportModal] = useState<boolean>(false);
	const [submitLoading, setSubmitLoading] = useState<boolean>(false);

	const intl = useIntl();
	const { Title } = Typography;

	useEffect(() => {
		connect && connect();
	}, [connect])

	useEffect(() => {
		getNFTs && getNFTs();
	}, [getNFTs]);

	return (
		<>
			<div className={styles.mainTopContainer}>
				<div className={styles.pageContainer}>
					<div className={style.headerContainer}>
						<div className={style.titleContainer}>
							<Title
								level={1}
								className={style.sectionTitle}
							>
								<Image
									src='/images/icon/diamond.svg'
									className={style.sectionIcon}
									preview={false}
								/>
								{intl.formatMessage({
									id: 'creator.title',
									defaultMessage: 'Creator',
								})}
							</Title>
						</div>
						<div className={style.subtitle}>
							{intl.formatMessage({
								id: 'creator.subtitle',
								defaultMessage: 'Create and manage your own NFTs, and become a NFT creator.',
							})}
						</div>
					</div>
					<EthAddress theme='wallet'></EthAddress>
					<div className={style.nftsContainer}>
						<Skeleton
							loading={!apiWs || loading}
							height={200}
							children={
								!nftList.length ? (
									<div className={style.noNFTs}>
										<img
											src={'/images/icon/query.svg'}
											className={style.topImage}
										/>
										<div className={style.description}>
											{intl.formatMessage({
												id: 'wallet.nfts.empty',
											})}
										</div>
										<div className={style.buttons}>
											<Button
												block
												type='primary'
												shape='round'
												size='large'
												className={style.button}
												loading={submitLoading}
												onClick={async () => {
													await connect();
													setImportModal(true);
													setSubmitLoading(false);
												}}
											>
												{intl.formatMessage({
													id: 'wallet.nfts.import',
												})}
											</Button>
										</div>
									</div>
								) : (
									<div className={style.nftsList}>
										{nftList.map(item => {
											return <NFTCard
												key={`${item.namespace}${item.id}`}
												item={item}
											></NFTCard>
										})}
										<div className={style.newItem}>
											<div className={style.card}>
												<Button
													className={style.importNFT}
													loading={submitLoading}
													onClick={async () => {
														await connect();
														setImportModal(true);
														setSubmitLoading(false);
													}}
												>
													<FaFileImport
														className={style.icon}
													/>
													{intl.formatMessage({
														id: 'wallet.nfts.import',
													})}
												</Button>
											</div>
										</div>
									</div>
								)
							}
						/>
					</div>

					<Import
						importModal={importModal}
						setImportModal={setImportModal}
					/>
				</div>
			</div>
		</>
	)
}

export default NFTs;
