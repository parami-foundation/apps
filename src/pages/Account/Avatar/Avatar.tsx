import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { Typography, Image, Card, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import MyAvatar from '@/components/Avatar/MyAvatar';

const Avatar: React.FC = () => {
    const intl = useIntl();

    const { Title } = Typography;

    return (
        <>
            <Title
                level={3}
                className={style.sectionTitle}
            >
                <Image
                    src='/images/icon/camera.svg'
                    className={style.sectionIcon}
                />
                {intl.formatMessage({
                    id: 'profile.avatar.title',
                    defaultMessage: 'Avatar'
                })}
            </Title>
            <Title
                level={5}
                className={style.sectionSubtitle}
            >
                {intl.formatMessage({
                    id: 'profile.avatar.subtitle',
                    defaultMessage: 'Identification'
                })}
                <Tooltip
                    placement="top"
                    title={intl.formatMessage({
                        id: 'profile.avatar.subtitle.tip',
                        defaultMessage: 'The picture you uploaded will be added with did information, and then you can use this picture as an identification avatar.'
                    })}
                >
                    <ExclamationCircleOutlined className={style.infoIcon} />
                </Tooltip>
            </Title>
            <div className={style.avatar}>
                <Card
                    className={`${styles.card} ${style.avatarCard}`}
                    bodyStyle={{
                        padding: 0,
                        width: '100%',
                        display: 'flex',
                        alignContent: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MyAvatar
                        width={200}
                        height={200}
                    />
                </Card>
            </div>
        </>
    )
}

export default Avatar;
