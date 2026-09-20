import { DeleteResult } from 'typeorm';
import { ID, IAiProviderCredential, IPagination } from '@gauzy/contracts';
import { AiProviderCredentialService } from './ai-provider-credential.service';
import { ConnectAiProviderCredentialDTO, CreateAiProviderCredentialDTO, UpdateAiProviderCredentialDTO } from './dto';
/**
 * Per-tenant BYOK ("bring your own key") AI provider credential endpoints.
 *
 * All routes require the `AI_CHAT_SETTINGS` permission. API keys are stored
 * encrypted at rest and are NEVER returned decrypted — read responses only
 * contain a masked hint (`'••••' + last 4 characters`).
 */
export declare class AiProviderCredentialController {
    private readonly aiProviderCredentialService;
    constructor(aiProviderCredentialService: AiProviderCredentialService);
    /**
     * Retrieve the current tenant's AI provider credentials with masked API keys.
     *
     * @returns A paginated list of credentials; `apiKey` is always masked.
     */
    findAll(): Promise<IPagination<IAiProviderCredential>>;
    /**
     * Create or update the tenant's credential for a provider
     * (one credential per provider per tenant).
     *
     * @param entity - The credential payload; the API key is encrypted before storage.
     * @returns The persisted credential with a masked API key.
     */
    upsert(entity: CreateAiProviderCredentialDTO): Promise<IAiProviderCredential>;
    /**
     * Complete a provider "Connect" flow (e.g. OpenRouter PKCE): the backend
     * exchanges the authorization code + PKCE verifier for an API key and
     * stores it as the tenant's credential — the key never reaches the browser.
     *
     * @param entity - Provider id + PKCE code/verifier from the provider callback.
     * @returns The persisted credential with a masked API key.
     */
    connect(entity: ConnectAiProviderCredentialDTO): Promise<IAiProviderCredential>;
    /**
     * Update an existing AI provider credential by its ID.
     *
     * @param id - The UUID of the credential to update.
     * @param entity - The fields to update; a provided API key is re-encrypted.
     * @returns The updated credential with a masked API key.
     */
    update(id: ID, entity: UpdateAiProviderCredentialDTO): Promise<IAiProviderCredential>;
    /**
     * Delete an AI provider credential by its ID.
     *
     * @param id - The UUID of the credential to delete.
     * @returns The delete result.
     */
    delete(id: ID): Promise<DeleteResult>;
}
