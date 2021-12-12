import React, { useEffect, useState } from 'react';
import { Button, Tooltip, Typography, message, notification, Alert } from 'antd';
import { useIntl, history } from 'umi';
import styles from '../style.less';
import { getTokenTransFee, getTransFee, Transfer, TransferAsset } from '@/services/parami/wallet';
import config from '@/config/config';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { didToHex } from '@/utils/common';
import { formatBalance } from '@polkadot/util';

const { Title } = Typography;

const Confirm: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<string>>;
  number: string;
  token: Record<string, number>;
  address: string;
  userAddress: string;
  keystore: string;
}> = ({ setStep, number, token, address, userAddress, keystore }) => {
  const [submitting, setSubmitting] = useState(false);
  const [fee, setFee] = useState<any>(null);
  const [errorState, setErrorState] = useState<API.Error>({});
  const [secModal, setSecModal] = useState(false);
  const [password, setPassword] = useState('');

  const intl = useIntl();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (Object.keys(token)[0] === 'AD3') {
        await Transfer(
          number.toString(),
          keystore,
          address,
          password,
        );
      } else {
        await TransferAsset(
          token[Object.keys(token)[0]],
          number.toString(),
          keystore,
          address,
          password,
        );
      }

      notification.success({
        message: intl.formatMessage({
          id: 'wallet.send.pending',
        }),
        description: (
          <>
            <p>
              {intl.formatMessage({
                id: 'wallet.send.receiverAddress',
              })}
              : {address}
            </p>
          </>
        ),
      });
      history.push(config.page.walletPage);
      setSubmitting(false);
    } catch (e: any) {
      setErrorState({
        Type: 'chain error',
        Message: e.message,
      });
      setPassword('');
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (password !== '') {
      handleSubmit();
    }
  }, [password]);

  const partialFee = async () => {
    setSubmitting(true);
    let toAddress = address;
    if (toAddress.indexOf('did:ad3:') > -1) {
      toAddress = didToHex(toAddress);
    };

    try {
      if (Object.keys(token)[0] === 'AD3') {
        const info = await getTransFee(toAddress, userAddress, number);
        setFee(formatBalance(info, { withUnit: 'AD3' }, 18));
      } else {
        const info = await getTokenTransFee(token[Object.keys(token)[0]], toAddress, userAddress, number);
        setFee(formatBalance(info, { withUnit: 'AD3' }, 18));
      }
    } catch (e) {
      message.error(
        intl.formatMessage({
          id: 'error.receiverAddress.error',
        }),
      );
      setStep('InputAddress');
    }
    setSubmitting(false);
  };

  useEffect(() => {
    partialFee();
  }, []);

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

  return (
    <>
      {errorState.Message && <Message content={errorState.Message} />}
      <Title level={4}>
        {intl.formatMessage({
          id: 'wallet.send.confirm',
        })}
      </Title>
      <div className={styles.listBtn}>
        <div className={styles.field}>
          <span className={styles.title}>
            {intl.formatMessage({
              id: 'wallet.send.amount',
            })}
          </span>
          <span className={styles.value}>
            {number + ' ' + Object.keys(token)[0]}
          </span>
        </div>
        <div className={styles.field}>
          <span className={styles.title}>
            {intl.formatMessage({
              id: 'wallet.send.receiverAddress',
            })}
          </span>
          <Tooltip placement="topRight" title={address}>
            <span className={styles.value}>{address}</span>
          </Tooltip>
        </div>
        <div className={styles.field}>
          <span className={styles.title}>
            {intl.formatMessage({
              id: 'wallet.send.serviceFee',
            })}
          </span>
          <span className={styles.value}>{fee}</span>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          type="primary"
          shape="round"
          size="large"
          className={styles.button}
          loading={submitting}
          disabled={!number || !token || !address}
          onClick={() => setSecModal(true)}
        >
          {intl.formatMessage({
            id: 'common.submit',
          })}
        </Button>
        <Button
          type="text"
          shape="round"
          size="large"
          className={styles.button}
          onClick={() => history.goBack()}
          loading={submitting}
        >
          {intl.formatMessage({
            id: 'common.cancel',
          })}
        </Button>
      </div>
      <SecurityModal
        visable={secModal}
        setVisable={setSecModal}
        password={password}
        setPassword={setPassword}
      //func={handleSubmit}
      />
    </>
  );
};

export default Confirm;
