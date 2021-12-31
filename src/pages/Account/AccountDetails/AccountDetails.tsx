import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { Typography, Image, Card, Button, Tooltip, message } from 'antd';
import { CopyOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons';
import AD3 from '@/components/Token/AD3';
import { hexToDid } from '@/utils/common';
import CopyToClipboard from 'react-copy-to-clipboard';
import Nickname from './Nickname';

const AccountDetails: React.FC = () => {
    const { controller, stash } = useModel('balance');
    const { nickname } = useModel('user');
    const [nicknameModal, setNicknameModal] = useState<boolean>(false);

    const did = localStorage.getItem('did') as string;

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
                    preview={false}
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
                            <span className={style.text}>
                                {nickname || 'Nickname'}
                            </span>
                            <Button
                                size='middle'
                                shape='circle'
                                icon={<FormOutlined />}
                                className={style.valueButton}
                                onClick={() => {
                                    setNicknameModal(true);
                                }}
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
                            <span className={style.text}>
                                {hexToDid(did)}
                            </span>
                            <CopyToClipboard
                                text={did}
                                onCopy={() => {
                                    message.success(
                                        intl.formatMessage({
                                            id: 'common.copied',
                                        }),
                                    )
                                }}
                            >
                                <Button
                                    size='middle'
                                    shape='circle'
                                    icon={<CopyOutlined />}
                                    className={style.valueButton}
                                />
                            </CopyToClipboard>
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
                            <AD3 value={stash?.total} />
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
                                <AD3 value={stash?.reserved} />
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
                                <AD3 value={stash?.free} />
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
                                <AD3 value={controller?.free} />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Nickname
                nicknameModal={nicknameModal}
                setNicknameModal={setNicknameModal}
            />
        </>
    )
}

export default AccountDetails;
