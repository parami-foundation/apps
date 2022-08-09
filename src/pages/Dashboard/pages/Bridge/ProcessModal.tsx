import BigModal from '@/components/ParamiModal/BigModal';
import { Spin, Steps, Tooltip } from 'antd';
import React, { useCallback } from 'react';
import style from './style.less';
import config from '@/config/config';
import { LoadingOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { EtherscanPrefix } from '@/config/ethereumNetwork';

const { Step } = Steps;

const ProcessModal: React.FC<{
  tab: 'deposit' | 'withdraw',
  step: number,
  ethHash?: string,
  paramiHash?: string,
  onClose: () => void
}> = ({ tab, step, ethHash, paramiHash, onClose }) => {
  const { ChainId } = useModel('web3');

  const openEtherscan = useCallback(() => {
    window.open(`${EtherscanPrefix[ChainId ?? 1]}${ethHash}`, '_blank');
  }, [ChainId, ethHash]);
  
  return <BigModal
    visable
    content={
      <div className={style.processContainer}>
        {tab === 'deposit' && (
          <>
            <Steps
              progressDot
              size='small'
              current={step}
            >
              <Step title="Enter information" />
              <Step title="Ethereum chain" />
              <Step title="Parami chain" />
              <Step title="Tokens transferred" />
            </Steps>
            <div className={style.title}>
              {step === 1 && (
                <span>Ethereum chain</span>
              )}
              {step === 2 && (
                <span>Parami chain</span>
              )}
              {step === 3 && (
                <span>Tokens transferred</span>
              )}
            </div>
            <div
              className={style.cardContainer}
            >
              {ethHash && paramiHash ? (
                <div className={style.listHash}>
                  <div className={style.field}>
                    <span className={style.title}>
                      Parami chain
                    </span>
                    <span
                      className={style.value}
                      onClick={() => {
                        window.open(`${config.explorer.block}/${paramiHash}`, '_blank');
                      }}
                    >
                      <Tooltip
                        placement="topLeft"
                        title={paramiHash}
                      >
                        {paramiHash}
                      </Tooltip>
                    </span>
                  </div>
                  <div className={style.field}>
                    <span className={style.title}>
                      ETH chain
                    </span>
                    <span
                      className={style.value}
                      onClick={openEtherscan}
                    >
                      <Tooltip
                        placement="topLeft"
                        title={ethHash}
                      >
                        {ethHash}
                      </Tooltip>
                    </span>
                  </div>
                </div>
              ) : (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                  tip={'Transfering...'}
                />
              )}
            </div>
          </>
        )}
        {tab === 'withdraw' && (
          <>
            <Steps
              progressDot
              size='small'
              current={step}
            >
              <Step title="Enter information" />
              <Step title="Parami chain" />
              <Step title="Ethereum chain" />
              <Step title="Tokens transferred" />
            </Steps>
            <div className={style.title}>
              {step === 1 && (
                <span>Parami chain</span>
              )}
              {step === 2 && (
                <span>Ethereum chain</span>
              )}
              {step === 3 && (
                <span>Tokens transferred</span>
              )}
            </div>
            <div
              className={style.cardContainer}
            >
              {ethHash && paramiHash ? (
                <div className={style.listHash}>
                  <div className={style.field}>
                    <span className={style.title}>
                      Parami chain
                    </span>
                    <span
                      className={style.value}
                      onClick={() => {
                        window.open(`${config.explorer.block}/${paramiHash}`, '_blank');
                      }}
                    >
                      <Tooltip
                        placement="topLeft"
                        title={paramiHash}
                      >
                        {paramiHash}
                      </Tooltip>
                    </span>
                  </div>
                  <div className={style.field}>
                    <span className={style.title}>
                      ETH chain
                    </span>
                    <span
                      className={style.value}
                      onClick={() => {
                        window.open(`https://etherscan.io/tx/${ethHash}`, '_blank');
                      }}
                    >
                      <Tooltip
                        placement="topLeft"
                        title={ethHash}
                      >
                        {ethHash}
                      </Tooltip>
                    </span>
                  </div>
                </div>
              ) : (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                  tip={'Transfering...'}
                />
              )}
            </div>
          </>
        )}
      </div>
    }
    footer={false}
    close={ethHash && paramiHash ? onClose : undefined}
  />
}

export default ProcessModal;