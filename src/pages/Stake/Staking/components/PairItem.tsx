import React from 'react';
import { useIntl } from 'umi';
import style from '../style.less';
import { Image } from 'antd';
const ICON_AD3 = '/images/logo-round-core.svg';

const PairItem: React.FC = () => {
    const intl = useIntl();

    return (
        <>
            <div className={style.stakeItem}>
                <div className={style.stakeMain}>
                    <div className={style.tokenPair}>
                        <div className={style.tokenIcons}>
                            <Image
                                src={ICON_AD3}
                                preview={false}
                                className={style.icon}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PairItem;
