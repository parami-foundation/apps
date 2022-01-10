import React, { useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import { Typography, Image, Card, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import MyAvatar from '@/components/Avatar/MyAvatar';
import Edit from './Edit';

const Avatar: React.FC = () => {
    const [modalVisable, setModalVisable] = useState<boolean>(false);

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
                    preview={false}
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
                    <span
                        onClick={() => { setModalVisable(true) }}
                    >
                        <MyAvatar
                            width={200}
                            height={200}
                        />
                    </span>
                </Card>
            </div>
            <Edit
                modalVisable={modalVisable}
                setModalVisable={setModalVisable}
            />
        </>
    )
}

export default Avatar;