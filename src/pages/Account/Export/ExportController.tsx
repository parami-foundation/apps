import { Typography, Image, Card, Button } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';

const ExportController: React.FC = () => {
    const intl = useIntl();

    const { Title } = Typography;

    return (
        <>
            <Title
                level={3}
                className={style.sectionTitle}
            >
                <Image
                    src='/images/icon/backup.svg'
                    className={style.sectionIcon}
                    preview={false}
                />
                {intl.formatMessage({
                    id: 'profile.export.title',
                    defaultMessage: 'Export'
                })}
            </Title>
            <div className={style.export}>
                <Card
                    className={`${styles.card} ${style.exportCard}`}
                    bodyStyle={{
                        padding: 0,
                        width: '100%',
                    }}
                >
                    <div className={style.field}>
                        <div className={style.title}>
                            {intl.formatMessage({
                                id: 'profile.export.exportController',
                                defaultMessage: 'Export Controller'
                            })}
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'common.export',
                                    defaultMessage: 'Export'
                                })}
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card
                    className={`${styles.card} ${style.exportCard}`}
                    bodyStyle={{
                        padding: 0,
                        width: '100%',
                    }}
                >
                    <div className={style.field}>
                        <div className={style.title}>
                            {intl.formatMessage({
                                id: 'profile.export.exportAll',
                                defaultMessage: 'Export All'
                            })}
                        </div>
                        <div className={style.button}>
                            <Button
                                size='large'
                                shape='round'
                                type='primary'
                            >
                                {intl.formatMessage({
                                    id: 'common.export',
                                    defaultMessage: 'Export'
                                })}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default ExportController;
