import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { Typography, Image, Card, Button, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Security: React.FC = () => {
    const intl = useIntl();

    const { Title } = Typography;

    return (
        <>
            <Title
                level={3}
                className={style.sectionTitle}
            >
                <Image
                    src='/images/icon/safe.svg'
                    className={style.sectionIcon}
                    preview={false}
                />
                {intl.formatMessage({
                    id: 'profile.security.title',
                    defaultMessage: 'Security'
                })}
            </Title>
            <Title
                level={5}
                className={style.sectionSubtitle}
            >
                {intl.formatMessage({
                    id: 'profile.security.subtitle',
                    defaultMessage: 'Most Secure (Recommended)'
                })}
                <Tooltip
                    placement="top"
                    title={intl.formatMessage({
                        id: 'profile.security.subtitle.tip',
                        defaultMessage: 'Passphrases can be secure if used correctly (they must be written down and stored safely).'
                    })}
                >
                    <ExclamationCircleOutlined className={style.infoIcon} />
                </Tooltip>
            </Title>
            <div className={style.security}>
                <Card
                    className={`${styles.card} ${style.securityCard}`}
                    bodyStyle={{
                        padding: 0,
                        width: '100%',
                    }}
                >
                    <div className={style.field}>
                        <div className={style.title}>
                            {intl.formatMessage({
                                id: 'profile.accountDetails.passphrase',
                                defaultMessage: 'Passphrase'
                            })}
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'common.enable',
                                    defaultMessage: 'Enable'
                                })}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default Security;
