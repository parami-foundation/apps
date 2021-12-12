import { EditOutlined } from '@ant-design/icons';
import { Alert, Button, Typography } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'umi';
import styles from './Guide.less';

const { Title } = Typography;

const Guide: React.FC = () => {
    const [avatar, setAvatar] = useState<any>();
    const [modalVisable, setModalVisable] = useState<boolean>(false);
    const [nicknameModal, setNicknameModal] = useState<boolean>(false);

    const intl = useIntl();

    return (
        <>
            <div className={styles.guide}>
                <Alert
                    message={intl.formatMessage({
                        id: 'wallet.guide.description',
                    })}
                    type="info"
                />
                <div
                    className={styles.avatar}
                    onClick={() => { setModalVisable(true) }}
                >
                    <img src={avatar || '/images/logo-square-core.svg'} />
                </div>
                <Title
                    level={2}
                    style={{
                        textAlign: 'center',
                        marginTop: 30,
                        marginBottom: 50,
                    }}
                >
                    {'Nickname'}
                    <EditOutlined
                        style={{
                            marginLeft: 10,
                        }}
                        onClick={() => { setNicknameModal(true) }}
                    />
                </Title>
                <Button
                    block
                    type="primary"
                    shape="round"
                    size="large"
                    className={styles.button}
                    onClick={() => { }}
                >
                    {intl.formatMessage({
                        id: 'common.continue',
                    })}
                </Button>
            </div>
        </>
    );
};

export default Guide;
