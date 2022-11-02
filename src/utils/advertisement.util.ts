import config from "@/config/config";
import { IMAGE_TYPE } from "@/constants/advertisement";
import { uploadIPFS } from "@/services/parami/IPFS";
import imageCompression from 'browser-image-compression';
import { didToHex, parseAmount } from "./common";

export const compressImageFile = async (file, imageType: IMAGE_TYPE) => {
  if (file.type === 'image/gif') {
    return file;
  }
  const options = imageType === IMAGE_TYPE.ICON ? {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 60,
    useWebWorker: true
  } : {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 400,
    useWebWorker: true
  }

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (e) {
    console.log('image compression failed', e);
    return file;
  }
}

export const generateAdConfig = async (adInfo) => {
  let adMetadata = {
    media: adInfo.poster,
    icon: adInfo.icon,
    content: adInfo.content,
    instructions: adInfo.instructions.map(ins => ({ ...ins, link: encodeURIComponent(ins.link ?? '') })),
    sponsorName: adInfo.sponsorName
  };

  const bufferred = await Buffer.from(JSON.stringify(adMetadata));
  const { response, data } = await uploadIPFS(bufferred);
  if (!response.ok) {
    throw ('Create Metadata Error');
  }

  const metadataUrl = `ipfs://${data.Hash}`;
  const delegatedDidHex = didToHex(config.advertisement.defaultDelegatedDid);
  const allTags = Array.from(new Set([...adInfo.instructions.map(ins => ins.tag).filter(Boolean)]));

  return {
    tags: allTags,
    metadata: metadataUrl,
    rewardRate: adInfo.rewardRate.toString(),
    lifetime: adInfo.lifetime,
    payoutBase: parseAmount(adInfo.payoutBase.toString()),
    payoutMin: parseAmount(adInfo.payoutMin.toString()),
    payoutMax: parseAmount(adInfo.payoutMax.toString()),
    delegatedAccount: delegatedDidHex
  }
}