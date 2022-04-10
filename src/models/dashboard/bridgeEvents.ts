import { useState } from 'react';
import type { Contract } from 'ethers';

export default () => {
  const [OriginChainID, setOriginChainID] = useState<string | null>(null);
  const [DepositNonce, setDepositNonce] = useState<bigint | null>(null);
  const [Status, setStatus] = useState<string | null>(null);
  const [ResourceID, setResourceID] = useState<string | null>(null);
  const [DataHash, setDataHash] = useState<string | null>(null);

  const SubBridgeEvents = async (bridge: Contract) => {
    bridge.on('ProposalEvent', (originChainID, depositNonce, status, resourceID, dataHash) => {
      setOriginChainID(originChainID);
      setDepositNonce(BigInt(depositNonce.toString()));
      setStatus(status);
      setResourceID(resourceID);
      setDataHash(dataHash);
    });
  };

  const UnsubBridgeEvents = async (bridge: Contract) => {
    bridge.removeAllListeners('ProposalEvent');
  };

  return {
    OriginChainID,
    DepositNonce,
    Status,
    ResourceID,
    DataHash,
    SubBridgeEvents,
    UnsubBridgeEvents
  }
}
