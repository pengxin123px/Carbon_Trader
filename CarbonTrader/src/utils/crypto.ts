import * as CryptoJS from "crypto-js";

function normalizePassword(password: string): string {
    const encoder = new TextEncoder();
    const passwordArray = encoder.encode(password);
    let key = new Uint8Array(16); // 创建一个固定16字节的数组

    // 复制密码到key数组，如果密码长度小于16，剩余部分用0填充
    for (let i = 0; i < passwordArray.length; i++) {
        key[i] = passwordArray[i];
    }

    // 如果密码数组长度小于16，填充剩余部分
    if (passwordArray.length < 16) {
        const filler = new Uint8Array(16 - passwordArray.length).fill(0);
        key.set(filler, passwordArray.length);
    }

    // 将Uint8Array转换为字符串
    return String.fromCharCode.apply(null, key);
}

export function encrypt(word: string, password: string) {
    console.log("encrypting password", normalizePassword(password))
    const key = CryptoJS.enc.Utf8.parse(normalizePassword(password));
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}

export function decrypt(word: string, password: string) {
    console.log("decrypting password", normalizePassword(password))
    const key = CryptoJS.enc.Utf8.parse(normalizePassword(password));
    const decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
