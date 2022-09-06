import AD3 from "@/components/Token/AD3";
import { getAD3ToETHTransferFee, getERC20TokenToEthTransferFee } from "@/services/parami/xAssets";
import { Alert, Button, Modal, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import styles from './TransactionFeeModal.less'
import { FloatStringToBigInt } from '@/utils/format';
import { ChainBridgeToken } from "@/models/chainbridge";

const { Title } = Typography;

const TransactionFeeModal: React.FC<{
  onCancel: () => void,
  onConfirm: () => void,
  amount: string,
  token: ChainBridgeToken
}> = ({ onCancel, onConfirm, amount, token }) => {

  const [transferFee, setTransferFee] = useState<{ fee: string }>();
  const [receiveAmount, setReceiveAmount] = useState<string>();
  const [insufficientAmount, setInsufficientAmount] = useState<boolean>(false);

  useEffect(() => {
    if (token.assetId) {
      getERC20TokenToEthTransferFee(token.ethChainId, token.assetId).then(res => {
        setTransferFee(res)
      });
    } else {
      getAD3ToETHTransferFee().then(res => {
        setTransferFee(res)
      });
    }

  }, [token])

  useEffect(() => {
    if (transferFee) {
      const receive = (FloatStringToBigInt(amount, 18) - BigInt(transferFee.fee.replaceAll(',', ''))).toString();
      setReceiveAmount(receive);
      setInsufficientAmount(!!receive && BigInt(receive) <= 0);
    }
  }, [transferFee])

  return (
    <Modal title={
      <Title level={3} style={{ marginBottom: 0 }}>
        Confirm Transaction
      </Title>
    }
      closable={false}
      className={styles.modal}
      centered
      visible
      width={400}
      footer={
        <div className={styles.buttons}>
          <Button
            type="text"
            shape="round"
            size="large"
            className={styles.button}
            onClick={onCancel}
          >
            Decline
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            className={styles.button}
            onClick={onConfirm}
            disabled={!transferFee || insufficientAmount}
          >
            Confirm
          </Button>
        </div>
      }
    >
      {!transferFee &&
        <div className={styles.spinContainer}>
          <Spin></Spin>
        </div>
      }
      {transferFee && (<>
        {insufficientAmount && (
          <Alert
            description="Insufficient Amount"
            type="error"
            showIcon
            banner
            className={styles.alertContainer}
          />
        )}
        <div className={styles.fieldsContainer}>
          <div className={styles.field}>
            <div className={styles.label}>
              Transfer Amount:
            </div>
            <div className={styles.value}>
              <AD3
                value={FloatStringToBigInt(amount, 18).toString()}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 900,
                }}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>
              Fee:
            </div>
            <div className={styles.value}>
              <AD3
                value={transferFee.fee.replaceAll(',', '')}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 900,
                }}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>
              Will Receive:
            </div>
            <div className={styles.value}>
              <AD3
                value={receiveAmount ?? ''}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  color: insufficientAmount ? 'red' : ''
                }}
              />
            </div>
          </div>
        </div>

      </>)}

    </Modal>
  )

}

export default TransactionFeeModal;