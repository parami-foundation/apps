import React from 'react';
import { useState } from 'react';
import { Button, Typography, Image } from 'antd';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import Add from './Staking/Add';
import List from './Staking/List';
import BigModal from '@/components/ParamiModal/BigModal';

const Staking: React.FC = () => {
    const [addModal, setAddModal] = useState<boolean>(false);

    const intl = useIntl();
    const { Title } = Typography;

    return (
        <>
            <div className={styles.mainTopContainer}>
                <div className={styles.pageContainer}>
                    <div className={style.headerContainer}>
                        <div className={style.titleContainer}>
                            <Title
                                level={2}
                                className={style.sectionTitle}
                            >
                                <Image
                                    src='/images/icon/stake.svg'
                                    className={style.sectionIcon}
                                    preview={false}
                                />
                                {intl.formatMessage({
                                    id: 'stake.title',
                                    defaultMessage: 'Staking'
                                })}
                            </Title>
                        </div>
                        <div className={style.subtitle}>
                            {intl.formatMessage({
                                id: 'stake.subtitle',
                                defaultMessage: 'Stake your Parami tokens with AD3',
                            })}
                        </div>
                        <div className={style.addNewStake}>
                            <Button
                                block
                                type='primary'
                                shape='round'
                                size='large'
                                className={style.stakeButton}
                                onClick={() => { setAddModal(true) }}
                            >
                                {intl.formatMessage({
                                    id: 'stake.add',
                                    defaultMessage: 'Stake My Tokens',
                                })}
                            </Button>
                        </div>
                    </div>
                    <List />
                </div>
            </div>

            <BigModal
                visable={addModal}
                title={
                    intl.formatMessage({
                        id: 'stake.add.selectAToken',
                        defaultMessage: 'Select a Token',
                    })
                }
                content={<Add />}
                footer={false}
                close={() => { setAddModal(false) }}
                bodyStyle={{
                    padding: 0
                }}
            />
        </>
    )
}

export default Staking;