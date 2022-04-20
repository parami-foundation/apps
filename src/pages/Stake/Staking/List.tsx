import React from 'react';
import style from './style.less';
import PairItem from './components/PairItem';
import { useModel } from 'umi';

const List: React.FC = () => {
	const { LPsArr } = useModel('stake');

	return (
		<div className={style.stakeListContainer}>
			{LPsArr.map((lp: any) => (
				<PairItem
					logo={lp.icon}
					lp={lp}
				/>
			))}
		</div>
	)
}

export default List;
