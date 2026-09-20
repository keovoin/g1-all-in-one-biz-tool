import { ConfigService } from '@gauzy/config';
import { Response } from 'express';
import { MakeComOAuthService } from './make-com-oauth.service';
export declare class MakeComAuthorizationController {
    private readonly config;
    private readonly makeComOAuthService;
    private readonly logger;
    constructor(config: ConfigService, makeComOAuthService: MakeComOAuthService);
    /**
     * Initiates the OAuth 2.0 authorization flow with Make.com.
     * Redirects the user to the Make.com authorization page.
     *
     * @param {object} params - The query parameters.
     * @param {string} [params.state] - Optional state parameter for OAuth flow.
     */
    authorize({ state }: {
        state?: string;
    }): Promise<{
        authorizationUrl: string;
    }>;
    /**
     * Resolve the post-install redirect URL from config, with fallback to
     * the statically resolved constant (which doesn't rely on dotenv-expand).
     */
    private getPostInstallUrl;
    /**
     * Build a redirect URL by appending query params.
     * Handles hash-based Angular routing (e.g. http://host/#/path) by placing
     * query params within the hash fragment, after the route path.
     */
    private buildRedirectUrl;
    /**
     * Handles the callback from Make.com after user authorization.
     * Exchanges the authorization code for access and refresh tokens.
     *
     * @param {object} query - The query parameters from the callback.
     * @param {Response} response - Express Response object.
     */
    callback({ code, state, error, error_description }: {
        code?: string;
        state?: string;
        error?: string;
        error_description?: string;
    }, response: Response): Promise<void>;
}
