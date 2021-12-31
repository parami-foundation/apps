import MyAvatar from '@/components/Avatar/MyAvatar';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { LinkBlockChain } from '@/services/parami/linker';
import { signPolkadotMessage, signSolanaMessage } from '@/services/tokenpocket/tokenpocket';
import { signPersonalMessage } from '@/services/walletconnect/walletconnect';
import { hexToDid } from '@/utils/common';
import { DownOutlined } from '@ant-design/icons';
import { convertUtf8ToHex } from '@walletconnect/utils';
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
    blockchain: string,
    setBindModal: React.Dispatch<React.SetStateAction<boolean>>,
}> = ({ blockchain, setBindModal }) => {
    const stmap = localStorage.getItem('stamp');
    const [errorState, setErrorState] = useState<API.Error>({});
    const [origin, setOrigin] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [signed, setSigned] = useState<string>('');
    const [password, setPassword] = useState<string>(stmap || '');
    const [secModal, setSecModal] = useState(false);
    const [type, setType] = useState<string>('');
    const [collapse, setCollapse] = useState<boolean>(false);
    const [WConnected, setWConnected] = useState<boolean>(false);
    const [connector, setConnector] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const intl = useIntl();
    const { TextArea } = Input;

    const did = localStorage.getItem('did') as string;
    const controllerKeystore = localStorage.getItem('controllerKeystore') as string;

    const sign = async () => {
        const signedMsg = await connector.signPersonalMessage([convertUtf8ToHex('asddasdas'), address])
        console.log(signedMsg);
    };

    const handleSubmit = async () => {
        setLoading(true);
        switch (type) {
            case 'walletconnect':
                try {
                    const { account, signedMsg } = await signPersonalMessage(origin);
                    notification.info({
                        message: 'Got an signed message',
                        description: signedMsg,
                        duration: 2
                    })
                    await LinkBlockChain(blockchain, account, signedMsg, password, controllerKeystore);
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
            case 'tokenpocket':
                try {
                    let res: {
                        address: string,
                        result: string,
                    } = { address: '', result: '' }
                    switch (blockchain) {
                        case 'Solana':
                            res = await signSolanaMessage(origin);
                        case 'Polkadot':
                            res = await signPolkadotMessage(origin);
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
                    Signed = `0x00${signed.substring(2)}`;
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
        }
    };

    useEffect(() => {
        setOrigin(`Link: ${hexToDid(did)}`);
    }, []);

    useEffect(() => {
        if (blockchain === 'Ethereum' || blockchain === 'Polkadot' || blockchain === 'Solana' || blockchain === 'Tron') {
            setCollapse(true);
        } else {
            setCollapse(false);
        };
    }, [blockchain, password]);

    useEffect(() => {
        console.log('Connection status changed')
        if (WConnected) {
            sign();
        }
    }, [WConnected]);

    useEffect(() => { }, [signed, address]);

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
                    {blockchain === 'Ethereum' && (
                        <>
                            <Button
                                block
                                type='primary'
                                size='large'
                                shape='round'
                                className={style.iconButton}
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
                    {(blockchain === 'Polkadot' || blockchain === 'Solana' || blockchain === 'Tron') && (
                        <>
                            <Button
                                block
                                type='primary'
                                size='large'
                                shape='round'
                                className={style.iconButton}
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
