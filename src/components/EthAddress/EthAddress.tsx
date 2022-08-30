import React from 'react';
import { Image, Tag } from 'antd';
import { useModel } from 'umi';
import './EthAddress.less';
import { EthNetworkName } from '@/config/ethereumNetwork';
import { CloseCircleOutlined } from '@ant-design/icons';

export interface EthAddressProps {
    theme: 'wallet' | 'dashboard';
    supportedChainId?: number;
}

function EthAddress({ theme, supportedChainId }: EthAddressProps) {
    const { Account, ChainName, ChainId } = useModel('web3');

    const notSupported = supportedChainId && ChainId && supportedChainId !== ChainId;

    return <>
        {Account && (
            <div className={`addressContainer ${theme ?? 'wallet'} ${notSupported ? 'notSupported' : ''}`}>
                {notSupported && <>
                    <div className='error'>
                        <CloseCircleOutlined className='error-icon' />
                        Network Type Error
                    </div>
                    <div className='error-msg'>Please switch to {EthNetworkName[supportedChainId]}.</div>
                </>}

                {!notSupported && <>
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
                </>}
            </div>
        )}
    </>;
};

export default EthAddress;
