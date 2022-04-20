import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useIntl, history, useAccess } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import config from '@/config/config';

const Index: React.FC = () => {
	const access = useAccess();
	const intl = useIntl();

	const initial = () => {
		if (access.canWalletUser) {
			history.push(config.page.walletPage);
		}
	};

	useEffect(() => {
		initial();
	}, []);

	return (
		<>
			<div className={styles.mainContainer}>
				<div className={styles.background} />
				<div className={styles.logoMark} />
				<div className={styles.pageContainer}>
					<div className={style.firstPage}>
						<div className={style.slogan}>
							{intl.formatMessage({
								id: 'index.slogan',
							}, {
								title: (<span>Para Meta</span>),
							})}
						</div>
						<div className={style.buttons}>
							<Button
								block
								size='large'
								type='primary'
								shape='round'
								className={style.button}
								onClick={() => {
									history.push(config.page.createPage);
								}}
							>
								<div className={style.title}>
									{intl.formatMessage({
										id: 'index.createAccount',
									})}
								</div>
								<span className={style.desc}>
									{intl.formatMessage({
										id: 'index.createAccount.desc',
									})}
								</span>
							</Button>
							<Button
								block
								ghost
								size='large'
								type='link'
								shape='round'
								className={`${style.button} ${style.buttonImport}`}
								onClick={() => {
									history.push(config.page.recoverPage);
								}}
							>
								<div className={style.title}>
									{intl.formatMessage({
										id: 'index.importAccount',
									})}
								</div>
								<span className={style.desc}>
									{intl.formatMessage({
										id: 'index.importAccount.desc',
									})}
								</span>
							</Button>
						</div>
					</div>
					<div className={style.introContainer}>
						<div className={style.title}>
							{intl.formatMessage({
								id: 'index.intro.title',
							})}
						</div>
						<img
							src={'/images/models/overview.svg'}
							className={style.introImage}
						/>
						<p>
							{intl.formatMessage({
								id: 'index.intro.content',
							})}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default Index;