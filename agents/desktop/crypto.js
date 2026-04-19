/**
 * RemoteVault Agent Cryptography Module (Node.js)
 * Implements E2EE compatible with the Web Crypto API.
 */
const { webcrypto } = require('node:crypto');

class CryptoVault {
  static ALGO_NAME = 'AES-GCM';
  static KEY_ALGO = { name: 'ECDH', namedCurve: 'P-256' };

  static async generateKeyPair() {
    return await webcrypto.subtle.generateKey(
      this.KEY_ALGO,
      true,
      ['deriveKey']
    );
  }

  static async exportPublicKey(key) {
    const exported = await webcrypto.subtle.exportKey('raw', key);
    return Buffer.from(exported).toString('base64');
  }

  static async importPublicKey(keyStr) {
    const binaryKey = Buffer.from(keyStr, 'base64');
    return await webcrypto.subtle.importKey(
      'raw',
      binaryKey,
      this.KEY_ALGO,
      true,
      []
    );
  }

  static async deriveSessionKey(privateKey, remotePublicKey) {
    const sharedSecret = await webcrypto.subtle.deriveKey(
      { name: 'ECDH', public: remotePublicKey },
      privateKey,
      { name: this.ALGO_NAME, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    return sharedSecret;
  }

  static async encrypt(plaintext, sessionKey) {
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    
    const ciphertext = await webcrypto.subtle.encrypt(
      { name: this.ALGO_NAME, iv },
      sessionKey,
      encoded
    );

    return {
      ciphertext: Buffer.from(ciphertext).toString('base64'),
      iv: Buffer.from(iv).toString('base64')
    };
  }

  static async decrypt(ciphertextAndIv, sessionKey) {
    const ciphertext = Buffer.from(ciphertextAndIv.ciphertext, 'base64');
    const iv = Buffer.from(ciphertextAndIv.iv, 'base64');

    const decrypted = await webcrypto.subtle.decrypt(
      { name: this.ALGO_NAME, iv },
      sessionKey,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }
}

module.exports = { CryptoVault };
