import { Response } from 'express';
import { ConfigService } from '@gauzy/config';
import { IGithubAppInstallInput } from '@gauzy/contracts';
import { GithubOAuthStateService } from './github-oauth-state.service';
export declare class GitHubAuthorizationController {
    private readonly _config;
    private readonly _githubOAuthStateService;
    constructor(_config: ConfigService, _githubOAuthStateService: GithubOAuthStateService);
    /**
     * Public post-install callback hit by GitHub after a user installs the GitHub App.
     *
     * @param query
     * @param response
     */
    githubIntegrationPostInstallCallback(query: IGithubAppInstallInput, response: Response): Promise<void>;
}
