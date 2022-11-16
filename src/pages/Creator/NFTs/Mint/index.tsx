import React, { useState } from 'react';
import style from './style.less';
import { useIntl } from 'umi';
import { Button, Input, notification } from 'antd';
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
	const [totalSupply, setTotalSupply] = useState<string>('');

	const intl = useIntl();

	const handleMint = async (preTx?: boolean, account?: string) => {
		if (!!wallet && !!wallet.keystore) {
			setLoading(true);
			try {
				const info: any = await MintNFT(item?.id, name, symbol, parseAmount(totalSupply), passphrase, wallet?.keystore, preTx, account);
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
					<Input
						className={style.input}
						type='number'
						min={0}
						onChange={(a) => { setTotalSupply(a.target.value) }}
					/>
				</div>
			</div>

			<div className={style.buttons}>
				<Button
					block
					type="primary"
					shape="round"
					size="large"
					loading={loading}
					disabled={!name || !symbol || !totalSupply}
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
