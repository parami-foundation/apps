import { Button, Col, notification, Progress, Row, Typography, Image } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { FaFolderPlus, FaFileImport } from 'react-icons/fa';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { KickNFT } from '@/services/parami/NFT';
import Import from './Import';
import Skeleton from '@/components/Skeleton';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';
import Mint from './Mint';
import { hexToDid } from '@/utils/common';

const NFTs: React.FC = () => {
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');
	const { connect } = useModel('web3');
	const { kickNFT, nftList, loading, getNFTs } = useModel('nft');
	const [coverWidth, setCoverWidth] = useState<number>(0);
	const [importModal, setImportModal] = useState<boolean>(false);
	const [mintModal, setMintModal] = useState<boolean>(false);
	const [submitLoading, setSubmitLoading] = useState<boolean>(false);
	const [secModal, setSecModal] = useState<boolean>(false);
	const [passphrase, setPassphrase] = useState<string>('');
	const [mintItem, setMintItem] = useState<any>({});

	const intl = useIntl();
	const { Title } = Typography;

	const coverRef: any = useRef();

	const handleSubmit = async (preTx?: boolean, account?: string) => {
		if (!!wallet && !!wallet.keystore) {
			setSubmitLoading(true);
			try {
				const info: any = await KickNFT(passphrase, wallet?.keystore, preTx, account);
				setSubmitLoading(false);
				if (preTx && account) {
					return info
				}
				getNFTs();
			} catch (e: any) {
				notification.error({
					message: e.message,
					duration: null,
				});
				setSubmitLoading(false);
			}
		} else {
			notification.error({
				key: 'accessDenied',
				message: intl.formatMessage({
					id: 'error.accessDenied',
				}),
				duration: null,
			});
		}
	};

	useEffect(() => {
		if (!!nftList?.length) {
			setCoverWidth(coverRef?.current?.clientWidth);
		}
	}, [coverRef]);

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
											<Row
												gutter={[8, 8]}
												className={style.buttonRow}
											>
												<Col span={12}>
													<Button
														block
														type='primary'
														shape='round'
														size='large'
														className={style.button}
														loading={submitLoading}
														onClick={() => {
															window.open('https://wnft.parami.io/');
														}}
													>
														{intl.formatMessage({
															id: 'wallet.nfts.create',
														})}
													</Button>
												</Col>
												<Col span={12}>
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
												</Col>
											</Row>
										</div>
									</div>
								) : (
									<div className={style.nftsList}>
										{nftList.map((item: any) => {
											if (!item.minted) {
												return (
													<div
														className={`${style.nftItem} ${style.unmint}`}
														onClick={() => {
															if (item?.deposit < FloatStringToBigInt('1000', 18)) {
																window.location.href = `${window.location.origin}/${hexToDid(wallet.did!)}/${item?.id}`;
															}
														}}
													>
														<div className={style.card}>
															<div className={style.cardWrapper}>
																<div className={style.cardBox}>
																	<div
																		className={style.cover}
																		style={{
																			backgroundImage: `url(${item?.tokenURI})`,
																			height: coverWidth,
																			minHeight: '20vh',
																		}}
																		ref={coverRef}
																	>
																		<div className={style.nftID}>
																			#{item?.id}
																		</div>
																	</div>
																	<div
																		className={style.filterImage}
																	/>
																	<div className={style.cardDetail}>
																		<h3 className={style.text}>
																			{item?.name}
																		</h3>
																		<div className={style.status}>
																			<div className={style.label}>
																				{intl.formatMessage({
																					id: 'wallet.nfts.status',
																					defaultMessage: 'Status',
																				})}
																			</div>
																			<div className={style.value}>
																				Rasing
																			</div>
																		</div>
																		<div className={style.action}>
																			{item?.deposit >= FloatStringToBigInt('1000', 18) ? (
																				<Button
																					block
																					type='primary'
																					shape='round'
																					size='middle'
																					onClick={() => {
																						setMintItem(item);
																						setMintModal(true);
																					}}
																				>
																					{intl.formatMessage({
																						id: 'wallet.nfts.mint',
																						defaultMessage: 'Mint',
																					})}
																				</Button>
																			) : (
																				<Progress
																					percent={
																						parseFloat((Number(BigIntToFloatString(item?.deposit, 18)) / 1000 * 100).toFixed(2))
																					}
																					strokeColor='#ff5b00'
																					className={style.progress}
																				/>
																			)}
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												)
											} else {
												return (
													<div className={style.nftItem}>
														<div className={style.card}>
															<div className={style.cardWrapper}>
																<div className={style.cardBox}>
																	<div
																		className={style.cover}
																		ref={coverRef}
																		style={{
																			backgroundImage: `url(${item?.tokenURI})`,
																			height: coverWidth,
																			minHeight: '20vh',
																		}}
																	>
																		<div className={style.nftID}>
																			#{item?.id}
																		</div>
																	</div>
																	<div
																		className={style.filterImage}
																	/>
																	<div className={style.cardDetail}>
																		<h3 className={style.text}>
																			{item?.name}
																		</h3>
																		<div className={style.status}>
																			<div className={style.label}>
																				{intl.formatMessage({
																					id: 'wallet.nfts.status',
																					defaultMessage: 'Status',
																				})}
																			</div>
																			<div className={style.value}>
																				Minted
																			</div>
																		</div>
																		<div className={style.action}>
																			<Button
																				block
																				type='primary'
																				shape='round'
																				size='middle'
																				onClick={() => {
																					window.location.href = `${window.location.origin}/${hexToDid(wallet.did!)}/${item?.id}`;
																				}}
																			>
																				{intl.formatMessage({
																					id: 'wallet.nfts.gotoNFTDAO',
																					defaultMessage: 'NFT DAO',
																				})}
																			</Button>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												)
											}
										})}
										<div className={style.newItem}>
											<div className={style.card}>
												<Button
													className={style.createNFT}
													loading={submitLoading}
													onClick={() => {
														window.open('https://wnft.parami.io/');
													}}
												>
													<FaFolderPlus
														className={style.icon}
													/>
													{intl.formatMessage({
														id: 'wallet.nfts.create',
													})}
												</Button>
												<span className={style.divider} />
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

					<Mint
						mintModal={mintModal}
						setMintModal={setMintModal}
						item={mintItem}
					/>

					<SecurityModal
						visable={secModal}
						setVisable={setSecModal}
						passphrase={passphrase}
						setPassphrase={setPassphrase}
						func={handleSubmit}
					/>
				</div>
			</div>
		</>
	)
}

export default NFTs;
