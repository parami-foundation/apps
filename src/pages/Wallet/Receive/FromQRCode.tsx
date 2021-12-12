import React from 'react';
import { useIntl, history } from 'umi';
import QRCode from 'qrcode.react';
import styles from '../style.less';
import { Button, Input, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import AD3 from '@/components/Token/AD3';

const FromQRCode: React.FC<{
  did: string,
  freeBalance: string,
  stashUserAddress: string,
}> = ({ did, freeBalance, stashUserAddress }) => {
  const intl = useIntl();

  return (
    <>
      <div className={styles.fromQRCode}>
        <div className={styles.qrcode}>
          <QRCode value={stashUserAddress} size={200} />
        </div>
        <div className={styles.listBtn}>
          <div
            className={styles.field}
            style={{
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: 10,
              }}
            >
              <span className={styles.title}>
                {intl.formatMessage({
                  id: 'wallet.receive.did',
                })}
              </span>
              <span className={styles.value}>
                <CopyToClipboard
                  text={did as string}
                  onCopy={() =>
                    message.success(
                      intl.formatMessage({
                        id: 'common.copied',
                      }),
                    )
                  }
                >
                  <Button type="link" icon={<CopyOutlined />}>
                    {intl.formatMessage({
                      id: 'common.copy',
                    })}
                  </Button>
                </CopyToClipboard>
              </span>
            </div>
            <CopyToClipboard
              text={did as string}
              onCopy={() =>
                message.success(
                  intl.formatMessage({
                    id: 'common.copied',
                  }),
                )
              }
            >
              <Input size="large" bordered={false} readOnly value={did as string} />
            </CopyToClipboard>
          </div>
          <div className={styles.field}>
            <span className={styles.title}>
              {intl.formatMessage({
                id: 'wallet.receive.availableBalance',
              })}
            </span>
            <span className={styles.value}>
              <AD3 value={freeBalance} />
            </span>
          </div>
        </div>
        <Button
          type="text"
          shape="round"
          size="large"
          className={styles.button}
          onClick={() => history.goBack()}
        >
          {intl.formatMessage({
            id: 'common.cancel',
          })}
        </Button>
      </div>
    </>
  );
};

export default FromQRCode;
