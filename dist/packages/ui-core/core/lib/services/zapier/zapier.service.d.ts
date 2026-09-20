import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IZapierEndpoint, IZapierOAuthTokenDTO, IZapierWebhook, IZapierCreateWebhookInput, IZapierAuthConfig, IZapierIntegrationSettings, IIntegrationSetting, IZapierZap, IZapierCreateZapInput, IZapierZapTemplate, ID } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ZapierService {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Get OAuth configuration
     */
    getOAuthConfig(): Observable<IZapierAuthConfig>;
    /**
     * Get Zapier integration settings
     */
    getSettings(): Observable<IZapierIntegrationSettings>;
    /**
     * Get Zapier access token for a given integration
     */
    getZapierToken(integrationId: string): Observable<IIntegrationSetting>;
    /**
     * Extract and return the OAuth access token from integration settings
     * Handles different token storage formats (JSON string, object, or direct string)
     */
    getAccessToken(integrationId: ID): Observable<string>;
    /**
     * Update Zapier integration settings
     */
    updateSettings(settings: IZapierIntegrationSettings): Observable<IZapierIntegrationSettings>;
    /**
     * Initialize a new Zapier integration.
     * No client credentials needed — server uses its own env-configured credentials.
     */
    initializeIntegration(body: {
        organizationId: string;
    }): Observable<{
        authorizationUrl: string;
        integrationId: string;
    }>;
    /**
     * Get available Zapier triggers
     */
    getTriggers(token: string): Observable<IZapierEndpoint[]>;
    /**
     * Get available Zapier actions
     */
    getActions(token: string): Observable<IZapierEndpoint[]>;
    /**
     * Get Zaps for the authenticated Zapier account
     */
    getZaps(token: string): Observable<IZapierZap[]>;
    /**
     * Create a new Zap on the authenticated Zapier account
     */
    createZap(body: IZapierCreateZapInput, token: string): Observable<IZapierZap>;
    /**
     * Get publicly available Zap templates.
     * Zap templates do not require an OAuth access token — the server attaches
     * the configured `client_id` on the way out to Zapier.
     */
    getZapTemplates(limit?: number): Observable<IZapierZapTemplate[]>;
    /**
     * Exchange authorization code for tokens
     */
    exchangeCodeForToken(body: {
        code: string;
        client_id: string;
        client_secret: string;
        redirect_uri: string;
        grant_type: string;
    }): Observable<IZapierOAuthTokenDTO>;
    /**
     * Refresh access token
     */
    refreshAccessToken(body: {
        refresh_token: string;
        client_id: string;
        client_secret: string;
        grant_type: string;
    }): Observable<IZapierOAuthTokenDTO>;
    /**
     * Initiate OAuth2 authorization with Zapier
     */
    authorize(state: string): Observable<{
        url: string;
    }>;
    /**
     * Get all webhooks
     */
    getWebhooks(token: string): Observable<IZapierWebhook[]>;
    /**
     * Create a new Zapier webhook subscription
     */
    createWebhook(body: IZapierCreateWebhookInput, token: string): Observable<IZapierWebhook>;
    /**
     * Delete an existing Zapier webhook subscription
     */
    deleteWebhook(id: string, token: string): Observable<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ZapierService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ZapierService>;
}
