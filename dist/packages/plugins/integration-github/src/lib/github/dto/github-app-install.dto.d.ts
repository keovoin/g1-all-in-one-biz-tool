import { IGithubAppInstallInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 *
 */
export declare enum GithubSetupActionEnum {
    INSTALL = "install",
    UPDATE = "update"
}
/**
 *
 */
export declare class GithubOAuthDTO extends TenantOrganizationBaseDTO implements IGithubAppInstallInput {
    readonly code: string;
}
/**
 * Payload for minting a single-use, tenant-bound state nonce that starts a GitHub App
 * installation flow (see GithubOAuthStateService / GHSA-4rwq-65wh-45h4).
 */
export declare class GithubInstallStateDTO extends TenantOrganizationBaseDTO {
}
/**
 *
 */
export declare class GithubAppInstallDTO implements IGithubAppInstallInput {
    readonly installation_id: string;
    readonly setup_action: GithubSetupActionEnum;
    /**
     * Single-use state nonce minted by `POST /integration/github/install/state` when the flow was
     * initiated. Required: it binds the installation to the initiating tenant/organization and
     * prevents cross-tenant installation hijacking (GHSA-4rwq-65wh-45h4). Format: 64-char lowercase
     * hex (32 random bytes).
     */
    readonly state: string;
}
