import { useState } from 'react';
import type { Contract } from 'ethers';
export default () => {
  const [DepositNonce, setDepositNonce] = useState<bigint|null>(null);
  async function SubBridgeEvents(bridge: Contract) {
    bridge.on('ProposalEvent', (originChainID, depositNonce, status, resourceID, dataHash) => {
      console.log(`\nReceived ProposalEvent:`,{originChainID, depositNonce, status, resourceID, dataHash});
      setDepositNonce(BigInt(depositNonce.toString()));
    });
  }
  
  async function UnsubBridgeEvents(bridge: Contract) {
    bridge.removeAllListeners('ProposalEvent');
  }

  return {
    DepositNonce,
    SubBridgeEvents,
    UnsubBridgeEvents
  }
}
