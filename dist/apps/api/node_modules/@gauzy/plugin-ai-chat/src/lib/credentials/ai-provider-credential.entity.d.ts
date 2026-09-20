import { IAiProviderCredential } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
/**
 * Per-tenant BYOK ("bring your own key") credential for an AI provider.
 *
 * One row per (tenant, provider). The `apiKey` column stores the secret
 * ENCRYPTED at rest (AES-256-GCM keyed by the base64 `ENCRYPTION_KEY`
 * environment variable — the same mechanism as the core
 * `EncryptionService`). Encryption/decryption happens in
 * {@link AiProviderCredentialService}; the raw column value is never a
 * plaintext key and is excluded from serialized responses.
 */
export declare class AiProviderCredential extends TenantOrganizationBaseEntity implements IAiProviderCredential {
    /**
     * Provider identifier (see `AiProviderEnum` — e.g. 'anthropic', 'openai').
     * Providers registered by `@gauzy/plugin-ai-provider-*` plugins may use
     * ids outside the enum, so this is stored as a plain string.
     */
    providerId: string;
    /**
     * Secret API key — stored ENCRYPTED (format `{ivHex}:{authTagHex}:{cipherHex}`,
     * AES-256-GCM with the `ENCRYPTION_KEY` env secret). Never returned by read
     * endpoints; list responses expose only a masked hint ('••••' + last 4).
     */
    apiKey?: string;
    /**
     * Optional custom base URL (e.g. a self-hosted OpenAI/OpenRouter-compatible endpoint).
     */
    baseUrl?: string;
    /**
     * Whether this credential is active. Disabled credentials are ignored by
     * the chat engine (the provider falls back to server environment keys).
     */
    enabled: boolean;
    /**
     * Whether this provider is the tenant's default for chat.
     * At most one credential per tenant has `isDefault = true`.
     */
    isDefault?: boolean;
    /**
     * Preferred default model for this provider (overrides the provider's own default).
     */
    defaultModel?: string;
    /**
     * Whether this provider is the tenant's default for VOICE (dictation / speech-to-text).
     * Independent of `isDefault` (chat). At most one credential per tenant has `isVoiceDefault = true`.
     */
    isVoiceDefault?: boolean;
    /**
     * Preferred speech-to-text model for this provider (overrides the provider's own speech default).
     */
    speechModel?: string;
}
