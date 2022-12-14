import SecurityModal from '@/components/ParamiModal/SecurityModal';
import { Keyring } from '@polkadot/api';
import { Button, Card, Typography, message, Alert, notification } from 'antd';
import React, { useState } from 'react';
import { useIntl, history, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from './style.less';
import { base64url } from '@/utils/format';
import { DecodeKeystoreWithPwd } from '@/services/parami/Crypto';

const { Title } = Typography;

const Visa: React.FC = () => {
  const { wallet } = useModel('currentUser');
  const [secModal, setSecModal] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');

  const intl = useIntl();

  const { query } = history.location;
  const { audience, scope } = query as { audience: string, scope: string | null | undefined };
  const scopes = scope ?? '';
  const sign = scopes.indexOf('sign') > -1;

  const handleStamp = async (preTx?: boolean, account?: string) => {
    if (preTx && account) {
      return;
    }

    if (!!wallet && !!wallet?.keystore) {
      const timestamp = Date.now() / 1000 | 0;

      const header = JSON.stringify({
        alg: sign ? 'SrDSA' : 'none',
        typ: 'JWT'
      });

      const payload = JSON.stringify({
        iss: window.location.origin,
        sub: wallet?.account,
        aud: audience,
        iat: timestamp,
        exp: timestamp + 30
      });

      const plain = `${base64url(header)}.${base64url(payload)}`;

      if (!sign) {
        window.opener.postMessage(`${plain}.`, audience);
        window.close();
        return;
      }

      const instanceKeyring = new Keyring({ type: 'sr25519' });
      const decodedMnemonic = DecodeKeystoreWithPwd(passphrase, wallet?.keystore);
      if (decodedMnemonic === null || decodedMnemonic === undefined || !decodedMnemonic) {
        message.error(
          intl.formatMessage({
            id: 'error.passphrase.error',
          })
        );
        return;
      }
      const keypair = instanceKeyring.createFromUri(decodedMnemonic);

      const signature = keypair.sign(plain);
      const ticket = `${plain}.${base64url(signature)}`;

      window.opener.postMessage(ticket, audience);
      window.close();
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

  const handleDecline = async () => {
    window.opener.postMessage('eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.e30.', audience);
    window.close();
  };

  return (
    <>
      <div
        className={styles.mainBgContainer}
        style={{
          height: '100vh',
        }}
      >
        <div className={styles.pageContainer}>
          <Card className={style.visaCard}>
            <Title
              level={2}
              style={{
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              {intl.formatMessage({
                id: 'visa.title',
              })}
            </Title>
            <span
              className={style.subTitle}
            >
              {intl.formatMessage({
                id: 'visa.subtitle',
              })}
            </span>
            <Alert
              style={{
                textAlign: 'center',
                marginTop: 50,
              }}
              message="Audience"
              description={audience}
              type="info"
            />
            <div className={style.buttons}>
              <Button
                type="primary"
                shape="round"
                size="large"
                className={style.button}
                style={{
                  backgroundImage: 'linear-gradient(-225deg, #FE2105 0%, #FF5B00 38%, #96E9EA 100%)',
                }}
                onClick={() => {
                  if (sign) {
                    setSecModal(true);
                  } else {
                    handleStamp();
                  }
                }}
              >
                {intl.formatMessage({
                  id: 'visa.stamp',
                })}
              </Button>
              <span className={style.or}>
                {intl.formatMessage({
                  id: 'index.or',
                })}
              </span>
              <Button
                shape="round"
                size="large"
                className={style.button}
                onClick={handleDecline}
              >
                {intl.formatMessage({
                  id: 'visa.decline',
                })}
              </Button>
            </div>
          </Card>
          <img
            src="/images/logo-text-black.svg"
            style={{
              display: 'block',
              width: 150,
              opacity: 0.3,
              marginBottom: 20,
              marginTop: 50,
            }}
          />
        </div>
      </div>
      <SecurityModal
        visable={secModal}
        setVisable={setSecModal}
        passphrase={passphrase}
        setPassphrase={setPassphrase}
        func={handleStamp}
      />
    </>
  )
};

export default Visa;
