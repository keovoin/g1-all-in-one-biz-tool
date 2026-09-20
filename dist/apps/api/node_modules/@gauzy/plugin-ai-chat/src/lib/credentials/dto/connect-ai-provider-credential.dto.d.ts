import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 * DTO for completing a provider "Connect" flow (e.g. OpenRouter PKCE).
 *
 * The browser is sent to the provider's authorize page with a PKCE
 * challenge; the provider redirects back with a one-time `code`. The
 * backend exchanges `code` + `codeVerifier` for an API key server-side
 * (the key never passes through the browser) and stores it as the
 * tenant's BYOK credential.
 */
export declare class ConnectAiProviderCredentialDTO extends TenantOrganizationBaseDTO {
    providerId: string;
    code: string;
    codeVerifier: string;
}
