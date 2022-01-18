import React from 'react';
import { useIntl } from 'umi';
import style from './style.less';
import PairItem from './components/PairItem';

const List: React.FC = () => {
    const intl = useIntl();

    return (
        <>
            <div className={style.stakeListContainer}>
                <PairItem logo={'http://localhost:8000/images/crypto/eth-circle.svg'} />
            </div>
        </>
    )
}

export default List;
