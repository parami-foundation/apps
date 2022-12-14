import type { ReactNode } from 'react';
import React from 'react';
import { Button, Modal, Typography } from 'antd';
import styles from './style.less';
import { CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

const BigModal: React.FC<{
  visable: boolean,
  title?: string,
  content: ReactNode,
  footer: ReactNode,
  close?: () => void,
  bodyStyle?: React.CSSProperties,
  width?: number | string
}> = ({ visable, title, content, footer, close, bodyStyle, width }) => {
  return (
    <Modal
      title={
        title ? (
          <Title
            level={5}
            className={styles.title}
          >
            {title}
          </Title>
        ) : null
      }
      closable={close ? true : false}
      closeIcon={
        <>
          <Button
            shape='circle'
            size='middle'
            type='ghost'
            icon={
              <CloseOutlined
                onClick={close}
              />
            }
          />
        </>
      }
      className={styles.modal}
      centered
      visible={visable}
      width={width ?? 650}
      footer={footer}
      bodyStyle={bodyStyle}
    >
      {content}
    </Modal >
  );
}
export default BigModal;