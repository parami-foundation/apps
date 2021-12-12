import React from 'react';
import style from './style.less';
import MetaMask from './metamask';

const SelectWallet: React.FC<{
    setSelectModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setSelectModal }) => {
    return (
        <>
            <div className={style.selectWallet}>
                <MetaMask setSelectModal={setSelectModal} />
            </div>
        </>
    )
}

export default SelectWallet;
