import React from 'react';
import { useModel, useIntl } from 'umi';
import { Button, Divider, Image } from 'antd';
import style from './style.less';
import { RightOutlined } from '@ant-design/icons';

export const MetamaskModal: React.FC = () => {
    const intl = useIntl();

    return (
        <>
            <div className={style.modalContainer}>
                <Image
                    src='/images/sns/metamask-logo.svg'
                    preview={false}
                    className={style.logo}
                />
                <span>
                    {intl.formatMessage({
                        id: 'dashboard.bridge.waitingWallet',
                        defaultMessage: 'Waiting for confirmation from {name}',
                    }, {
                        name: 'Metamask',
                    })}
                </span>
                <Divider />
                <div className={style.getWallet}>
                    {intl.formatMessage({
                        id: 'dashboard.bridge.dontHaveWallet',
                        defaultMessage: 'Don\'t have wallet?',
                    })}
                    <Button
                        type='link'
                        size='middle'
                    >
                        {intl.formatMessage({
                            id: 'dashboard.bridge.downloadHere',
                            defaultMessage: 'Download here',
                        })}
                    </Button>
                </div>
            </div>
        </>
    )
}

export const MetaMask: React.FC<{
    setWaitingModal: React.Dispatch<React.SetStateAction<boolean>>;
    setWalletType: (value: React.SetStateAction<string>) => void;
}> = ({ setWaitingModal, setWalletType }) => {
    const {
        connect,
    } = useModel("metaMask");

    return (
        <>
            <div
                className={style.appItem}
                onClick={async () => {
                    setWaitingModal(true);
                    setWalletType('Metamask');
                    await connect();
                    setWaitingModal(false);
                }}
            >
                <Image
                    src='/images/sns/metamask_circle.svg'
                    className={style.appIcon}
                    preview={false}
                />
                <div className={style.info}>
                    <span className={style.name}>Metamask</span>
                    <span className={style.desc}>Connect using browser wallet</span>
                </div>
                <RightOutlined className={style.rightArrow} />
            </div>
        </>
    )
}

export default MetaMask;
