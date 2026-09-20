export declare const ENCRYPTION_ALGORITHM = "aes-256-gcm";
export declare class EncryptionService {
    private readonly algorithm;
    private readonly key;
    constructor();
    /**
     * Encrypts a plaintext string using AES-256-GCM encryption.
     *
     * This function generates a random initialization vector (IV) and uses it
     * along with the predefined encryption algorithm and key to securely encrypt
     * the given plaintext. The resulting cipher text is combined with the IV and
     * the authentication tag to ensure integrity and confidentiality.
     *
     * @param {string} text - The plaintext string to encrypt.
     * @returns {string} The encrypted data in the format: `{IV}:{AuthTag}:{EncryptedText}`.
     *
     * @example
     * const encrypted = encryptionService.encrypt('Sensitive Data');
     * console.log(encrypted); // Outputs encrypted string with IV and AuthTag
     */
    encrypt(text: string): string;
    /**
     * Decrypts an encrypted string back into plaintext.
     *
     * This function reverses the encryption process by extracting the initialization vector (IV),
     * authentication tag, and the cipher text from the input string. It uses the AES-256-GCM
     * algorithm and the predefined encryption key to securely decrypt the data. The authentication
     * tag ensures the integrity of the encrypted data.
     *
     * @param {string} text - The encrypted string to decrypt in the format: `{IV}:{AuthTag}:{EncryptedText}`.
     * @returns {string} The decrypted plaintext string.
     *
     * @throws {Error} If decryption fails due to incorrect data or tampering.
     *
     * @example
     * const decrypted = encryptionService.decrypt('ivHex:authTagHex:encryptedText');
     * console.log(decrypted); // Outputs the original plaintext
     */
    decrypt(text: string): string;
}
