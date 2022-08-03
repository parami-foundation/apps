import { Button, Col, Progress, Row, Typography, Image, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { FaFolderPlus, FaFileImport } from 'react-icons/fa';
import Import from './Import';
import Skeleton from '@/components/Skeleton';
import { FloatStringToBigInt, BigIntToFloatString } from '@/utils/format';
import Mint from './Mint';
import { hexToDid } from '@/utils/common';

const NFTs: React.FC = () => {
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');
	const { connect } = useModel('web3');
	const { nftList, loading, getNFTs } = useModel('nft');
	const [coverWidth, setCoverWidth] = useState<number>(0);
	const [importModal, setImportModal] = useState<boolean>(false);
	const [mintModal, setMintModal] = useState<boolean>(false);
	const [submitLoading, setSubmitLoading] = useState<boolean>(false);
	const [mintItem, setMintItem] = useState<any>({});

	const intl = useIntl();
	const { Title } = Typography;

	const coverRef: any = useRef();

	useEffect(() => {
		connect && connect();
	}, [connect])

	useEffect(() => {
		getNFTs && getNFTs();
	}, [getNFTs]);

	useEffect(() => {
		if (!!nftList?.length) {
			setCoverWidth(coverRef?.current?.clientWidth);
		}
	}, [coverRef]);

	const statusInfo = (label: string, value: string, color: string) => {
		return (<div className={style.status}>
			<div className={style.legend} style={{background: `${color}`}}></div>
			<div className={style.label}>{label}</div>
			<div className={style.value}>{value}</div>
		</div>);
	}

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
														<div className={style.card}
															onClick={() => {
																window.location.href = `${window.location.origin}/${hexToDid(wallet.did!)}/${item?.id}`;
															}}>
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
																		<div className={style.unlockProgress}>
																			<Tooltip title="Tokens will be gradually unlocked over 6 months" color={'#ff5b00'}>
																				<Progress
																					success={{ percent: 15, strokeColor: '#ff5b00' }}
																					percent={50}
																					strokeColor='#fc9860'
																					showInfo
																					className={style.progress}
																				/>
																			</Tooltip>
																		</div>
																		{statusInfo('Total Value', '100k', '#fff')}
																		{statusInfo('Total Claimed', '40k', '#ff5b00')}
																		{statusInfo('Ready for Claim', '3k', '#fc9860')}
																		<div className={style.action}>
																			<Button
																				block
																				type='primary'
																				shape='round'
																				size='middle'
																				onClick={(e) => {
																					e.stopPropagation();
																					console.log('Claim Tokens');
																				}}
																			>
																				Claim Tokens
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
				</div>
			</div>
		</>
	)
}

export default NFTs;
