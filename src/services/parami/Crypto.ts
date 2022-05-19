import { notification } from "antd";
import CryptoJS from 'crypto-js';

export const padding = (input: string) => {
  let Input = input;
  if (Input === '' || Input === undefined || !Input) {
    notification.error({
      message: 'Wrong Password',
      duration: null,
    })
    return;
  }
  let paddingCount = Input.length % 4;
  paddingCount = 4 - paddingCount;
  for (let i = 0; i < paddingCount; i += 1) {
    Input = Input.concat('p');
  }
  return Input;
};

export const EncodeKeystoreWithPwd = (password: string, contentString: string) => {
  const Password = padding(password);

  if (Password === null || Password === undefined || !Password) {
    return;
  }

  const key = CryptoJS.enc.Utf8.parse(Password);
  const iv = CryptoJS.enc.Utf8.parse(Password);

  const src = CryptoJS.enc.Utf8.parse(contentString);

  const encrypted = CryptoJS.AES.encrypt(src, key, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString();
};

export const DecodeKeystoreWithPwd = (password: string, keystore: string) => {
  const Password = padding(password);

  if (Password === null || Password === undefined || !Password) {
    return;
  }
  const key = CryptoJS.enc.Utf8.parse(Password);
  const iv = CryptoJS.enc.Utf8.parse(Password);

  const encryptedHexStr = CryptoJS.enc.Hex.parse(keystore);

  const encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);

  const decrypted = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};