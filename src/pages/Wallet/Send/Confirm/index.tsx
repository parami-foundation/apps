import React, { useState } from 'react';
import { Button, Tooltip, Typography, notification } from 'antd';
import { useIntl, history, useModel } from 'umi';
import styles from '../../style.less';
import { Transfer, TransferAsset } from '@/services/parami/Transaction';
import config from '@/config/config';
import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { didToHex } from '@/utils/common';
import Token from '@/components/Token/Token';
import { FloatStringToBigInt } from '@/utils/format';

const { Title } = Typography;

const Confirm: React.FC<{
  number: string;
  token: any;
  address: string;
}> = ({ number, token, address }) => {
  const { wallet } = useModel('currentUser');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [secModal, setSecModal] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');

  const intl = useIntl();

  let toAddress = address;

  const handleSubmit = async (preTx?: boolean, account?: string) => {
    if (!!wallet && !!wallet.keystore) {
      setSubmitting(true);
      if (toAddress.indexOf('did:ad3:') > -1) {
        toAddress = didToHex(toAddress);
      };
      try {
        if (token.symbol === 'AD3') {
          const info: any = await Transfer(
            number,
            wallet?.keystore,
            toAddress,
            passphrase,
            preTx,
            account,
          );
          if (preTx && account) {
            return info
          }
        } else {
          const info: any = await TransferAsset(
            token.assetId,
            token.decimals,
            number.toString(),
            wallet.keystore,
            toAddress,
            passphrase,
            preTx,
            account,
          );
          if (preTx && account) {
            return info
          }
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
            <Token value={FloatStringToBigInt(number, token.decimals).toString()} symbol={token.symbol} decimals={token.decimals} />
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
