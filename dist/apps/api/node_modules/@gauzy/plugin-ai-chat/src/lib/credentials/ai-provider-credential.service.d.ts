import { ID, IAiProviderCredential, IAiProviderCredentialCreateInput, IAiProviderCredentialUpdateInput, IPagination } from '@gauzy/contracts';
import { TenantAwareCrudService } from '@gauzy/core';
import { AiProviderCredential } from './ai-provider-credential.entity';
import { AiProviderCredentialEncryptionService } from './ai-provider-credential-encryption.service';
import { MikroOrmAiProviderCredentialRepository } from './repositories/mikro-orm-ai-provider-credential.repository';
import { TypeOrmAiProviderCredentialRepository } from './repositories/type-orm-ai-provider-credential.repository';
/**
 * AiProviderCredentialService
 *
 * CRUD + secret handling for per-tenant BYOK AI provider credentials.
 * API keys are encrypted at rest with AES-256-GCM keyed by the base64
 * `ENCRYPTION_KEY` environment variable (see
 * {@link AiProviderCredentialEncryptionService}) and are only ever returned
 * decrypted to the server-side chat engine — read endpoints receive a
 * masked hint (`'••••' + last 4 characters`).
 */
export declare class AiProviderCredentialService extends TenantAwareCrudService<AiProviderCredential> {
    readonly typeOrmAiProviderCredentialRepository: TypeOrmAiProviderCredentialRepository;
    readonly mikroOrmAiProviderCredentialRepository: MikroOrmAiProviderCredentialRepository;
    private readonly encryptionService;
    private readonly logger;
    constructor(typeOrmAiProviderCredentialRepository: TypeOrmAiProviderCredentialRepository, mikroOrmAiProviderCredentialRepository: MikroOrmAiProviderCredentialRepository, encryptionService: AiProviderCredentialEncryptionService);
    /**
     * Resolve a tenant's usable credential for a provider, with the API key decrypted.
     * Intended for the server-side chat engine only — never expose the result to clients.
     *
     * @param providerId - The AI provider identifier (e.g. 'anthropic').
     * @param tenantId - The tenant to resolve the credential for.
     * @returns The decrypted credential, or `null` when no credential exists,
     *          the credential is disabled, or the stored key cannot be decrypted.
     */
    getDecryptedCredential(providerId: string, tenantId: string): Promise<{
        apiKey: string;
        baseUrl?: string;
        defaultModel?: string;
        speechModel?: string;
        enabled: boolean;
        isDefault: boolean;
        isVoiceDefault: boolean;
    } | null>;
    /**
     * Resolve the tenant's default provider — the enabled credential flagged `isDefault`.
     *
     * @param tenantId - The tenant to resolve the default for.
     * @returns The default provider id (and its preferred model, when set), or `null`.
     */
    getTenantDefault(tenantId: string): Promise<{
        providerId: string;
        defaultModel?: string;
    } | null>;
    /**
     * Resolve the tenant's default VOICE (dictation) provider — the enabled credential flagged
     * `isVoiceDefault`.
     *
     * @param tenantId - The tenant to resolve the voice default for.
     * @returns The voice-default provider id (and its preferred speech model, when set), or `null`.
     */
    getTenantVoiceDefault(tenantId: string): Promise<{
        providerId: string;
        speechModel?: string;
    } | null>;
    /**
     * Complete a provider "Connect" flow: exchange the PKCE authorization
     * `code` + `codeVerifier` for an API key server-side and store it as the
     * tenant's BYOK credential for that provider. The key never touches the
     * browser. Currently supports OpenRouter's PKCE flow only.
     *
     * @param input - Provider id + the PKCE code and verifier from the callback.
     * @returns The persisted credential with a masked API key.
     */
    connectExchange(input: {
        providerId: string;
        code: string;
        codeVerifier: string;
        organizationId?: ID;
    }): Promise<IAiProviderCredential>;
    /**
     * Create or update the tenant's credential for a provider (one credential
     * per `(tenant, providerId)` pair). The API key is encrypted before storage;
     * when omitted on update, the previously stored key is kept. Setting
     * `isDefault: true` clears the flag on the tenant's other credentials.
     *
     * @param input - The credential payload (provider id required; API key required on first create).
     * @returns The persisted credential with a masked API key.
     */
    upsert(input: IAiProviderCredentialCreateInput | IAiProviderCredentialUpdateInput): Promise<IAiProviderCredential>;
    /**
     * Throw a 400 unless the provider is registered as running WITHOUT an API key.
     *
     * Called only when a credential is being CREATED with no key. Cloud providers keep the historical
     * "API key is required" behaviour; local servers (`requiresApiKey: false`) may be saved with only
     * a base URL. An unregistered provider id is treated as requiring a key — the registry is the sole
     * authority on which providers work anonymously, and a typo must not open a key-less path.
     *
     * @param providerId - Registry id being configured.
     */
    private assertKeyOptional;
    /**
     * Throw a 400 when a provider that cannot work without a base URL is saved without one — a
     * generic OpenAI-compatible gateway has no vendor host to fall back to, so a key-only credential
     * would report itself configured and then fail every request.
     *
     * @param providerId - Registry id being configured.
     * @param baseUrl - The base URL that would be stored (incoming, or the existing one on update).
     */
    private assertBaseUrlSatisfied;
    /**
     * Update an existing credential by id. The provider id is immutable —
     * use {@link upsert} to configure a different provider. A provided API key
     * is re-encrypted; setting `isDefault: true` clears the tenant's other defaults.
     *
     * @param id - The credential id (tenant-scoped lookup).
     * @param input - The fields to update.
     * @returns The updated credential with a masked API key.
     */
    updateCredential(id: ID, input: IAiProviderCredentialUpdateInput): Promise<IAiProviderCredential>;
    /**
     * List the current tenant's credentials with masked API keys
     * (`'••••' + last 4 characters` of the decrypted key).
     * Safe to return to clients — decrypted keys never leave the server.
     *
     * @returns Paginated credentials with masked secrets.
     */
    findAllMasked(): Promise<IPagination<IAiProviderCredential>>;
    /**
     * Clear the `isDefault` flag on all of the tenant's other credentials.
     *
     * @param tenantId - The tenant whose defaults are being cleared.
     * @param exceptId - Credential id to leave untouched (the new default), if any.
     */
    private clearOtherDefaults;
    /**
     * Clear the `isVoiceDefault` flag on all of the tenant's other credentials, so at most one
     * provider is the tenant's dictation provider.
     *
     * @param tenantId - The tenant whose voice defaults are being cleared.
     * @param exceptId - Credential id to leave untouched (the new voice default), if any.
     */
    clearOtherVoiceDefaults(tenantId: string, exceptId?: ID): Promise<void>;
    /**
     * Replace the (encrypted) API key with a masked hint: `'••••' + last 4`
     * characters of the decrypted key. When decryption is not possible the
     * mask alone is returned; when no key is stored, `apiKey` is undefined.
     *
     * @param credential - The credential entity to mask.
     * @returns A plain object safe for serialization to clients.
     */
    private maskCredential;
}
