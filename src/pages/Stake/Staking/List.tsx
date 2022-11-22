import React, { useEffect } from 'react';
import style from './style.less';
import PairItem from './components/PairItem';
import { useModel } from 'umi';

const List: React.FC = () => {
	const { LPsArr, getTokenList } = useModel('stake');
	const apiWs = useModel('apiWs');
	const { wallet } = useModel('currentUser');

	useEffect(() => {
		if (apiWs && wallet?.account) {
			getTokenList();
		}
	}, [apiWs, wallet]);

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
