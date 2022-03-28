import BigModal from '@/components/ParamiModal/BigModal';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { setNickName } from '@/services/parami/wallet';
import { Button, Input, message } from 'antd';
import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import { notification } from 'antd';

const Nickname: React.FC<{
    nicknameModal: boolean;
    setNicknameModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ nicknameModal, setNicknameModal }) => {
    const { nickname, setNickname } = useModel('user');
    const [spinning, setSpinning] = useState<boolean>(false);
    const [secModal, setSecModal] = useState(false);
    const [password, setPassword] = useState('');

    const intl = useIntl();
    const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

    const updateNickname = async () => {
        setSpinning(true);
        try {
            await setNickName(nickname, password, controllerKeystore);
            setNicknameModal(false);
            setSpinning(false);
        } catch (e: any) {
            notification.error({
                message: e.message,
                duration: null,
            });
            setSpinning(false);
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
                            loading={spinning}
                            onClick={() => { setSecModal(true) }}
                        >
                            {intl.formatMessage({
                                id: 'common.submit',
                            })}
                        </Button>
                    </>
                }
                footer={
                    <>
                        <Button
                            block
                            shape='round'
                            size='large'
                            onClick={() => { setNicknameModal(false) }}
                        >
                            {intl.formatMessage({
                                id: 'common.close',
                            })}
                        </Button>
                    </>
                }
                close={() => { setNicknameModal(false) }}
            />
            <SecurityModal
                visable={secModal}
                setVisable={setSecModal}
                password={password}
                setPassword={setPassword}
                func={updateNickname}
            />
        </>
    )
}

export default Nickname;
