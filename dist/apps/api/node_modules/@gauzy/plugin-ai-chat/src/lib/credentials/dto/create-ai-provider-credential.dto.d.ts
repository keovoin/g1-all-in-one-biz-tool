import { IAiProviderCredentialCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 * DTO for creating (or upserting) a per-tenant BYOK AI provider credential.
 * The `apiKey` is write-only: it is encrypted before storage and never
 * returned in full by any read endpoint.
 *
 * `apiKey` is OPTIONAL at the DTO level: providers that advertise `requiresApiKey: false` (local
 * speech servers, self-hosted OpenAI-compatible endpoints) may be saved with only a base URL. The
 * service enforces "key required" per provider definition, so a cloud provider still gets a 400.
 */
export declare class CreateAiProviderCredentialDTO extends TenantOrganizationBaseDTO implements IAiProviderCredentialCreateInput {
    providerId: string;
    apiKey?: string;
    baseUrl?: string;
    enabled: boolean;
    isDefault?: boolean;
    defaultModel?: string | null;
    isVoiceDefault?: boolean;
    speechModel?: string | null;
}
