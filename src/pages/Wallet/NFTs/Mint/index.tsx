import React, { useState } from 'react';
import style from './style.less';
import { useIntl } from 'umi';
import { Button, Input, notification } from 'antd';
import { formatBalance } from '@polkadot/util';
import { DownOutlined } from '@ant-design/icons';
import BigModal from '@/components/ParamiModal/BigModal';
import { MintNFT } from '@/services/parami/NFT';
import { useModel } from 'umi';

const MintNFTModal: React.FC<{
	item: any;
	setMintModal: React.Dispatch<React.SetStateAction<boolean>>;
	passphrase: string;
}> = ({ item, setMintModal, passphrase }) => {
	const { getNFTs } = useModel('nft');
	const { wallet } = useModel('currentUser');
	const [loading, setLoading] = useState<boolean>(false);
	const [name, setName] = useState<string>('');
	const [symbol, setSymbol] = useState<string>('');

	const intl = useIntl();

	const handleMint = async (preTx?: boolean, account?: string) => {
		if (!!wallet && !!wallet.keystore) {
			setLoading(true);
			try {
				const info: any = await MintNFT(item?.id, name, symbol, passphrase, wallet?.keystore, preTx, account);
				setLoading(false);
				setMintModal(false);
				if (preTx && account) {
					return info
				}
				await getNFTs();
			} catch (e: any) {
				notification.error({
					message: e.message,
					duration: null,
				});
				setLoading(false);
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

	return (
		<div className={style.mint}>
			<div className={style.field}>
				<div className={style.title}>
					{intl.formatMessage({
						id: 'creator.create.nftName',
					})}
				</div>
				<div className={style.value}>
					<Input
						autoFocus
						className={style.input}
						onChange={(a) => { setName(a.target.value) }}
						disabled={loading}
					/>
				</div>
			</div>
			<div className={style.field}>
				<div className={style.title}>
					{intl.formatMessage({
						id: 'creator.create.nftSymbol',
					})}
				</div>
				<div className={style.value}>
					<Input
						autoFocus
						className={style.input}
						onChange={(a) => { setSymbol(a.target.value) }}
						disabled={loading}
						prefix={'$'}
					/>
				</div>
			</div>
			<div className={style.field}>
				<div className={style.title}>
					{intl.formatMessage({
						id: 'creator.create.nftReserved',
					})}
					<br />
					<small>
						{intl.formatMessage({
							id: 'creator.create.belong2u',
						})}
					</small>
				</div>
				<div className={style.value}>
					1,000,000
					<br />
					{intl.formatMessage({
						id: 'creator.create.nft.reserved.unlock',
					})}
				</div>
			</div>
			<div className={style.field}>
				<div className={style.title}>
					{intl.formatMessage({
						id: 'creator.create.nft.liquid',
					})}
					<br />
					<small>
						{intl.formatMessage({
							id: 'creator.create.nft.add2liquid',
						})}
					</small>
				</div>
				<div className={style.value}>
					1,000,000
				</div>
			</div>
			<div className={style.field}>
				<div className={style.title}>
					{intl.formatMessage({
						id: 'creator.create.founded',
					})}
					<br />
					<small>
						{intl.formatMessage({
							id: 'creator.create.nft.add2liquid',
						})}
					</small>
				</div>
				<div className={style.value}>
					{formatBalance(item?.deposit, { withUnit: 'AD3' }, 18)}
				</div>
			</div>
			<DownOutlined
				style={{
					fontSize: 30,
					color: '#ff5b00',
					marginBottom: 20,
				}}
			/>
			<div className={style.field}>
				<div className={style.title}>
					{intl.formatMessage({
						id: 'creator.create.nft.total',
					})}
				</div>
				<div className={style.value}>
					10,000,000
					<br />
					{intl.formatMessage({
						id: 'creator.create.nft.total.unlock',
					})}
				</div>
			</div>
			<div className={style.buttons}>
				<Button
					block
					type="primary"
					shape="round"
					size="large"
					className={style.button}
					loading={loading}
					disabled={!name || !symbol}
					onClick={async () => {
						await handleMint();
					}}
				>
					{intl.formatMessage({
						id: 'common.continue',
					})}
				</Button>
			</div>
		</div>
	)
}

const Mint: React.FC<{
	mintModal: boolean
	setMintModal: React.Dispatch<React.SetStateAction<boolean>>;
	passphrase: string;
	item: any;
}> = ({ mintModal, setMintModal, passphrase, item }) => {
	const intl = useIntl();

	return (
		<BigModal
			visable={mintModal}
			title={intl.formatMessage({
				id: 'wallet.nfts.mint',
			})}
			content={
				<MintNFTModal
					setMintModal={setMintModal}
					item={item}
					passphrase={passphrase}
				/>
			}
			footer={false}
			close={() => { setMintModal(false) }}
		/>
	)
};

export default Mint;
