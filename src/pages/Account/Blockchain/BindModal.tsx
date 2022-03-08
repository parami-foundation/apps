import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { LinkBlockChain } from '@/services/parami/linker';
import { solanaSignMessage } from '@/services/solana/solana';
import { signPolkadotMessage, signSolanaMessage } from '@/services/tokenpocket/tokenpocket';
import { signBSCMessage, signETHMessage } from '@/services/walletconnect/walletconnect';
import { hexToDid } from '@/utils/common';
import { DownOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Input, message, notification, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useIntl } from 'umi';
import style from '../style.less';

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

const BindModal: React.FC<{
    blockchain: string;
    setBindModal: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ blockchain, setBindModal, loading, setLoading }) => {
    const stmap = localStorage.getItem('stamp');
    const [errorState, setErrorState] = useState<API.Error>({});
    const [origin, setOrigin] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [signed, setSigned] = useState<string>('');
    const [password, setPassword] = useState<string>(stmap || '');
    const [secModal, setSecModal] = useState(false);
    const [type, setType] = useState<string>('');
    const [collapse, setCollapse] = useState<boolean>(false);

    const intl = useIntl();
    const { TextArea } = Input;

    const did = localStorage.getItem('did') as string;
    const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

    const handleSubmit = async () => {
        switch (type) {
            case 'walletconnect':
                try {
                    switch (blockchain) {
                        case 'Ethereum':
                            const { account: ethAccount, signedMsg: ethSignedMsg } = await signETHMessage(origin);
                            if (!!ethAccount && !!ethSignedMsg) {
                                notification.info({
                                    message: 'Got an signed message',
                                    description: ethSignedMsg,
                                    duration: 2
                                });
                                await LinkBlockChain(blockchain, ethAccount, ethSignedMsg, password, controllerKeystore);
                                setBindModal(false);
                            }
                            break;
                        case 'Binance':
                            const { account: bscAccount, signedMsg: bscSignedMsg } = await signBSCMessage(origin);
                            if (!!bscAccount && !!bscSignedMsg) {
                                notification.info({
                                    message: 'Got an signed message',
                                    description: bscSignedMsg,
                                    duration: 2
                                });
                                await LinkBlockChain(blockchain, bscAccount, bscSignedMsg, password, controllerKeystore);
                                setBindModal(false);
                            }
                            break;
                    }
                    setLoading(false);
                } catch (e: any) {
                    setErrorState({
                        Type: 'chain error',
                        Message: e.message,
                    });
                    console.log(e.message);
                    setLoading(false);
                    return;
                }
                break;
            case 'solana':
                try {
                    const { account, signedMsg }: any = await solanaSignMessage(origin);
                    if (!!account && !!signedMsg) {
                        notification.info({
                            message: 'Got an signed message',
                            description: `0x00${signedMsg}`,
                            duration: 2
                        })
                        await LinkBlockChain(blockchain, account, `0x00${signedMsg}`, password, controllerKeystore);
                        setBindModal(false);
                    }
                    setLoading(false);
                } catch (e: any) {
                    setErrorState({
                        Type: 'chain error',
                        Message: e.message,
                    });
                    setLoading(false);
                    return;
                }
                break;
            case 'tokenpocket':
                try {
                    let res: {
                        address: string,
                        result: string,
                    } = { address: '', result: '' }
                    switch (blockchain) {
                        case 'Solana':
                            res = await signSolanaMessage(origin);
                            break;
                        case 'Polkadot':
                            res = await signPolkadotMessage(origin);
                            break;
                    }
                    await LinkBlockChain(blockchain, res.address, res.result, password, controllerKeystore);
                    setBindModal(false);
                    setLoading(false);
                } catch (e: any) {
                    setErrorState({
                        Type: 'chain error',
                        Message: e.message,
                    });
                    setLoading(false);
                    return;
                }
                break;
            default:
                let Signed = signed;
                if (Signed.indexOf('0x') < 0) {
                    message.error(intl.formatMessage({
                        id: 'error.bind.signWrong',
                    }));
                    setLoading(false);
                    return;
                };
                if (blockchain === 'Polkadot' || blockchain === 'Solana') {
                    Signed = `0x00${signed}`;
                };
                try {
                    await LinkBlockChain(blockchain, address, Signed, password, controllerKeystore);
                    setBindModal(false);
                    setLoading(false);
                } catch (e: any) {
                    setErrorState({
                        Type: 'chain error',
                        Message: e.message,
                    });
                    setLoading(false);
                    return;
                }
                break;
        }
    };

    useEffect(() => {
        setOrigin(`Link: ${hexToDid(did)}`);
    }, []);

    useEffect(() => {
        if (blockchain === 'Ethereum' || blockchain === 'Binance' || blockchain === 'Polkadot' || blockchain === 'Solana' || blockchain === 'Tron') {
            setCollapse(true);
        } else {
            setCollapse(false);
        };
    }, [blockchain, password]);

    return (
        <>
            <Spin
                tip={intl.formatMessage({
                    id: 'common.submitting',
                })}
                spinning={loading}
            >
                <div className={style.bindModal}>
                    {errorState.Message && <Message content={errorState.Message} />}
                    {(blockchain === 'Ethereum' || blockchain === 'Binance') && (
                        <>
                            <Button
                                block
                                type='primary'
                                size='large'
                                shape='round'
                                className={style.iconButton}
                                icon={<img src={'/images/sns/walletconnect-white.svg'} />}
                                style={{
                                    backgroundColor: '#3B99FC',
                                }}
                                onClick={() => {
                                    setType('walletconnect');
                                    setSecModal(true);
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'social.blockchain.walletconnet',
                                })}
                            </Button>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onClick={() => {
                                    setCollapse(!collapse);
                                }}
                            >
                                <Divider>
                                    {intl.formatMessage({
                                        id: 'social.blockchain.manual',
                                    })}
                                    <Button
                                        type="link"
                                        icon={
                                            <DownOutlined
                                                rotate={!collapse ? 0 : -180}
                                                className={style.expandButtonIcon}
                                            />
                                        }
                                        onClick={() => {
                                            setCollapse(!collapse);
                                        }}
                                    />
                                </Divider>
                            </div>
                        </>
                    )}
                    {blockchain === 'Solana' && (
                        <>
                            <Button
                                block
                                type='primary'
                                size='large'
                                shape='round'
                                className={style.iconButton}
                                icon={<img src={'/images/crypto/solana-sol-logo.svg'} />}
                                style={{
                                    backgroundColor: '#512da8',
                                }}
                                onClick={() => {
                                    setType('solana');
                                    setSecModal(true);
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'social.blockchain.solana',
                                })}
                            </Button>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onClick={() => {
                                    setCollapse(!collapse);
                                }}
                            >
                                <Divider>
                                    {intl.formatMessage({
                                        id: 'social.blockchain.manual',
                                    })}
                                    <Button
                                        type="link"
                                        icon={
                                            <DownOutlined
                                                rotate={!collapse ? 0 : -180}
                                                className={style.expandButtonIcon}
                                            />
                                        }
                                        onClick={() => {
                                            setCollapse(!collapse);
                                        }}
                                    />
                                </Divider>
                            </div>
                        </>
                    )}
                    {(blockchain === 'Polkadot' || blockchain === 'Tron') && (
                        <>
                            <Button
                                block
                                type='primary'
                                size='large'
                                shape='round'
                                className={style.iconButton}
                                icon={<img src={'/images/sns/tokenpocket-white.svg'} />}
                                style={{
                                    backgroundColor: '#2980FE',
                                }}
                                onClick={() => {
                                    setType('tokenpocket');
                                    setSecModal(true);
                                }}
                            >
                                {intl.formatMessage({
                                    id: 'social.blockchain.tokenpocket',
                                })}
                            </Button>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onClick={() => {
                                    setCollapse(!collapse);
                                }}
                            >
                                <Divider>
                                    {intl.formatMessage({
                                        id: 'social.blockchain.manual',
                                    })}
                                    <Button
                                        type="link"
                                        icon={
                                            <DownOutlined
                                                rotate={!collapse ? 0 : -180}
                                                className={style.expandButtonIcon}
                                            />
                                        }
                                        onClick={() => {
                                            setCollapse(!collapse);
                                        }}
                                    />
                                </Divider>
                            </div>
                        </>
                    )}
                    <div
                        className={style.manualContainer}
                        style={{
                            maxHeight: !collapse ? '100vh' : 0,
                        }}
                    >
                        <div className={style.field}>
                            <div className={style.title}>
                                {intl.formatMessage({
                                    id: 'social.blockchain.originText',
                                })}
                            </div>
                            <div className={style.value}>
                                <CopyToClipboard
                                    text={origin}
                                    onCopy={() => message.success(
                                        intl.formatMessage({
                                            id: 'common.copied',
                                        })
                                    )}
                                >
                                    <Input
                                        readOnly
                                        size='large'
                                        value={origin}
                                    />
                                </CopyToClipboard>
                            </div>
                        </div>
                        <Divider>
                            {intl.formatMessage({
                                id: 'social.blockchain.tip',
                            })}
                        </Divider>
                        <div className={style.field}>
                            <div className={style.title}>
                                {intl.formatMessage({
                                    id: 'social.blockchain.signed',
                                })}
                            </div>
                            <div className={style.value}>
                                <TextArea
                                    size='large'
                                    rows={4}
                                    value={signed}
                                    onChange={(e) => { setSigned(e.target.value) }}
                                />
                            </div>
                        </div>
                        <div className={style.field}>
                            <div className={style.title}>
                                {intl.formatMessage({
                                    id: 'social.blockchain.address',
                                })}
                            </div>
                            <div className={style.value}>
                                <Input
                                    size='large'
                                    onChange={(e) => { setAddress(e.target.value) }}
                                />
                            </div>
                        </div>
                        <div className={style.field}>
                            <Button
                                block
                                size='large'
                                type='primary'
                                shape='round'
                                onClick={() => {
                                    setPassword('');
                                    setSecModal(true);
                                }}
                                disabled={!address || !signed}
                            >
                                {intl.formatMessage({
                                    id: 'common.submit',
                                })}
                            </Button>
                        </div>
                    </div>
                </div>
            </Spin>

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

export default BindModal;
