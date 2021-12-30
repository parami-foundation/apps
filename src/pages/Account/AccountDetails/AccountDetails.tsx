import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { Typography, Image, Card, Button, Tooltip } from 'antd';
import { CopyOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons';
import AD3 from '@/components/Token/AD3';

const AccountDetails: React.FC = () => {
    const intl = useIntl();

    const { Title } = Typography;

    return (
        <>
            <Title
                level={3}
                className={style.sectionTitle}
            >
                <Image
                    src='/images/icon/mine.svg'
                    className={style.sectionIcon}
                />
                {intl.formatMessage({
                    id: 'profile.accountDetails.title',
                    defaultMessage: 'Account Details'
                })}
            </Title>
            <Card
                className={styles.card}
                bodyStyle={{
                    padding: 0,
                    width: '100%',
                }}
                style={{
                    marginTop: 30,
                }}
            >
                <div className={style.accountDetails}>
                    <div className={style.field}>
                        <div className={style.title}>
                            {intl.formatMessage({
                                id: 'profile.accountDetails.nickname',
                                defaultMessage: 'Nickname'
                            })}
                        </div>
                        <div className={style.idCody}>
                            Hikaru
                            <Button
                                size='middle'
                                shape='circle'
                                icon={<FormOutlined />}
                                className={style.valueButton}
                            />
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            {intl.formatMessage({
                                id: 'profile.accountDetails.DID',
                                defaultMessage: 'DID'
                            })}
                        </div>
                        <div className={style.idCody}>
                            did:ad3:xxxx
                            <Button
                                size='middle'
                                shape='circle'
                                icon={<CopyOutlined />}
                                className={style.valueButton}
                            />
                        </div>
                    </div>
                    <div className={style.field}>
                        <div className={style.title}>
                            {intl.formatMessage({
                                id: 'profile.accountDetails.walletBalance',
                                defaultMessage: 'Wallet Balance'
                            })}
                        </div>
                        <div className={style.value}>
                            <AD3 value={'123'} />
                        </div>
                    </div>
                    <div className={style.balanceDetail}>
                        <div className={style.field}>
                            <div className={style.title}>
                                {intl.formatMessage({
                                    id: 'profile.accountDetails.reservedBalance',
                                    defaultMessage: 'Reserved balance'
                                })}
                                <Tooltip
                                    placement="top"
                                    title={intl.formatMessage({
                                        id: 'profile.accountDetails.reservedBalance.tip',
                                        defaultMessage: 'Up to 0.01 AD3 is reserved to cover the cost of transactions.'
                                    })}
                                >
                                    <ExclamationCircleOutlined className={style.infoIcon} />
                                </Tooltip>
                            </div>
                            <div className={style.value}>
                                <AD3 value={'123'} />
                            </div>
                        </div>
                        <div className={style.field}>
                            <div className={style.title}>
                                {intl.formatMessage({
                                    id: 'profile.accountDetails.availableBalance',
                                    defaultMessage: 'Available balance'
                                })}
                                <Tooltip
                                    placement="top"
                                    title={intl.formatMessage({
                                        id: 'profile.accountDetails.availableBalance.tip',
                                        defaultMessage: 'This is your spendable Parami balance, and can be used or transferred immediately.'
                                    })}
                                >
                                    <ExclamationCircleOutlined className={style.infoIcon} />
                                </Tooltip>
                            </div>
                            <div className={style.value}>
                                <AD3 value={'123'} />
                            </div>
                        </div>
                        <div className={style.field}>
                            <div className={style.title}>
                                {intl.formatMessage({
                                    id: 'profile.accountDetails.gasBalance',
                                    defaultMessage: 'Gas balance'
                                })}
                                <Tooltip
                                    placement="top"
                                    title={intl.formatMessage({
                                        id: 'profile.accountDetails.gasBalance.tip',
                                        defaultMessage: 'Gas balance tip'
                                    })}
                                >
                                    <ExclamationCircleOutlined className={style.infoIcon} />
                                </Tooltip>
                            </div>
                            <div className={style.value}>
                                <AD3 value={'123'} />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default AccountDetails;
