import { Keyring } from '@polkadot/api';
import { DecodeKeystoreWithPwd } from './Crypto';
import { subCallback } from './Subscription';
import { BigNumber } from "ethers";
import { deleteComma } from '@/utils/format';
import { checkFeeAndSubmitExtrinsic } from '@/utils/chain.util';

export const GetPreferredNFT = async (did: string) => {
  const id = await window.apiWs.query.nft.preferred(did);
  return id;
};

export const GetNFTMetaData = async (id: string) => {
  const nftInfo = await window.apiWs.query.nft.metadata(id);

  if (nftInfo.isEmpty) {
    return null;
  }

  const res: any = nftInfo.toHuman();
  return {
    ...res,
    classId: deleteComma(res.classId),
    tokenAssetId: deleteComma(res.tokenAssetId)
  };
};

export const PortNFT = async (password: string, keystore: string, network: NFTNetwork, namespace: string, tokenID: BigNumber, ethAccount: string, signature: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.port(network, namespace, tokenID.toHexString(), ethAccount, signature);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
};

export const SupportDAO = async (nftID: string, amount: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.back(nftID, amount);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
};

export const StartICO = async (nftId: string, ad3Amount: string, tokenAmount: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.startIco(nftId, ad3Amount, tokenAmount);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const EndICO = async (nftId: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.endIco(nftId);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const ParticipateIPO = async (nftId: string, amount: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.participateIco(nftId, amount);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const ClaimTokens = async (nftId: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.claim(nftId);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
}

export const MintNFT = async (nftId: string, name: string, symbol: string, totalSupply: string, password: string, keystore: string, preTx?: boolean, account?: string) => {
  const ex = window.apiWs.tx.nft.mintNftPower(nftId, name, symbol, totalSupply);
  return await checkFeeAndSubmitExtrinsic(ex, password, keystore, preTx, account);
};

export const GetKolDeposit = async (did: string) => {
  const id = await GetPreferredNFT(did);
  if (id.isEmpty) {
    return null;
  }
  const deposit = await window.apiWs.query.nft.deposit(id.toHuman());
  return deposit;
};

export const QueryIcoMetadata = async (nftId: string) => {
  const icoMetaRes = await window.apiWs.query.nft.icoMetaOf(nftId);
  if (icoMetaRes.isEmpty) {
    return null;
  }
  const icoMeta = icoMetaRes.toHuman() as any;
  return {
    ...icoMeta,
    expectedCurrency: deleteComma(icoMeta.expectedCurrency),
    offeredTokens: deleteComma(icoMeta.offeredTokens)
  } as {
    done: boolean;
    expectedCurrency: string;
    offeredTokens: string;
    pot: string;
  }
}
