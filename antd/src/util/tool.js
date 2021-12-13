/*
 * @Author: qxy
 * @Date: 2020-07-23 15:10:22
 * @Last Modified by: qxy
 * @Last Modified time: 2020-07-23 16:36:03
 */

import CryptoJS from 'crypto-js';

const CALL_SECRET = 'ainiliangwannian';
/**
 * AES 解密
 * @param ciphertext, key
 * @returns utf8字符串
 */
export const aesDecrypt = (ciphertext, key = CALL_SECRET) => {
    if (ciphertext) {
        const encodeKey = CryptoJS.enc.Utf8.parse(key);
        const decrypted = CryptoJS.AES.decrypt(ciphertext, encodeKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    return ciphertext;
};

/**
 * AES 加密
 * @param message, key
 * @returns 密码对象Base64字符串
 */
export const aesEncrypt = (message, key = CALL_SECRET) => {
    if (message) {
        const encodeKey = CryptoJS.enc.Utf8.parse(key);
        const ciphertext = CryptoJS.AES.encrypt(message, encodeKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        return ciphertext.toString();
    }
    return message;
};
