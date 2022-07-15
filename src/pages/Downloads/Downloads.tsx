import Footer from '@/components/Footer';
import { Layout, Typography, Image, Card } from 'antd';
import React from 'react';
import style from './style.less';
import config from '@/config/config';
import styles from '@/pages/wallet.less';
import { Link } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;

export interface DownloadsProps { }

function Downloads({ }: DownloadsProps) {
    return <>
        <Layout className='download-center'>
            <Header className={style.downloadCenterHeader}>
                <div
                    className="headerLogo"
                    onClick={() => {
                        window.location.href = config.page.homePage;
                    }}
                >
                    <img src="/images/logo-text.svg" />
                </div>
            </Header>
            <Content>
                <div className={style.container}>
                    <div style={{ width: '100%' }}>
                        <Title
                            level={3}
                            className={style.sectionTitle}
                        >
                            <Image
                                src='/images/icon/down.svg'
                                className={style.sectionIcon}
                                preview={false}
                            />
                            Downloads
                        </Title>

                        <Card className={styles.card}
                            bodyStyle={{
                                padding: 0,
                                width: '100%',
                            }}
                            style={{
                                marginTop: 30,
                            }}>
                            <div className={style.item}>
                                <div className={style.itemTitle}>
                                    Parami Chrome Extension
                                </div>
                                <div className={style.itemLink}>
                                    <Link to="/files/parami-extension.zip" target="_blank" download>
                                        <DownloadOutlined style={{ marginRight: '5px' }} />
                                        Download
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Content>
            <Footer></Footer>
        </Layout>
    </>;
};

export default Downloads;
