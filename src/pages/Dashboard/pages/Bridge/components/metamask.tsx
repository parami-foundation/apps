import React from 'react';
import { useModel } from 'umi';
import { Image } from 'antd';
import style from './style.less';

const MetaMask: React.FC<{
    setSelectModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setSelectModal }) => {
    const {
        connect,
    } = useModel("metaMask");

    return (
        <>
            <div
                className={style.field}
                onClick={async () => {
                    await connect();
                    setSelectModal(false);
                }}
            >
                <Image
                    src={'/images/sns/metamask-logo.svg'}
                    height={30}
                    width={30}
                    preview={false}
                    wrapperClassName={style.icon}
                />
                <span>MetaMask</span>
            </div>
        </>
    )
}

export default MetaMask;
