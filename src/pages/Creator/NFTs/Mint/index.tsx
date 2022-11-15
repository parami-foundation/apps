import React, { useState } from 'react';
import style from './style.less';
import { useIntl } from 'umi';
import { Button, Input, notification } from 'antd';
import { formatBalance } from '@polkadot/util';
import { DownOutlined } from '@ant-design/icons';
import BigModal from '@/components/ParamiModal/BigModal';
import { MintNFT } from '@/services/parami/NFT';
import { useModel } from 'umi';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { parseAmount } from '@/utils/common';

const MintNFTForm: React.FC<{
	item: any;
	onMint: () => void;
}> = ({ item, onMint }) => {
	const { getNFTs } = useModel('nft');
	const { wallet } = useModel('currentUser');
	const [loading, setLoading] = useState<boolean>(false);
	const [name, setName] = useState<string>('');
	const [symbol, setSymbol] = useState<string>('');
	const [secModal, setSecModal] = useState<boolean>(false);
	const [passphrase, setPassphrase] = useState<string>('');
	const [totalSupply, setTotalSupply] = useState<string>('10000000');
	const [ad3Amount, setAd3Amount] = useState<string>('1000');
	const [offeredAmount, setOfferedAmount] = useState<string>('1000000');

	const intl = useIntl();

	const handleMint = async (preTx?: boolean, account?: string) => {
		if (!!wallet && !!wallet.keystore) {
			setLoading(true);
			try {
				const info: any = await MintNFT(item?.id, name, symbol, parseAmount(totalSupply), parseAmount(ad3Amount), parseAmount(offeredAmount), passphrase, wallet?.keystore, preTx, account);
				if (preTx && account) {
					return info
				}
				setLoading(false);
				onMint();
				getNFTs && getNFTs();
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
						className={style.input}
						onChange={(a) => { setSymbol(a.target.value) }}
						maxLength={4}
					/>
				</div>
			</div>
			<div className={style.field}>
				<div className={style.title}>
					Total Supply
				</div>
				<div className={style.value}>
					{totalSupply}
				</div>
			</div>

			<div className={style.field}>
				<div className={style.title}>
					AD3 Amount
				</div>
				<div className={style.value}>
					{ad3Amount}
				</div>
			</div>

			<div className={style.field}>
				<div className={style.title}>
					Offered Amount
				</div>
				<div className={style.value}>
					{offeredAmount}
				</div>
			</div>
			
			{/* <div className={style.field}>
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
			</div> */}
			
			<div className={style.buttons}>
				<Button
					block
					type="primary"
					shape="round"
					size="large"
					className={style.button}
					loading={loading}
					disabled={!name || !symbol}
					onClick={() => {
						setSecModal(true);
					}}
				>
					Mint
				</Button>
			</div>

			<SecurityModal
				visable={secModal}
				setVisable={setSecModal}
				passphrase={passphrase}
				setPassphrase={setPassphrase}
				func={handleMint}
			/>
		</div>
	)
}

const MintNFTModal: React.FC<{
	item: any;
	onClose: () => void;
	onMint: () => void;
}> = ({ item, onClose, onMint }) => {

	return (
		<BigModal
			visable
			title={'Mint'}
			content={
				<MintNFTForm
					item={item}
					onMint={onMint}
				/>
			}
			footer={false}
			close={() => { onClose() }}
		/>
	)
};

export default MintNFTModal;
