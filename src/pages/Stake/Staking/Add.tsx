import { RightOutlined } from '@ant-design/icons';
import { Button, Input, Image, message, notification } from 'antd';
import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '../style.less';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { AddLiquidity } from '@/services/parami/Swap';
import AD3 from '@/components/Token/AD3';
import Token from '@/components/Token/Token';
import { FloatStringToBigInt } from '@/utils/format';
import { DrylyAddLiquidity } from '@/services/parami/RPC';
import SelectAsset from '@/components/SelectAsset/SelectAsset';

const Add: React.FC<{
    setAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setAddModal }) => {
    const { wallet } = useModel('currentUser');
    const { balance: ad3Balance } = useModel('balance');
    const { getTokenList } = useModel('stake');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [targetAd3Number, setNumber] = useState<string>('0');
    const [token, setToken] = useState<Record<string, string>>({});
    const [secModal, setSecModal] = useState<boolean>(false);
    const [passphrase, setPassphrase] = useState<string>('');
    const [selectModal, setSelectModal] = useState<boolean>(false);
    const [tokenAmount, setTokenAmount] = useState<any[]>([]);

    const intl = useIntl();

    const handleSubmit = async (preTx?: boolean, account?: string) => {
        if (!!wallet && !!wallet?.keystore) {
            setSubmitting(true);
            try {
                const info: any = await AddLiquidity(token?.id, FloatStringToBigInt(targetAd3Number, 18).toString(), tokenAmount[1], tokenAmount[0], passphrase, wallet?.keystore, preTx, account);
                setSubmitting(false);
                if (preTx && account) {
                    return info
                }

                getTokenList();
            } catch (e: any) {
                message.error(e);
            }
            setSubmitting(false);
            setAddModal(false);
        } else {
            notification.error({
                key: 'accessDenied',
                message: intl.formatMessage({
                    id: 'error.accessDenied',
                }),
                duration: null,
            })
        }
    };

    return (
        <>
            <div className={styles.mining}>
                <div className={styles.field}>
                    <div className={styles.label}>
                        {intl.formatMessage({
                            id: 'stake.add.selectAssets',
                        })}
                    </div>
                    <div
                        className={styles.selectAssets}
                        onClick={() => {
                            setNumber('0');
                            setTokenAmount([]);
                            setSelectModal(true)
                        }}
                    >
                        <div className={styles.title}>
                            {token.symbol && (
                                <>
                                    <Image
                                        className={styles.icon}
                                        src={token?.icon || '/images/logo-round-core.svg'}
                                        fallback='/images/logo-round-core.svg'
                                        preview={false}
                                    />
                                    <span className={styles.name}>{token.symbol}</span>
                                </>
                            )}
                            {!token.symbol && (
                                <span className={styles.name}>
                                    {intl.formatMessage({
                                        id: 'stake.add.pleaseSelect',
                                    })}
                                </span>
                            )}
                        </div>
                        <div className={styles.token}>
                            <Token value={token?.balance} symbol={token?.symbol} />
                            <RightOutlined
                                style={{
                                    color: '#ff5b00',
                                    marginLeft: 10,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.field}>
                    <div
                        className={styles.label}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <span>
                            {intl.formatMessage({
                                id: 'stake.add.number.label',
                            })}
                        </span>
                        <span>
                            {intl.formatMessage({
                                id: 'stake.add.number.available',
                            })}:<AD3 value={ad3Balance?.free} />
                        </span>
                    </div>
                    <div className={styles.inputAndButton}>
                        <Input
                            autoFocus
                            size='large'
                            className={styles.input}
                            placeholder={'0'}
                            value={targetAd3Number}
                            onChange={(e) => {
                                setNumber(e.target.value);
                                DrylyAddLiquidity(token.id, FloatStringToBigInt(e.target.value, 18).toString()).then((res: any) => {
                                    setTokenAmount(res);
                                });
                            }}
                            disabled={submitting || !Object.keys(token).length}
                            type='number'
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.label}>
                        {intl.formatMessage({
                            id: 'stake.add.overview',
                        })}
                    </div>
                    <div className={styles.listBtn}>
                        <div className={styles.field}>
                            <span className={styles.title}>
                                {intl.formatMessage({
                                    id: 'stake.add.tokenAmount',
                                })}
                            </span>
                            <span
                                className={styles.value}
                                style={{
                                    color: 'green',
                                }}
                            >
                                <Token value={tokenAmount[0]} symbol={token.symbol} />
                            </span>
                        </div>
                        <div className={styles.field}>
                            <span className={styles.title}>
                                {intl.formatMessage({
                                    id: 'stake.add.lptokenAmount',
                                })}
                            </span>
                            <span
                                className={styles.value}
                                style={{
                                    color: 'green',
                                }}
                            >
                                <Token value={tokenAmount[1]} />
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.actionButtons}>
                    <Button
                        type='primary'
                        shape='round'
                        size='large'
                        className={styles.button}
                        loading={submitting}
                        disabled={FloatStringToBigInt(targetAd3Number, 18) <= BigInt(0) ||
                            FloatStringToBigInt(targetAd3Number, 18) > BigInt(ad3Balance?.free) ||
                            tokenAmount.length === 0 ||
                            (tokenAmount.length > 0 && BigInt(tokenAmount[0]) > BigInt(token?.balance ?? '0'))}
                        onClick={() => {
                            setSubmitting(true);
                            setSecModal(true);
                        }}
                    >
                        {intl.formatMessage({
                            id: 'stake.add.title',
                        })}
                    </Button>
                </div>
            </div>

            {selectModal && <SelectAsset
                onClose={() => setSelectModal(false)}
                onSelectAsset={asset => {
                    setToken(asset);
                    setSelectModal(false);
                }}
            ></SelectAsset>}

            <SecurityModal
                visable={secModal}
                setVisable={setSecModal}
                passphrase={passphrase}
                setPassphrase={setPassphrase}
                func={handleSubmit}
            />
        </>
    );
};

export default Add;
