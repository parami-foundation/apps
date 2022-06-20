import BigModal from '@/components/ParamiModal/BigModal';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import { notification } from 'antd';
import { SetNickName } from '@/services/parami/Identity';

const Nickname: React.FC<{
	nicknameModal: boolean;
	setNicknameModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ nicknameModal, setNicknameModal }) => {
	const { nickname, setNickname } = useModel('user');
	const { wallet } = useModel('currentUser');
	const [loading, setLoading] = useState<boolean>(false);
	const [secModal, setSecModal] = useState<boolean>(false);
	const [passphrase, setPassphrase] = useState<string>('');

	const intl = useIntl();

	const updateNickname = async (preTx?: boolean, account?: string) => {
		if (!!wallet && !!wallet.keystore) {
			try {
				setLoading(true);
				const info: any = await SetNickName(nickname, passphrase, wallet?.keystore, preTx, account);
				setNicknameModal(false);
				setLoading(false);
				if (preTx && account) {
					return info
				}
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
		<>
			<BigModal
				visable={nicknameModal}
				title={intl.formatMessage({
					id: 'wallet.nickname.edit',
				})}
				content={
					<>
						<Input
							size="large"
							value={nickname}
							onChange={(e) => {
								setNickname(e.target.value)
							}}
						/>
						<Button
							block
							type='primary'
							size='large'
							shape='round'
							style={{
								marginTop: 20,
							}}
							loading={loading}
							onClick={() => { setSecModal(true) }}
						>
							{intl.formatMessage({
								id: 'common.submit',
							})}
						</Button>
					</>
				}
				close={() => { setNicknameModal(false) }}
				footer={false}
			/>
			<SecurityModal
				visable={secModal}
				setVisable={setSecModal}
				passphrase={passphrase}
				setPassphrase={setPassphrase}
				func={updateNickname}
			/>
		</>
	)
}

export default Nickname;
