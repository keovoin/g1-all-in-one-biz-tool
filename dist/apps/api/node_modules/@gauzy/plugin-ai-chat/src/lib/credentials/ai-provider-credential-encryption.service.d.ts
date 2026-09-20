/**
 * Encryption algorithm — identical to the core `EncryptionService`
 * (`packages/core/src/lib/common/encryption/encryption.service.ts`).
 */
export declare const AI_CREDENTIAL_ENCRYPTION_ALGORITHM = "aes-256-gcm";
/**
 * AiProviderCredentialEncryptionService
 *
 * Encrypts/decrypts BYOK provider API keys at rest. This mirrors the core
 * `EncryptionService` mechanism exactly (AES-256-GCM, random 16-byte IV,
 * output format `{ivHex}:{authTagHex}:{cipherHex}`), keyed by the
 * **`ENCRYPTION_KEY`** environment variable — a base64-encoded 32-byte key
 * (generate one with `generateEncryptionKey()` from `@gauzy/utils`).
 *
 * The core service is not part of the `@gauzy/core` public API, so the same
 * mechanism is replicated here rather than inventing a new one. Both read the
 * same `ENCRYPTION_KEY` secret, so values remain interoperable.
 *
 * When `ENCRYPTION_KEY` is not set, a temporary per-process key is generated
 * (same behavior as the core service) — stored credentials will NOT survive a
 * restart in that case, so always set `ENCRYPTION_KEY` in production.
 */
export declare class AiProviderCredentialEncryptionService {
    private readonly logger;
    private readonly algorithm;
    private readonly key;
    /**
     * Set when `ENCRYPTION_KEY` is present but not a valid base64-encoded
     * 32-byte key. We deliberately do NOT fall back to a temporary key in
     * that case — silently encrypting with a different key than the operator
     * configured would hide the misconfiguration and strand the data. Every
     * encrypt/decrypt instead fails with this message (surfaced to the UI).
     */
    private readonly keyError;
    constructor();
    /** Throws a clear, user-visible error when the configured key is unusable. */
    private assertUsableKey;
    /**
     * Encrypts a plaintext secret using AES-256-GCM.
     *
     * A random initialization vector (IV) is generated per call; the cipher
     * text is combined with the IV and the authentication tag to guarantee
     * both confidentiality and integrity.
     *
     * @param {string} text - The plaintext secret to encrypt.
     * @returns {string} The encrypted data in the format `{ivHex}:{authTagHex}:{cipherHex}`.
     */
    encrypt(text: string): string;
    /**
     * Decrypts a value produced by {@link encrypt} back into plaintext.
     *
     * @param {string} text - The encrypted string in the format `{ivHex}:{authTagHex}:{cipherHex}`.
     * @returns {string} The decrypted plaintext secret.
     *
     * @throws {Error} If decryption fails due to a wrong key, corrupted data, or tampering.
     */
    decrypt(text: string): string;
}
