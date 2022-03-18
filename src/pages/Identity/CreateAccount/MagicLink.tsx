/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button, Card, Divider, Input, message, Spin, Typography } from 'antd';
import { useIntl, history } from 'umi';
import styles from '@/pages/wallet.less';
import style from '../style.less';
import config from '@/config/config';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const { Title } = Typography;

const MagicLink: React.FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>;
  minimal?: boolean;
  magicMnemonic: string;
  setMagicLink?: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setStep, minimal, magicMnemonic, setMagicLink }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const recoverWithLink = `${window.location.origin}/recover/#${encodeURI(
    magicMnemonic as string,
  )}`;

  const intl = useIntl();
  const { TextArea } = Input;

  const handleSubmit = async () => {
    setSubmitting(true);

    const messageContent = `${intl.formatMessage({
      id: 'identity.magicLink.sendMessage',
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
      await navigator.share(shareData);
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
            className={style.title}
          >
            {intl.formatMessage({
              id: 'identity.magicLink.title',
            })}
          </Title>
          <p className={style.description}>
            {intl.formatMessage({
              id: 'identity.magicLink.description',
            }, {
              strong: <strong>{intl.formatMessage({ id: 'identity.magicLink.description.strong' })}</strong>
            })}
          </p>
          <Divider />
          <div className={style.magicLinkContainer}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              spinning={!magicMnemonic}
              wrapperClassName={style.magicLinkSpinWrapper}
              tip={intl.formatMessage({
                id: 'identity.magicLink.placeholder',
              })}
            >
              <CopyToClipboard
                text={recoverWithLink}
                onCopy={() => {
                  if (!!magicMnemonic) {
                    message.success(
                      intl.formatMessage({
                        id: 'common.copied',
                      }),
                    )
                    setCopied(true);
                  }
                }}
              >
                <TextArea
                  autoSize
                  size="large"
                  placeholder={intl.formatMessage({
                    id: 'identity.magicLink.placeholder',
                  })}
                  value={!magicMnemonic ? intl.formatMessage({ id: 'identity.magicLink.placeholder' }) : recoverWithLink}
                  readOnly
                  className={style.magicLinkInput}
                />
              </CopyToClipboard>
              <Divider />
              <CopyToClipboard
                text={recoverWithLink}
                onCopy={() => {
                  if (!!magicMnemonic) {
                    message.success(
                      intl.formatMessage({
                        id: 'common.copied',
                      }),
                    )
                    setCopied(true);
                  }
                }}
              >
                <Button
                  block
                  shape="round"
                  size="large"
                  className={style.copyButton}
                  icon={<CopyOutlined />}
                >
                  {intl.formatMessage({
                    id: 'identity.magicLink.copyMagicLink',
                  })}
                </Button>
              </CopyToClipboard>
            </Spin>
          </div>
          <div className={style.buttons}>
            <Button
              block
              type="primary"
              shape="round"
              size="large"
              className={style.button}
              onClick={() => handleSubmit()}
              disabled={!magicMnemonic || !copied}
              loading={submitting}
            >
              {intl.formatMessage({
                id: 'common.confirm',
              })}
            </Button>
            <span>
              {intl.formatMessage({
                id: 'identity.alreadyCreate',
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
                id: 'identity.recoverAccount',
              })}
            </a>
          </div>
        </Card>
      )}
    </>
  );
};

export default MagicLink;
