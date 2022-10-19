import React, { useState } from 'react';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { useIntl, useModel } from 'umi';
import { Button, Statistic, Table, Tooltip, notification, Space, Card, Popover } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect } from 'react';
import Skeleton from '@/components/Skeleton';
import BigModal from '@/components/ParamiModal/BigModal';
import Register from './Register';
import Create from './Create';
import Bid from './Bid';
import List from './List';
import { IsAdvertiser } from '@/services/parami/Advertisement';
import { AdListItem } from '@/models/dashboard/advertisement';
import type { ColumnsType } from 'antd/es/table';
import CreateTagModal from '../../components/CreateTagModal/CreateTagModal';

const Advertisement: React.FC = () => {
	const apiWs = useModel('apiWs');
	const { dashboard } = useModel('currentUser');
	const { AdList } = useModel('dashboard.advertisement');
	const [isAdvertisers, setIsAdvertisers] = useState<boolean>(false);
	const [becomeModal, setBecomeModal] = useState<boolean>(false);
	const [createModal, setCreateModal] = useState<boolean>(false);
	const [createTagModal, setCreateTagModal] = useState<boolean>(false);
	const [bidModal, setBidModal] = useState<boolean>(false);
	const [listModal, setListModal] = useState<boolean>(false);
	const [adItem, setAdItem] = useState<any>({});

	const intl = useIntl();

	const columns: ColumnsType<AdListItem> = [
		{
			title: intl.formatMessage({
				id: 'dashboard.ads.item.id',
			}),
			dataIndex: 'id',
			key: 'id',
			render: (text: any) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
			ellipsis: true,
		},
		{
			title: 'title',
			key: 'title',
			ellipsis: true,
			render: (adItem: AdListItem) => {
				return <span>{adItem?.metadata?.title ?? '-'}</span>
			}
		},
		{
			title: intl.formatMessage({
				id: 'dashboard.ads.item.tag',
			}),
			dataIndex: 'tag',
			key: 'tag',
		},
		{
			title: intl.formatMessage({
				id: 'dashboard.ads.item.metadata',
			}),
			key: 'metadata',
			render: (adItem: AdListItem) => {
				return (<>
					<Popover content={
						<>{Object.keys(adItem.metadata).map(key => {
							return <p><b>{key}</b>: {JSON.stringify(adItem.metadata[key])}</p>
						})}
						</>
					}>{adItem.metadataIpfs}</Popover>
				</>);
			},
			ellipsis: true,
		},
		{
			title: intl.formatMessage({
				id: 'dashboard.ads.item.rewardRate',
			}),
			dataIndex: 'rewardRate',
			key: 'rewardRate',
		},
		{
			title: intl.formatMessage({
				id: 'dashboard.ads.item.endtime',
			}),
			dataIndex: 'endtime',
			key: 'endtime',
		},
		{
			title: intl.formatMessage({
				id: 'dashboard.ads.item.action',
			}),
			key: 'option',
			render: (item: AdListItem) => (
				<Space>
					<a
						key="bid"
						onClick={() => {
							setAdItem(item);
							setBidModal(true);
						}}
					>
						Bid
					</a>
					<Tooltip
						placement="topLeft"
						title="comming soon"
					>
						View
					</Tooltip>
					{/* <a
						key="view"
						onClick={() => {
							setAdItem(item);
							setListModal(true);
						}}
					>
						View
					</a> */}
				</Space>
			),
		},
	];

	// const checkIsAdvertiser = async () => {
	// 	if (!!dashboard && !!dashboard?.account) {
	// 		try {
	// 			const isAdvertiser = await IsAdvertiser(dashboard?.account);
	// 			setIsAdvertisers(isAdvertiser);
	// 		} catch (e: any) {
	// 			notification.error({
	// 				key: 'unknownError',
	// 				message: e.message || e,
	// 				duration: null,
	// 			})
	// 		}
	// 	} else {
	// 		notification.error({
	// 			key: 'accessDenied',
	// 			message: intl.formatMessage({
	// 				id: 'error.accessDenied',
	// 			}),
	// 			duration: null,
	// 		})
	// 	}
	// };

	// useEffect(() => {
	// 	if (apiWs) {
	// 		checkIsAdvertiser();
	// 	}
	// }, [apiWs]);

	return (
		<>
			<div className={styles.mainBgContainer}>
				<div className={styles.contentContainer}>
					<Skeleton
						loading={!apiWs}
						height={400}
						children={
							<Card
								className={styles.dashboardCard}
								bodyStyle={{
									width: '100%',
								}}
							>
								{(false && 
									<div className={style.createModal}>
										<Button
											type='primary'
											shape='round'
											size='large'
											className={style.becomeButton}
											onClick={() => {
												setBecomeModal(true);
											}}
										>
											{intl.formatMessage({
												id: 'dashboard.ads.becomeAdvertisers',
											})}
										</Button>
										<div className={style.minimum}>
											The minimum is 1,000 $AD3
										</div>
									</div>
								)}
								<PageContainer
									className={style.pageContainer}
									ghost
									title={intl.formatMessage({
										id: 'dashboard.ads.title',
									})}
									content={
										<Statistic
											title={intl.formatMessage({
												id: 'dashboard.ads.control.total',
											})}
											value={AdList.length}
										/>
									}
									breadcrumb={undefined}
									extra={[
										<Button
											type='primary'
											size='large'
											shape='round'
											icon={<PlusCircleOutlined />}
											onClick={() => { setCreateModal(true) }}
										>
											{intl.formatMessage({
												id: 'dashboard.ads.control.create',
											})}
										</Button>,
										<Button
											type='primary'
											size='large'
											shape='round'
											icon={<PlusCircleOutlined />}
											onClick={() => { setCreateTagModal(true) }}
										>
											Create New Tag
										</Button>
									]}
								>
									<Table
										className={style.table}
										dataSource={AdList}
										columns={columns}
									/>
								</PageContainer>
							</Card>
						}
					/>
				</div>
			</div>

			<BigModal
				visable={becomeModal}
				title={intl.formatMessage({
					id: 'dashboard.ads.becomeAdvertisers',
				})}
				content={
					<Register
						setIsAdvertisers={setIsAdvertisers}
						setBecomeModal={setBecomeModal}
					/>
				}
				footer={false}
				close={() => {
					setBecomeModal(false);
				}}
			/>

			{createModal && (
				<BigModal
					visable={true}
					title={intl.formatMessage({
						id: 'dashboard.ads.create',
					})}
					content={
						<Create
							setCreateModal={setCreateModal}
						/>
					}
					footer={false}
					close={() => {
						setCreateModal(false);
					}}
				/>
			)}

			{
				createTagModal && (
					<CreateTagModal onCancel={() => setCreateTagModal(false)} onCreate={() => {
						setCreateTagModal(false);
						window.location.reload();
					}}/>
				)
			}

			{bidModal && (
				<BigModal
					visable={true}
					title={intl.formatMessage({
						id: 'dashboard.ads.bid',
					})}
					content={
						<Bid
							adItem={adItem}
							setBidModal={setBidModal}
						/>
					}
					footer={false}
					close={() => {
						setBidModal(false);
					}}
				/>
			)}

			<BigModal
				visable={listModal}
				title={intl.formatMessage({
					id: 'dashboard.ads.list',
				})}
				content={
					<List
						adItem={adItem}
					/>
				}
				footer={false}
				close={() => {
					setListModal(false);
				}}
			/>
		</>
	)
}

export default Advertisement;
