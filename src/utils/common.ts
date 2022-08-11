import type { AssetTransaction } from '@/services/subquery/subquery';
import { u8aToHex, isHex, BN_TEN, hexToNumber, formatBalance } from '@polkadot/util';
import { base64Decode } from '@polkadot/util-crypto';
import BN from 'bn.js';
import bs58 from 'bs58';
import { fromHexString } from './hexcode';

type throttleDebounce = <T extends () => void>(fn: T, interval?: number, scope?: any) => T;

export function CompareArray(A: any[], B: any[]) {
  // if the other array is a falsy value, return
  if (!A || !B)
    return false;

  // compare lengths - can save a lot of time
  if (A.length != B.length)
    return false;

  for (let i = 0, l = A.length; i < l; i++) {
    // Check if we have nested arrays
    if (A[i] instanceof Array && B[i] instanceof Array) {
      // recurse into the nested arrays
      if (!AbortController[i].equals(B[i]))
        return false;
    }
    else if (A[i] != B[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}

export const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'?.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const urlParse = () => {
  const obj = {};
  let keyValue = [];
  const url = window.location.href;
  const paraString = url.substring(url.indexOf('?') + 1, url.length).split('&');

  paraString.forEach((i) => {
    keyValue = paraString[i].split('=');
    const key = keyValue[0];
    const value = keyValue[1];
    obj[key] = value;
  });
  return obj;
};

export const DeepSet = (o: any, path: any, value: any) => {
  let O = o;
  let i = 0;
  for (; i < path.length - 1; i += 1) {
    if (o[path[i]] === undefined) {
      if (path[i + 1].match(/^\d+$/)) {
        O[path[i]] = [];
      } else {
        O[path[i]] = {};
      }
    }
    O = o[path[i]];
  }
  O[path[i]] = decodeURIComponent(value);
  return O;
};

export const getURLParams = (string: string) => {
  return string.split('&').reduce((o, kv) => {
    const [key, value] = kv.split('=');
    if (!value) {
      return o;
    }
    const O = DeepSet(
      o,
      key.split(/[[\]]/g).filter((x) => x),
      value,
    );
    return O;
  }, {});
};

export const getRect = (el: any) => {
  if (el instanceof window.SVGElement) {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  }
  return {
    top: el.offsetTop,
    left: el.offsetLeft,
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
};

export const sleep = async (timeout: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

export const checkDeviceType = () => {
  const ua = navigator.userAgent;
  return !!ua.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  );
};

export const isWeixin = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('micromessenger') > -1;
};

export const isDiscord = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('discord') > -1;
};

export const isTwitter = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('twitter') > -1;
};

export const isWhatsapp = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('whatsapp') > -1;
};

export const checkInIAP = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const ios = /iphone|ipod|ipad/.test(userAgent);
  const android = /android|adr/.test(userAgent);

  const isInWebAppiOS = (window.navigator as any).standalone;
  const isInWebAppChrome = (window.matchMedia('(display-mode: standalone)').matches);

  if (ios && isInWebAppiOS) {
    return false;
  }
  if (isWeixin() || isDiscord() || isTwitter() || isWhatsapp()) {
    return false;
  }
  if (android && isInWebAppChrome) {
    return false;
  }
  return true;
};

export const formatTimestamp = (timestamp: number) => {
  const t = new Date();
  t.setSeconds(timestamp);
  const formatted = t.toISOString();
  return formatted;
};

export const formatSeconds = (seconds: number) => {
  const day = Math.floor(seconds / (3600 * 24));
  let hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds - hour * 3600) / 60);
  const second = seconds - hour * 3600 - minute * 60;
  hour = hour % 24;
  return `${day}d ${hour}h ${minute}m ${second}s`;
};

export const getRandomNum = (max: number, min: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomWord = (randomFlag = true, min: number, max: number) => {
  let range = min;
  const arr = [
    '1',
    '2',
    '3',
    '4',
    '5',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];

  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (let i = 0; i < range; i += 1) {
    const pos = Math.round(Math.random() * (arr.length - 1));
    const str = arr[pos];
    return str;
  }
  return '';
};

export const formatNumber = (number: number) => {
  return number * 10 ** 18;
};

export const formatHexNumber = (hexNum: any) => {
  if (isHex(hexNum)) {
    return hexToNumber(hexNum) / 10 ** 18;
  }
  if (typeof hexNum === 'number') {
    return hexNum / 10 ** 18;
  }
  return 0;
};

export const didToHex = (did: string) => {
  const bytes = bs58.decode(did.substring(8));
  return u8aToHex(bytes);
};

export const hexToDid = (hex: string | null) => {
  if (hex == null) return '';

  const bytes = fromHexString(hex);
  const address = bs58.encode(bytes);
  return `did:ad3:${address}`;
};

export const inputToBn = (input: string) => {
  const decimals = 18;
  const siPower = new BN(18);
  const basePower = 18;
  const siUnitPower = 0;

  const isDecimalValue = input.toString().match(/^(\d+)\.(\d+)$/);

  let result;
  if (isDecimalValue) {
    if (siUnitPower - isDecimalValue[2].length < -basePower) {
      result = new BN(-1);
    }

    const div = new BN(input.toString()?.replace(/\.\d*$/, ''));
    const modString = input
      .toString()
      ?.replace(/^\d+\./, '')
      ?.substr(0, decimals);
    const mod = new BN(modString);

    result = div
      .mul(BN_TEN.pow(siPower))
      .add(mod.mul(BN_TEN.pow(new BN(basePower + siUnitPower - modString.length))));

    return result;
  }
  result = new BN(input.toString()?.replace(/[^\d]/g, '')).mul(BN_TEN.pow(siPower));

  return result;
};

export const parseAmount = (string: string) => {
  return inputToBn(string).toString();
};

export const formatWithoutUint = (value: string) => formatBalance(value, { withUnit: false }, 18);

export const getObjectURL = (file: any) => {
  if (URL !== undefined) {
    const url = URL.createObjectURL(file);
    return url;
  }
  if (webkitURL !== undefined) {
    const url = webkitURL.createObjectURL(file);
    return url;
  }
  return null;
};

export const debounce = function debounce(fn: () => void, interval?: number, scope?: any, ...args) {
  let arg: any;
  let Scope = scope;

  const FN = () => {
    fn.apply(scope, arg);
  };

  let timer: any;
  const hasScope = args.length > 2;
  return function newFN(this: any) {
    if (!hasScope) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Scope = this;
    }
    arg = args;

    clearTimeout(timer);
    timer = setTimeout(FN, interval);
  };
} as throttleDebounce;

export const throttle = function throttle(fn: () => void, interval?: number, scope?: any, ...args) {
  let runable = true;
  let arg: any;
  let Scope = scope;

  const FN = () => {
    fn.apply(scope, arg);
    runable = true;
  };

  const hasScope = args.length > 2;
  return function newFN(this: any) {
    if (!hasScope) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Scope = this;
    }
    arg = args;

    if (runable) {
      runable = false;
      setTimeout(FN, interval);
    }
  };
} as throttleDebounce;

export const blobToFile = (blob: any, fileName: string) => {
  const Blob = blob;

  Blob.lastModifiedDate = new Date();
  Blob.name = fileName;
  return Blob;
};

export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = base64Decode(b64Data);
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    byteArrays.push(slice);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export const blobTob64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export function getTxAddress(value: AssetTransaction, account: string) {
  const address = value.fromAccountId === account ? value.toAccountId : value.fromAccountId;
  return address;
}

export function stringToBigInt(value: string) {
  if (!value) {
    return BigInt(0);
  }
  return BigInt(value.replaceAll(',', ''));
}
