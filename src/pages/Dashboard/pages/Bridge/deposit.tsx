import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { Button, Image, Input, Tooltip, notification } from 'antd';
import style from './style.less';
import { ArrowDownOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { BigNumber, ethers, utils } from 'ethers';
import { BigIntToFloatString, FloatStringToBigInt } from '@/utils/format';
import { hexToDid } from '@/utils/common';
import { QueryAccountFromDid } from '@/services/parami/Identity';
import SelectToken from './SelectToken';
import { decodeAddress } from '@polkadot/util-crypto';
import { ChainBridgeToken } from '@/models/chainbridge';
import { getTokenBalanceOnEth, getTokenBalanceOnParami } from '@/services/parami/xAssets';
import Token from '@/components/Token/Token';
import ERC20Abi from '@/pages/Dashboard/pages/Farm/abi/ERC20.json'
import BRIDGE_ABI from '@/pages/Dashboard/pages/Bridge/abi/Bridge.json';

const Deposit: React.FC<{
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setETHHash: React.Dispatch<React.SetStateAction<string | undefined>>;
  setParamiHash: React.Dispatch<React.SetStateAction<string | undefined>>;
}> = ({ setLoading, setStep, setETHHash, setParamiHash }) => {
  const apiWs = useModel('apiWs');
  const { dashboard } = useModel('currentUser');
  const {
    Account,
    ChainName,
    Provider,
    Signer,
  } = useModel('web3');
  const { Events, SubParamiEvents } = useModel('paramiEvents');
  const [eventsUnsub, setEventsUnsub] = useState<() => void>();
  const [txNonce, setTxNonce] = useState<bigint>(BigInt(0));
  const [amount, setAmount] = useState<string>('');
  const [waitingParami, setWaitingParami] = useState<boolean>(false);
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [selectModal, setSelectModal] = useState<boolean>(false);

  const { tokens, contractAddresses } = useModel('chainbridge');

  const [selectedToken, setSelectedToken] = useState<ChainBridgeToken>();
  const [balanceOnParami, setBalanceOnParami] = useState<string>('');
  const [balanceOnEth, setBalanceOnEth] = useState<string>('');

  useEffect(() => {
    if (tokens?.length) {
      setSelectedToken(tokens[0]);
    }
  }, [tokens])

  const intl = useIntl();

  useEffect(() => {
    if (selectedToken && Signer && Account) {
      getTokenBalanceOnEth(selectedToken, Signer, Account).then(balance => {
        setBalanceOnEth(balance);
      });
    }
  }, [selectedToken, Signer, Account]);

  useEffect(() => {
    if (selectedToken && apiWs && dashboard?.account) {
      getTokenBalanceOnParami(selectedToken, dashboard.account).then(balance => {
        setBalanceOnParami(balance.total);
      });
    }
  }, [selectedToken, apiWs, dashboard]);

  let unsubParami;
  const isDepositSuccessEvent = (item: any, nonce: bigint) => {
    if (`${item.event.section}:${item.event.method}` === 'chainBridge:ProposalSucceeded') {
      if (BigInt(item.event.data[1].toString()) === nonce) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!Provider || !Signer) return;

    let recipient: string = destinationAddress;

    if (destinationAddress.indexOf('did:ad3') > -1) {
      try {
        const user: any = await QueryAccountFromDid(destinationAddress);
        if (!user) {
          notification.error({
            message: 'Invalid DID',
            duration: null,
          });
        }
        recipient = user.account;
      } catch (e: any) {
        notification.error({
          message: e.message || e,
          duration: null,
        });
      }
    }

    recipient = `0x${Buffer.from(decodeAddress(recipient)).toString("hex")}`;

    const data =
      "0x" +
      utils
        .hexZeroPad(
          BigNumber.from(
            utils.parseUnits(amount, selectedToken!.decimals)
          ).toHexString(),
          32
        )
        .substring(2) + // Deposit Amount (32 bytes)
      utils
        .hexZeroPad(utils.hexlify((recipient.length - 2) / 2), 32)
        .substring(2) + // len(recipientAddress) (32 bytes)
      recipient.substring(2); // recipientAddress (?? bytes)

    try {
      setLoading(true);
      notification.info({
        message: 'Approve Token Access'
      });

      const ERC20TokenContract = new ethers.Contract(selectedToken!.contract_address, ERC20Abi, Signer);

      await (
        await ERC20TokenContract?.approve(
          contractAddresses.erc20Handler,
          BigNumber.from(
            utils.parseUnits(amount.toString(), selectedToken?.decimals)
          )
        )
      ).wait();

      notification.info({
        message: 'Deposit Token'
      });
      const bridgeContract = new ethers.Contract(contractAddresses.bridge, BRIDGE_ABI, Signer);
      const ethRes = await (
        await bridgeContract.deposit(
          selectedToken!.paramiChainId,
          selectedToken!.resourceId,
          data,
        )
      ).wait();

      const depositLog = ethRes.logs.find(log => log.address.toLowerCase() === contractAddresses.bridge.toLowerCase());
      const nonce = BigInt(depositLog.topics[depositLog.topics.length - 1]);
      setTxNonce(nonce);
      setETHHash(ethRes.transactionHash);
      setStep(2);

      // Step 3
      setWaitingParami(true);
      unsubParami = await SubParamiEvents();
      setEventsUnsub(() => unsubParami);
    } catch (e: any) {
      notification.error({
        message: e.message || e,
        duration: null,
      });
      setLoading(false);
    }
  }

  useEffect(() => {
    if (waitingParami) {
      for (const item of Events) {
        console.log('event', `${item.event.section}:${item.event.method}`);
        if (isDepositSuccessEvent(item, txNonce)) {
          setWaitingParami(false);
          setStep(3);
          eventsUnsub && eventsUnsub();
          notification.success({
            message: 'Deposit Success',
          });
          setParamiHash(item.blockHash);
          setSelectedToken({ ...selectedToken! });
        }
      }
    }
  }, [Events, txNonce, waitingParami, eventsUnsub]);

  return (
    <>
      <div className={style.fromLabel}>
        {intl.formatMessage({
          id: 'dashboard.bridge.from',
          defaultMessage: 'From',
        })}
      </div>
      <div className={style.formSection}>
        <div className={style.chainAndBalanceDetails}>
          <div className={style.chainDetails}>
            <Image
              src='/images/crypto/ethereum-eth-logo.svg'
              preview={false}
              className={style.chainIcon}
            />
            <span className={style.chainDetailsChainName}>{ChainName}</span>
          </div>
          <div className={style.balanceDetails}>
            <span className={style.balanceDetailsLabel}>
              {intl.formatMessage({
                id: 'dashboard.bridge.balance',
                defaultMessage: 'Balance',
              })}:
            </span>
            <Tooltip placement="top" title={BigIntToFloatString(balanceOnEth, selectedToken?.decimals ?? 18)}>
              <span className={style.balanceDetailsBalance}>
                <Token value={balanceOnEth} symbol={selectedToken?.symbol} decimals={selectedToken?.decimals} />
              </span>
            </Tooltip>
          </div>
        </div>
        <div className={style.tokenAndAmountDetails}>
          <div
            className={style.tokenDetails}
            onClick={() => {
              setSelectModal(true);
            }}
          >
            <Image
              src={selectedToken?.icon}
              preview={false}
              className={style.chainIcon}
            />
            <span className={style.tokenDetailsTokenName}>{selectedToken?.name}</span>
            <DownOutlined className={style.tokenDetailsArrow} />
          </div>
          <div className={style.amountDetails}>
            <Input
              placeholder='0.00'
              type='number'
              size='large'
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
            <Button
              className={style.amountDetailsMaxButton}
              type='link'
              size='small'
              onClick={() => {
                setAmount(BigIntToFloatString(balanceOnEth, selectedToken!.decimals));
              }}
            >
              {intl.formatMessage({
                id: 'dashboard.bridge.max',
                defaultMessage: 'MAX',
              })}
            </Button>
          </div>
        </div>
      </div>
      <div className={style.downArrowSection}>
        <ArrowDownOutlined />
      </div>
      <div className={style.toLabel}>
        {intl.formatMessage({
          id: 'dashboard.bridge.to',
          defaultMessage: 'To',
        })}
      </div>
      <div className={style.toChainAndBalanceDetails}>
        <div className={style.chainDetails}>
          <Image
            src='/images/logo-core-colored-fit-into-round.svg'
            preview={false}
            className={style.chainIcon}
          />
          <span className={style.chainDetailsChainName}>Parami chain</span>
        </div>
        <div className={style.balanceDetails}>
          <span className={style.balanceDetailsLabel}>
            {intl.formatMessage({
              id: 'dashboard.bridge.balance',
              defaultMessage: 'Balance',
            })}:
          </span>
          <Tooltip placement="top" title={BigIntToFloatString(balanceOnParami, selectedToken?.decimals ?? 18)}>
            <span className={style.balanceDetailsBalance}>
              <Token value={balanceOnParami} symbol={selectedToken?.symbol} decimals={selectedToken?.decimals} />
            </span>
          </Tooltip>
        </div>
      </div>
      <div className={style.downArrowSection}>
        <PlusOutlined />
      </div>
      <div className={style.destinationLabel}>
        {intl.formatMessage({
          id: 'dashboard.bridge.destinationAddress',
          defaultMessage: 'Destination Address',
        })}
      </div>
      <div className={style.destinationDetails}>
        <Input
          placeholder='did:ad3:......'
          type='text'
          size='large'
          value={destinationAddress}
          onChange={(e) => {
            setDestinationAddress(e.target.value);
          }}
        />
        <Button
          className={style.destinationMyAddressButton}
          type='default'
          size='small'
          onClick={() => {
            setDestinationAddress(hexToDid(dashboard.did!));
          }}
        >
          {intl.formatMessage({
            id: 'dashboard.bridge.me',
            defaultMessage: 'ME',
          })}
        </Button>
      </div>
      <Button
        block
        type='primary'
        size='large'
        shape='round'
        className={style.transferButton}
        onClick={() => {
          handleSubmit();
        }}
        disabled={!amount || !destinationAddress || FloatStringToBigInt(amount, selectedToken?.decimals ?? 18) <= BigInt(0)}
      >
        {intl.formatMessage({
          id: 'dashboard.bridge.transfer',
          defaultMessage: 'Transfer',
        })}
      </Button>

      {selectModal && <SelectToken
        onClose={() => setSelectModal(false)}
        onSelectToken={(token) => {
          setSelectedToken(token);
          setSelectModal(false);
        }}
        chain={'ethereum'}
      />}

    </>
  )
}

export default Deposit;
