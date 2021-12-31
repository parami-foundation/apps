/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button, Card, Divider, Input, message, Typography } from 'antd';
import { useIntl, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import config from '@/config/config';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const { Title } = Typography;

const MagicLink: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>;
  minimal?: boolean;
  magicMnemonic: string;
  setMagicLink?: React.Dispatch<React.SetStateAction<string>>;
  qsTicket?: any;
}> = ({ setStep, minimal, magicMnemonic, setMagicLink, qsTicket }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const recoverWithLink = `${window.location.origin}/recover/#${encodeURI(
    magicMnemonic as string,
  )}`;

  const intl = useIntl();

  const handleSubmit = async () => {
    setSubmitting(true);

    const messageContent = `${intl.formatMessage({
      id: 'account.magicLink.sendMessage',
    }, {
      link: recoverWithLink,
    })}`;

    const shareData = {
      title: 'Para Metaverse Identity',
      text: messageContent,
      url: recoverWithLink
    };

    setSubmitting(false);

    if (navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        message.error(intl.formatMessage({
          id: 'error.share.failed',
        }));

        return;
      }
    }

    setStep(3);
  };

  useEffect(() => {
    if (minimal) {
      if (setMagicLink) {
        setMagicLink(recoverWithLink);
      }
      setStep(3);
    }
  }, []);

  return (
    <>
      {!minimal && (
        <Card className={styles.card}>
          <img src={'/images/icon/link.svg'} className={style.topIcon} />
          <Title
            level={2}
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
            }}
            className={style.title}
          >
            {intl.formatMessage({
              id: 'account.magicLink.title',
            })}
          </Title>
          <p className={style.description}>
            {intl.formatMessage({
              id: 'account.magicLink.description',
            })}
          </p>
          <Divider />
          <CopyToClipboard
            text={recoverWithLink}
            onCopy={() =>
              message.success(
                intl.formatMessage({
                  id: 'common.copied',
                }),
              )
            }
          >
            <Input size="large" bordered value={recoverWithLink} readOnly />
          </CopyToClipboard>
          <div className={style.buttons}>
            <CopyToClipboard
              text={recoverWithLink}
              onCopy={() =>
                message.success(
                  intl.formatMessage({
                    id: 'common.copied',
                  }),
                )
              }
            >
              <Button
                block
                shape="round"
                size="large"
                className={style.button}
                icon={<CopyOutlined />}
              >
                {intl.formatMessage({
                  id: 'account.magicLink.copyMagicLink',
                })}
              </Button>
            </CopyToClipboard>
            <Button
              block
              type="primary"
              shape="round"
              size="large"
              className={style.button}
              onClick={() => handleSubmit()}
              loading={submitting}
            >
              {intl.formatMessage({
                id: 'common.confirm',
              })}
            </Button>
            <span>
              {intl.formatMessage({
                id: 'account.alreadyCreate',
              })}
            </span>
            <a
              style={{
                textDecoration: 'underline',
                color: 'rgb(114, 114, 122)',
              }}
              onClick={() => history.push(config.page.recoverPage)}
            >
              {intl.formatMessage({
                id: 'account.recoverAccount',
              })}
            </a>
          </div>
        </Card>
      )}
    </>
  );
};

export default MagicLink;
