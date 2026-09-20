import { GithubService } from './github.service';
import { GithubOAuthStateService } from './github-oauth-state.service';
import { GithubAppInstallDTO, GithubInstallStateDTO, GithubOAuthDTO } from './dto';
export declare class GitHubController {
    private readonly _githubService;
    private readonly _githubOAuthStateService;
    constructor(_githubService: GithubService, _githubOAuthStateService: GithubOAuthStateService);
    /**
     * Mint a single-use, tenant-bound state nonce used to start a GitHub App installation.
     *
     * The nonce is handed to GitHub as the `state` query param and echoed back on the post-install
     * callback, so the resulting installation is bound to the tenant/organization that actually
     * initiated the flow — closing the cross-tenant installation hijack (GHSA-4rwq-65wh-45h4).
     *
     * @param input The tenant/organization initiating the installation.
     * @returns The opaque `state` nonce to pass to GitHub.
     */
    createInstallationState(input: GithubInstallStateDTO): Promise<{
        state: string;
    }>;
    /**
     *
     * @param body
     * @returns
     */
    addGithubAppInstallation(input: GithubAppInstallDTO): Promise<import("@gauzy/contracts").IIntegrationTenant>;
    /**
     *
     * @param body
     * @returns
     */
    oAuthEndpointAuthorization(input: GithubOAuthDTO): Promise<import("@gauzy/contracts").IIntegrationTenant>;
}
