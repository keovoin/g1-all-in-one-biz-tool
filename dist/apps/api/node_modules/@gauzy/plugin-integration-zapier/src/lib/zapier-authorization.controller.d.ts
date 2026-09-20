import { ConfigService } from '@gauzy/config';
import { Response } from 'express';
import { IntegrationEnum } from '@gauzy/contracts';
import { ZapierService } from './zapier.service';
export declare class ZapierAuthorizationController {
    private readonly _config;
    private readonly zapierService;
    private readonly logger;
    constructor(_config: ConfigService, zapierService: ZapierService);
    /**
     * Handles the OAuth2 authorization request
     * This is the entry point of the OAuth flow
     */
    authorize({ state }: {
        state: string;
    }): Promise<string>;
    /**
     * Handles the OAuth callback from Zapier after user authorization.
     * Exchanges the received code for access and refresh tokens.
     */
    callback(query: any, res: Response): Promise<void>;
    /**
     * OAuth token exchange endpoint — @Public() so Zapier platform can call it.
     * Exchanges authorization code for access and refresh tokens.
     */
    exchangeCodeForToken(body: {
        code: string;
        client_id: string;
        client_secret: string;
        redirect_uri: string;
        grant_type: string;
    }): Promise<import("./zapier.types").IZapierAccessTokens>;
    /**
     * OAuth token refresh endpoint — @Public() so Zapier platform can call it.
     * Refreshes an expired access token using a refresh token.
     */
    refreshAccessToken(body: {
        refresh_token: string;
        client_id: string;
        client_secret: string;
        grant_type: string;
    }): Promise<import("./zapier.types").IZapierAccessTokens>;
    /**
     * Auth test endpoint — validates a Zapier access token.
     * Called by the Zapier CLI app to verify the connection is working.
     * Supports both opaque tokens (legacy) and JWT tokens (multi-app OAuth).
     */
    testAuth(authHeader: string): Promise<{
        authenticated: boolean;
        integrationId: string | undefined;
        name: IntegrationEnum;
        userId?: undefined;
        tenantId?: undefined;
    } | {
        authenticated: boolean;
        userId: string;
        tenantId: string;
        name: IntegrationEnum;
        integrationId?: undefined;
    }>;
    /**
     * Connection label endpoint — returns integration info for Zapier's UI.
     * Called by the Zapier CLI app to display a label for the connected account.
     * Supports both opaque tokens (legacy) and JWT tokens (multi-app OAuth).
     */
    getConnectionInfo(authHeader: string): Promise<{
        id: string | undefined;
        name: IntegrationEnum;
        email: string;
    }>;
}
