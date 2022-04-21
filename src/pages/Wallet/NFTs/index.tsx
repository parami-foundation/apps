import { Button, Col, notification, Progress, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
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
	const [secModal, setSecModal] = useState(false);
	const [passphrase, setPassphrase] = useState('');
	const [mode, setMode] = useState<string>('create');
	const [mintItem, setMintItem] = useState<any>({});

	const intl = useIntl();

	const coverRef: any = useRef();

	const handleSubmit = async () => {
		if (!!wallet && !!wallet.keystore) {
			setSubmitLoading(true);
			try {
				switch (mode) {
					case 'create':
						await KickNFT(passphrase, wallet?.keystore);
						setSubmitLoading(false);
						getNFTs();
						break;
					case 'import':
						connect();
						setImportModal(true);
						setSubmitLoading(false);
						break;
					case 'mint':
						setMintModal(true);
						setSubmitLoading(false);
				}
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
		if (nftList.length) {
			setCoverWidth(coverRef.current.clientWidth)
		}
	}, [coverRef, nftList]);

	return (
		<>
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
													setMode('create');
													setSecModal(true);
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
													setMode('import');
													setSecModal(true);
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
											<div className={`${style.nftItem} ${style.unmint}`}>
												<div className={style.card}>
													<div className={style.cardWrapper}>
														<div className={style.cardBox}>
															<div
																className={style.cover}
																ref={coverRef}
																style={{
																	backgroundImage: `url(${item?.tokenURI})`,
																	height: coverWidth,
																	minHeight: '10vh',
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
																				setMode('mint');
																				setSecModal(true);
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
																				Number(BigIntToFloatString(item?.deposit, 18)) / 1000
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
																	minHeight: '10vh',
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
											disabled={!!kickNFT.length}
											onClick={() => {
												setMode('create');
												setSecModal(true);
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
											onClick={() => {
												setMode('import');
												setSecModal(true);
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
				passphrase={passphrase}
			/>

			<Mint
				mintModal={mintModal}
				setMintModal={setMintModal}
				passphrase={passphrase}
				item={mintItem}
			/>

			<SecurityModal
				visable={secModal}
				setVisable={setSecModal}
				passphrase={passphrase}
				setPassphrase={setPassphrase}
				func={handleSubmit}
			/>
		</>
	)
}

export default NFTs;
