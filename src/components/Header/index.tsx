import React from 'react';
import style from './style.less';
import { useIntl } from 'umi';

const Header: React.FC = () => {
    const intl = useIntl();

    return (
        <div className={style.headerContainer}>
        </div>
    )
}

export default Header;
