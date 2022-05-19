import React, { useEffect, useState } from 'react';
import { Button, Tooltip, Typography, message, notification } from 'antd';
import { useIntl, history, useModel } from 'umi';
import styles from '../../style.less';
import { getTokenTransFee, getTransFee, Transfer, TransferAsset } from '@/services/parami/Transaction';
import config from '@/config/config';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { didToHex } from '@/utils/common';
import Token from '@/components/Token/Token';
import { FloatStringToBigInt } from '@/utils/format';
import AD3 from '@/components/Token/AD3';

const { Title } = Typography;

const Confirm: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<string>>;
  number: string;
  token: any;
  address: string;
}> = ({ setStep, number, token, address }) => {
  const apiWs = useModel('apiWs');
  const { wallet } = useModel('currentUser');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fee, setFee] = useState<any>(null);
  const [secModal, setSecModal] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');

  const intl = useIntl();

  let toAddress = address;

  const handleSubmit = async () => {
    if (!!wallet && !!wallet.keystore) {
      setSubmitting(true);
      if (toAddress.indexOf('did:ad3:') > -1) {
        toAddress = didToHex(toAddress);
      };
      try {
        if (!Object.keys(token).length) {
          await Transfer(
            number,
            wallet?.keystore,
            toAddress,
            passphrase,
          );
        } else {
          await TransferAsset(
            token[Object.keys(token)[0]],
            number.toString(),
            wallet.keystore,
            toAddress,
            passphrase,
          );
        }

        notification.success({
          message: intl.formatMessage({
            id: 'wallet.send.pending',
          }),
          description: (
            <p>
              {intl.formatMessage({
                id: 'wallet.send.receiverAddress',
              })}
              : {address}
            </p>
          ),
        });
        history.push(config.page.walletPage);
        setSubmitting(false);
      } catch (e: any) {
        notification.error({
          key: 'chainError',
          message: e.message || e,
          duration: null,
        });
        setPassphrase('');
        setSubmitting(false);
      }
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      });
    }
  };

  const partialFee = async () => {
    if (!!wallet && !!wallet.account) {
      if (toAddress.indexOf('did:ad3:') > -1) {
        toAddress = didToHex(toAddress);
      };

      try {
        setSubmitting(true);
        if (!Object.keys(token).length) {
          const info = await getTransFee(toAddress, wallet?.account, number);
          setFee(`${info}`);
        } else {
          const info = await getTokenTransFee(token[Object.keys(token)[0]], toAddress, wallet?.account, number);
          setFee(`${info}`);
        }
        setSubmitting(false);
      } catch (e) {
        message.error(
          intl.formatMessage({
            id: 'error.receiverAddress.error',
          }),
        );
        setStep('InputAddress');
        setSubmitting(false);
      }
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      });
    }
  };

  useEffect(() => {
    if (apiWs) {
      partialFee();
    }
  }, [apiWs]);

  return (
    <>
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
            <Token value={FloatStringToBigInt(number, 18).toString()} symbol={Object.keys(token).length ? token.symbol : 'AD3'} />
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
          <span className={styles.value}>
            <AD3 value={fee} />
          </span>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          block
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
          block
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
        passphrase={passphrase}
        setPassphrase={setPassphrase}
        func={handleSubmit}
      />
    </>
  );
};

export default Confirm;
