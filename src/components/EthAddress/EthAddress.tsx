import React from 'react';
import { Image, Tag } from 'antd';
import { useModel } from 'umi';
import './EthAddress.less';

export interface EthAddressProps {
    theme: 'wallet' | 'dashboard'
}

function EthAddress({ theme }: EthAddressProps) {
    const { Account, ChainName, ChainId } = useModel('web3');

    return <>
        {Account && (
            <div className={`addressContainer ${theme ?? 'wallet'}`}>
                <div className='ethLogo'>
                    <Image
                        src={'/images/crypto/eth-circle.svg'}
                        preview={false}
                        className='ethLogoImg'
                    />
                    ETH Address
                </div>
                {!!ChainId && ChainId !== 1 && <>
                    <Tag color="orange">{ChainName}</Tag>
                </>}
                <div className='currentAddress'>
                    <span className='prefix'>
                        Current Address:
                    </span>
                    <span className='address'>
                        {Account}
                    </span>
                </div>
            </div>
        )}
    </>;
};

export default EthAddress;
