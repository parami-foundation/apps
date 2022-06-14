import React, { useEffect, useState } from 'react';
import { useIntl, history, useModel } from 'umi';
import { Button, Card, notification, Timeline, Tooltip, Typography } from 'antd';
import styles from '../style.less';
import style from './style.less';
import config from '@/config/config';
import type { AssetTransaction } from '@/services/subquery/subquery';
import { AssetTransactionHistory } from '@/services/subquery/subquery';
import SimpleDateTime from 'react-simple-timestamp-to-date';
import { dealWithDid } from '@/utils/common';
import Token from '@/components/Token/Token';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import Skeleton from '@/components/Skeleton';

const { Title } = Typography;

const Record: React.FC = () => {
	const apiWs = useModel('apiWs');
	const { wallet }: any = useModel('currentUser');
	const [allData, setAllData] = useState<AssetTransaction[]>([]);

	const intl = useIntl();

	const transList = async () => {
		if (!!wallet && !!wallet.did) {
			try {
				const res: any = await AssetTransactionHistory(wallet?.did, wallet?.account);
				setAllData(res);
			} catch (e: any) {
				notification.error({
					message: e.message || e,
					duration: null,
				});
			};
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
		if (apiWs) {
			transList();
		}
	}, [apiWs]);

	return (
		<>
			<Skeleton
				loading={!apiWs}
				height={150}
				children={
					<Card
						className={styles.sideCard}
						bodyStyle={{
							width: '100%',
						}}
					>
						<div className={style.recordList}>
							<Title level={4}>
								{intl.formatMessage({
									id: 'wallet.recordlist.title',
								})}
							</Title>
							<Timeline className={style.timeline}>
								{allData.map((value, index) => {
									if (index >= 5) return null;
									return (
										<Timeline.Item
											color={value.fromDid === wallet?.did ? "red" : "green"}
											dot={value.fromDid === wallet?.did ? <LogoutOutlined /> : <LoginOutlined />}
											className={style.timelineItem}
											key={value.timestampInSecond}
										>
											<div className={style.body}>
												<div className={style.left}>
													<div className={style.desc}>
														{value.fromDid === wallet?.did ? '-' : '+'}
														<Token value={value.amount} symbol={value.assetSymbol} />
													</div>
													<div className={style.receiver}>
														hash:<a onClick={() => { window.open(config.explorer.block + value.block, '_blank') }}>{value.block}</a>
													</div>
												</div>
												<div className={style.right}>
													<div className={style.address}>
														<Tooltip placement="topLeft" title={dealWithDid(value, wallet?.did)}>
															{
																dealWithDid(value, wallet?.did)
															}
														</Tooltip>
														{dealWithDid(value, wallet?.did)}
													</div>
													<div className={style.time}>
														<SimpleDateTime dateSeparator="/" timeSeparator=":" format="YMD">{value.timestampInSecond}</SimpleDateTime>
													</div>
												</div>
											</div>
										</Timeline.Item>
									)
								})}
							</Timeline>
							<Button
								block
								size="large"
								shape="round"
								type="primary"
								ghost
								onClick={() => { history.push(config.page.recordPage) }}
							>
								{intl.formatMessage({
									id: 'wallet.recordlist.all',
								})}
							</Button>
						</div>
					</Card>
				}
			/>
		</>
	)
}

export default Record;
