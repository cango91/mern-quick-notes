const bcrypt = require('bcrypt');
const crypto = require('crypto');

const SALT_ROUNDS_DEFAULT = process.env.SALT_ROUNDS;
const key = process.env.CRYPTO_KEY; // crypto key used for encryption/decryption

async function hash(string,saltRounds=SALT_ROUNDS_DEFAULT){
    return await bcrypt.hash(string,saltRounds);
}

async function compare(string,hash){
    return await bcrypt.compare(string,hash);
}

function encryptText(text){
    const iv = crypto.randomBytes(16); // initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(Buffer.from(text));
    encrypted = Buffer.concat([iv,encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

function decryptText(text){
    const buffer = Buffer.from(text, 'hex');
    const iv = buffer.subarray(0, 16);
    const encrypted = buffer.subarray(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports= {
    hash,
    compare,
    encryptText,
    decryptText,
}