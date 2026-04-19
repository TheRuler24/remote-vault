/**
 * RemoteVault Zero-Knowledge Cryptography Library
 * Implements End-to-End Encryption (E2EE) using AES-256-GCM and ECDH.
 */

export class CryptoVault {
  private static ALGO_NAME = 'AES-GCM';
  private static KEY_ALGO = { name: 'ECDH', namedCurve: 'P-256' };

  /**
   * Generates a temporary ECDH key pair for the initial handshake.
   */
  static async generateKeyPair(): Promise<CryptoKeyPair> {
    return await window.crypto.subtle.generateKey(
      this.KEY_ALGO,
      true,
      ['deriveKey']
    );
  }

  /**
   * Exports a public key to dynamic string format for transmission over the Relay.
   */
  static async exportPublicKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  /**
   * Imports a remote public key from a string.
   */
  static async importPublicKey(keyStr: string): Promise<CryptoKey> {
    const binaryKey = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
      'raw',
      binaryKey,
      this.KEY_ALGO,
      true,
      []
    );
  }

  /**
   * Derives a shared AES-256-GCM session key from a local private key and a remote public key.
   */
  static async deriveSessionKey(privateKey: CryptoKey, remotePublicKey: CryptoKey): Promise<CryptoKey> {
    const sharedSecret = await window.crypto.subtle.deriveKey(
      { name: 'ECDH', public: remotePublicKey },
      privateKey,
      { name: this.ALGO_NAME, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    return sharedSecret;
  }

  /**
   * Encrypts a plaintext string with the session key.
   */
  static async encrypt(plaintext: string, sessionKey: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: this.ALGO_NAME, iv },
      sessionKey,
      encoded
    );

    return {
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
      iv: btoa(String.fromCharCode(...iv))
    };
  }

  /**
   * Decrypts a ciphertext string with the session key.
   */
  static async decrypt(ciphertextAndIv: { ciphertext: string; iv: string }, sessionKey: CryptoKey): Promise<string> {
    const ciphertext = Uint8Array.from(atob(ciphertextAndIv.ciphertext), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ciphertextAndIv.iv), c => c.charCodeAt(0));

    const decrypted = await window.crypto.subtle.decrypt(
      { name: this.ALGO_NAME, iv },
      sessionKey,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }
}
