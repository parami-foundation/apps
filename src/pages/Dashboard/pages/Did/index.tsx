/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/dashboard.less';
import style from './style.less';
import { Alert, Card, message, Tag } from 'antd';
import { hexToDid } from '@/utils/common';
import { formatBalance } from '@polkadot/util';
import { GetUserBalance } from '@/services/parami/wallet';
import { ReloadOutlined } from '@ant-design/icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import Assets from './components/Assets';
import { fromHexString } from '@/utils/hexcode';
import config from '@/config/config';
import { GetUserInfo } from '@/services/parami/ads';

const Message: React.FC<{
    content: string;
}> = ({ content }) => (
    <Alert
        style={{
            marginBottom: 24,
        }}
        message={content}
        type="error"
        showIcon
    />
);

const Did: React.FC = () => {
    const [TotalBalance, setTotalBalance] = useState<any>(null);
    const [FreeBalance, setFreeBalance] = useState<any>(null);
    const [Reserved, setReserved] = useState<any>(null);
    const [Nonce, setNonce] = useState<any>(null);
    const [errorState, setErrorState] = useState<API.Error>({});
    const [assetsBalance, setAssetsBalance] = useState<any[]>([]);
    const [avatar, setAvatar] = useState<string>();

    const intl = useIntl();

    const did = localStorage.getItem('dashboardDid') as string;
    const currentAccount = localStorage.getItem('dashboardCurrentAccount') as string;
    const assets = localStorage.getItem('dashboardAssets');

    const getUserInfo = async () => {
        try {
            const info = await GetUserInfo(fromHexString(did) as Uint8Array);
            const userInfo = info.toHuman();
            if (!userInfo) {
                return;
            }
            if (userInfo['avatar'].indexOf('ipfs://') > -1) {
                const hash = userInfo['avatar'].substring(7);

                setAvatar(config.ipfs.endpoint + hash)
            }
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    };

    const updateAssetsBalance = async () => {
        const data: any[] = [];
        if (!!assets) {
            const tmp = JSON.parse(assets);
            for (const assetsID in tmp) {
                const currentAddress = JSON.parse(currentAccount).address;
                const { balance }: any = await window.apiWs.query.assets.account(Number(assetsID), currentAddress);
                if (!!balance) {
                    data.push({
                        token: tmp[assetsID].name,
                        balance: formatBalance(balance, { decimals: 18, withUnit: tmp[assetsID].symbol }),
                        value: '-'
                    });
                }
            }
            setAssetsBalance(data);
        }
    };

    const getBalance = async () => {
        try {
            const stashUserAddress = localStorage.getItem('dashboardStashUserAddress');

            const { freeBalance, reserved, totalBalance, nonce }: any = await GetUserBalance(stashUserAddress as string);

            setFreeBalance(`${freeBalance}`);
            setReserved(`${reserved}`);
            setTotalBalance(`${totalBalance}`);
            setNonce(`${nonce}`);
        } catch (e: any) {
            setErrorState({
                Type: 'chain error',
                Message: e.message,
            });
        }
    };

    useEffect(() => {
        getUserInfo();
        getBalance();
        updateAssetsBalance();
    }, []);

    return (
        <>
            <div className={styles.mainContainer}>
                {errorState.Message && <Message content={errorState.Message} />}
                <div className={styles.contentContainer}>
                    <Card
                        className={styles.dashboardCard}
                    >
                        <div className={style.profileCard}>
                            <div className={style.avatar}>
                                <img src={avatar || '/images/logo-square-core.svg'} />
                            </div>
                            <div className={style.profile}>
                                <div className={style.totalBalance}>
                                    <div className={styles.title}>
                                        {intl.formatMessage({
                                            id: 'dashboard.did.balance',
                                            defaultMessage: 'Balance',
                                        })}
                                    </div>
                                    <div className={style.amount}>
                                        {formatBalance(TotalBalance, { withUnit: 'AD3' }, 18)}
                                        <ReloadOutlined
                                            style={{
                                                fontSize: 20,
                                                fontWeight: 900,
                                                marginLeft: 10,
                                            }}
                                            onClick={() => getBalance()}
                                        />
                                    </div>
                                    <div className={style.availableBalance}>
                                        {intl.formatMessage({
                                            id: 'dashboard.did.availableBalance',
                                        })}
                                        : {formatBalance(FreeBalance, { withUnit: 'AD3' }, 18)}
                                    </div>
                                </div>
                                <CopyToClipboard
                                    text={hexToDid(did)}
                                    onCopy={() =>
                                        message.success(
                                            intl.formatMessage({
                                                id: 'common.copied',
                                            }),
                                        )
                                    }
                                >
                                    <Tag
                                        color="volcano"
                                        className={style.did}
                                    >
                                        {hexToDid(did)}
                                    </Tag>
                                </CopyToClipboard>
                            </div>
                        </div>
                    </Card>
                    <Assets
                        assetsBalance={assetsBalance}
                    />
                </div>
            </div>
        </>
    )
}

export default Did;
