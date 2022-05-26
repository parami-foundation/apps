import { DecodeKeystoreWithPwd } from '@/services/parami/Crypto';
import { Button, Card, Input, message, notification, Alert, Divider } from 'antd';
import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../../style.less';
import SmallModal from '@/components/ParamiModal/SmallModal';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import SecurityModal from '@/components/ParamiModal/SecurityModal';

const Mnemonic: React.FC = () => {
  const { wallet } = useModel('currentUser');
  const [modalVisable, setModalVisable] = useState<boolean>(false);
  const [secModal, setSecModal] = useState<boolean>(false);
  const [mnemonic, setMnemonic] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');

  const intl = useIntl();

  const handleSubmit = async (preTx?: boolean, account?: string) => {
    if (preTx && account) {
      return
    }

    if (!!wallet && !!wallet?.keystore) {
      try {
        const decrypted = DecodeKeystoreWithPwd(wallet?.passphrase || passphrase, wallet?.keystore);
        if (!decrypted) {
          notification.error({
            key: 'passphraseError',
            message: intl.formatMessage({
              id: 'error.passphrase.error',
            }),
            duration: null,
          });
          setPassphrase('');
          return;
        }
        setMnemonic(decrypted);
        setModalVisable(true);
      } catch (e: any) {
        notification.error({
          key: 'passphraseError',
          message: intl.formatMessage({
            id: 'error.passphrase.error',
          }),
          duration: null,
        });
        setPassphrase('');
      }
    } else {
      notification.error({
        key: 'accessDenied',
        message: intl.formatMessage({
          id: 'error.accessDenied',
        }),
        duration: null,
      })
    }
  }

  return (
    <>
      <Card
        className={`${styles.card} ${style.exportCard}`}
        bodyStyle={{
          padding: 0,
          width: '100%',
        }}
      >
        <div className={style.field}>
          <div className={style.title}>
            {intl.formatMessage({
              id: 'account.export.exportMnemonic',
            })}
          </div>
          <div className={style.button}>
            <Button
              size='large'
              shape='round'
              type='primary'
              onClick={() => {
                setSecModal(true);
              }}
            >
              {intl.formatMessage({
                id: 'common.export',
                defaultMessage: 'Export'
              })}
            </Button>
          </div>
        </div>
      </Card>

      <SmallModal
        visable={modalVisable}
        content={
          <>
            <Divider>
              {intl.formatMessage({
                id: 'account.export.mnemonic.title',
              })}
            </Divider>
            <Input
              size="large"
              value={mnemonic}
              readOnly
              className={style.secretInput}
            />
            <Alert
              message={intl.formatMessage({
                id: 'account.export.warning',
              })}
              type="warning"
              className={style.secretAlert}
              showIcon
            />
          </>
        }
        footer={
          <>
            <div className={style.bottomButtons}>
              <CopyToClipboard
                text={mnemonic}
                onCopy={() => message.success(
                  intl.formatMessage({
                    id: 'common.copied',
                  })
                )}
              >
                <Button
                  block
                  shape='round'
                  size='large'
                  className={style.button}
                  icon={<CopyOutlined />}
                >
                  {intl.formatMessage({
                    id: 'common.copy',
                  })}
                </Button>
              </CopyToClipboard>
              <Button
                block
                type='primary'
                shape='round'
                size='large'
                className={style.button}
                onClick={() => { setModalVisable(false) }}
              >
                {intl.formatMessage({
                  id: 'common.close',
                })}
              </Button>
            </div>
          </>
        }
      />

      <SecurityModal
        visable={secModal}
        setVisable={setSecModal}
        passphrase={passphrase}
        setPassphrase={setPassphrase}
        func={handleSubmit}
      />
    </>
  )
}

export default Mnemonic;
