import { Button, Col, notification, Progress, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import style from './style.less';
import { FaFolderPlus, FaFileImport } from 'react-icons/fa';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { KickNFT } from '@/services/parami/nft';
import Import from './Import';
import Skeleton from '@/components/Skeleton';

const NFTs: React.FC = () => {
    const apiWs = useModel('apiWs');
    const [coverWidth, setCoverWidth] = useState<number>(0);
    const [importModal, setImportModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [secModal, setSecModal] = useState(false);
    const [password, setPassword] = useState('');
    const [NFTData, setNFTData] = useState<any[]>([]);
    const [mode, setMode] = useState<string>('create');

    const intl = useIntl();
    const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

    const coverRef: any = useRef();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            switch (mode) {
                case 'create':
                    await KickNFT(password, controllerKeystore);
                    setLoading(false);
                    break;
                case 'import':
                    setImportModal(true);
                    setLoading(false);
                    break;
            }
        } catch (e: any) {
            notification.error({
                message: e.message,
                duration: null,
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        if (NFTData.length) {
            setCoverWidth(coverRef.current.clientWidth);
        }
    }, [coverRef]);

    return (
        <>
            <div className={style.nftsContainer}>
                <Skeleton
                    loading={!apiWs}
                    height={200}
                    children={
                        !NFTData.length ? (
                            <div className={style.noNFTs}>
                                <img
                                    src={'/images/icon/query.svg'}
                                    className={style.topImage}
                                />
                                <div className={style.description}>
                                    {intl.formatMessage({
                                        id: 'wallet.nfts.empty',
                                    })}
                                </div>
                                <div className={style.buttons}>
                                    <Row
                                        gutter={[8, 8]}
                                        className={style.buttonRow}
                                    >
                                        <Col span={12}>
                                            <Button
                                                block
                                                type='primary'
                                                shape='round'
                                                size='large'
                                                className={style.button}
                                                loading={loading}
                                                onClick={() => {
                                                    setMode('create');
                                                    setSecModal(true);
                                                }}
                                            >
                                                {intl.formatMessage({
                                                    id: 'wallet.nfts.create',
                                                })}
                                            </Button>
                                        </Col>
                                        <Col span={12}>
                                            <Button
                                                block
                                                type='primary'
                                                shape='round'
                                                size='large'
                                                className={style.button}
                                                loading={loading}
                                                onClick={async () => {
                                                    setMode('import');
                                                    setSecModal(true);
                                                }}
                                            >
                                                {intl.formatMessage({
                                                    id: 'wallet.nfts.import',
                                                })}
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        ) : (
                            <div className={style.nftsList}>
                                <div className={`${style.nftItem} ${style.unmint}`}>
                                    <div className={style.card}>
                                        <div className={style.cardWrapper}>
                                            <div className={style.cardBox}>
                                                <div
                                                    className={style.cover}
                                                    ref={coverRef}
                                                    style={{
                                                        backgroundImage: 'url(https://manofmany.com/wp-content/uploads/2021/09/What-is-an-NFT-1.jpg)',
                                                        height: coverWidth,
                                                    }}
                                                >
                                                    <div className={style.nftID}>
                                                        #13
                                                    </div>
                                                </div>
                                                <div
                                                    className={style.filterImage}
                                                />
                                                <div className={style.cardDetail}>
                                                    <h3 className={style.text}>
                                                        MOBLAND Mystery Box
                                                    </h3>
                                                    <div className={style.status}>
                                                        <div className={style.label}>
                                                            {intl.formatMessage({
                                                                id: 'wallet.nfts.status',
                                                                defaultMessage: 'Status',
                                                            })}
                                                        </div>
                                                        <div className={style.value}>
                                                            Rasing
                                                        </div>
                                                    </div>
                                                    <div className={style.action}>
                                                        <Progress
                                                            percent={12}
                                                            strokeColor='#ff5b00'
                                                            className={style.progress}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${style.nftItem} ${style.unmint}`}>
                                    <div className={style.card}>
                                        <div className={style.cardWrapper}>
                                            <div className={style.cardBox}>
                                                <div
                                                    className={style.cover}
                                                    ref={coverRef}
                                                    style={{
                                                        backgroundImage: 'url(https://manofmany.com/wp-content/uploads/2021/09/What-is-an-NFT-1.jpg)',
                                                        height: coverWidth,
                                                    }}
                                                >
                                                    <div className={style.nftID}>
                                                        #13
                                                    </div>
                                                </div>
                                                <div
                                                    className={style.filterImage}
                                                />
                                                <div className={style.cardDetail}>
                                                    <h3 className={style.text}>
                                                        MOBLAND Mystery Box
                                                    </h3>
                                                    <div className={style.status}>
                                                        <div className={style.label}>
                                                            {intl.formatMessage({
                                                                id: 'wallet.nfts.status',
                                                                defaultMessage: 'Status',
                                                            })}
                                                        </div>
                                                        <div className={style.value}>
                                                            Can Mint
                                                        </div>
                                                    </div>
                                                    <div className={style.action}>
                                                        <Button
                                                            block
                                                            type='primary'
                                                            shape='round'
                                                            size='middle'
                                                        >
                                                            {intl.formatMessage({
                                                                id: 'wallet.nfts.mint',
                                                                defaultMessage: 'Mint',
                                                            })}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.nftItem}>
                                    <div className={style.card}>
                                        <div className={style.cardWrapper}>
                                            <div className={style.cardBox}>
                                                <div
                                                    className={style.cover}
                                                    ref={coverRef}
                                                    style={{
                                                        backgroundImage: 'url(https://manofmany.com/wp-content/uploads/2021/09/What-is-an-NFT-1.jpg)',
                                                        height: coverWidth,
                                                    }}
                                                >
                                                    <div className={style.nftID}>
                                                        #13
                                                    </div>
                                                </div>
                                                <div
                                                    className={style.filterImage}
                                                />
                                                <div className={style.cardDetail}>
                                                    <h3 className={style.text}>
                                                        MOBLAND Mystery Box
                                                    </h3>
                                                    <div className={style.status}>
                                                        <div className={style.label}>
                                                            {intl.formatMessage({
                                                                id: 'wallet.nfts.status',
                                                                defaultMessage: 'Status',
                                                            })}
                                                        </div>
                                                        <div className={style.value}>
                                                            Minted
                                                        </div>
                                                    </div>
                                                    <div className={style.action}>
                                                        <Button
                                                            block
                                                            type='primary'
                                                            shape='round'
                                                            size='middle'
                                                        >
                                                            {intl.formatMessage({
                                                                id: 'wallet.nfts.gotoNFTDAO',
                                                                defaultMessage: 'NFT DAO',
                                                            })}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.newItem}>
                                    <div className={style.card}>
                                        <Button
                                            className={style.createNFT}
                                            loading={loading}
                                            onClick={() => {
                                                setMode('create');
                                                setSecModal(true);
                                            }}
                                        >
                                            <FaFolderPlus
                                                className={style.icon}
                                            />
                                            {intl.formatMessage({
                                                id: 'wallet.nfts.create',
                                            })}
                                        </Button>
                                        <span className={style.divider} />
                                        <Button
                                            className={style.importNFT}
                                            loading={loading}
                                            onClick={() => {
                                                setMode('import');
                                                setSecModal(true);
                                            }}
                                        >
                                            <FaFileImport
                                                className={style.icon}
                                            />
                                            {intl.formatMessage({
                                                id: 'wallet.nfts.import',
                                            })}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                />
            </div>

            <Import
                importModal={importModal}
                setImportModal={setImportModal}
                password={password}
                keystore={controllerKeystore}
            />

            <SecurityModal
                visable={secModal}
                setVisable={setSecModal}
                password={password}
                setPassword={setPassword}
                func={handleSubmit}
            />
        </>
    )
}

export default NFTs;
