import { useState } from 'react';
import type { Contract } from 'ethers';

const StatusMap = {
  0: 'Inactive',
  1: 'Active',
  2: 'Passed',
  3: 'Executed',
  4: 'Cancelled'
}

export type ProposalEventType = {
  originChainID: number;
  depositNonce: bigint;
  status: string;
  resourceID: string;
  dataHash: string;
  txHash: string;
}

export default () => {
  const [ProposalEvent, setProposalEvent] = useState<ProposalEventType>();

  const SubBridgeEvents = async (bridge: Contract) => {
    bridge.on('ProposalEvent', (originChainID, depositNonce, status, resourceID, dataHash, event) => {
      setProposalEvent({
        originChainID,
        depositNonce: BigInt(depositNonce.toString()),
        status: StatusMap[status],
        resourceID,
        dataHash,
        txHash: event.transactionHash
      });
    });
  };

  const UnsubBridgeEvents = async (bridge: Contract) => {
    bridge.removeAllListeners('ProposalEvent');
  };

  return {
    ProposalEvent,
    SubBridgeEvents,
    UnsubBridgeEvents
  }
}
