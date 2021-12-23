import React from 'react';
import style from './style.less';
import { Image } from 'antd';
import { useModel } from 'umi';

const ETHAddress: React.FC = () => {
    const { account } = useModel('metaMask');

    return (
        <>
            {account && (
                <div className={style.addressContainer}>
                    <div className={style.ethLogo}>
                        <Image
                            src={'/images/crypto/eth-circle.svg'}
                            preview={false}
                            className={style.ethLogoImg}
                        />
                        ETH Address
                    </div>
                    <div className={style.currentAddress}>
                        <span className={style.prefix}>
                            Current Address:
                        </span>
                        <span className={style.address}>
                            {account}
                        </span>
                    </div>
                </div>
            )}
        </>
    )
}

export default ETHAddress;
