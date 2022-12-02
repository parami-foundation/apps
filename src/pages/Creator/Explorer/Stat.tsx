import { Card, Col, Row, Statistic, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import Token from '@/components/Token/Token';
import AD3 from '@/components/Token/AD3';

const { Title } = Typography;

const StatField = (title: string, formatter) => {
	return <Statistic
		title={title}
		formatter={formatter}
		valueStyle={{ fontSize: '16px' }}
	/>
}

const Stat: React.FC<{
	asset: any;
	assetPrice: string;
	totalSupply: bigint;
	member: any;
}> = ({ asset, assetPrice, totalSupply, member }) => {
	const intl = useIntl();

	return (
		<>
			<Title
				level={5}
				style={{
					fontWeight: 'bold',
					textAlign: 'center',
					marginTop: 10,
				}}
				className={styles.title}
			>
				{intl.formatMessage({
					id: 'creator.explorer.stat',
				})}
			</Title>
			<Card
				className={styles.card}
				style={{marginBottom: '30px'}}
				bodyStyle={{
					width: '100%',
				}}
			>
				<div className={style.stat}>
					<Row
						gutter={[16, 16]}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Col xs={12} sm={12} md={8} lg={8} xl={4}>
							{StatField('1 ' + asset?.symbol, () => (<AD3 value={assetPrice} />))}
						</Col>
						<Col xs={12} sm={12} md={8} lg={8} xl={4}>
							{StatField(intl.formatMessage({
								id: 'creator.explorer.totalIssues',
							}), () => (<Token value={totalSupply.toString()} symbol={asset?.symbol} />))}
						</Col>
						<Col xs={12} sm={12} md={8} lg={8} xl={4}>
							{StatField(intl.formatMessage({
								id: 'creator.explorer.totalValue',
							}), () => (<AD3 value={(BigInt(assetPrice) * BigInt(3000000)).toString()} />))}
						</Col>
						<Col xs={12} sm={12} md={8} lg={8} xl={4}>
							{StatField(intl.formatMessage({
								id: 'creator.explorer.reservedValue',
							}), () => (<AD3 value={(BigInt(assetPrice) * BigInt(1000000)).toString()} />))}
						</Col>
						<Col xs={12} sm={12} md={8} lg={8} xl={4}>
							{StatField(intl.formatMessage({
								id: 'creator.explorer.members',
							}), () => member)}
						</Col>
					</Row>
				</div>
			</Card>
		</>
	)
}

export default Stat;
