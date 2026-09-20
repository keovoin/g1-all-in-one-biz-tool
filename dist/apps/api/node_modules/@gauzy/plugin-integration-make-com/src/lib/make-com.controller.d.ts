import { MakeComService } from './make-com.service';
import { IMakeComIntegrationSettings } from './interfaces/make-com.model';
import { UpdateMakeComSettingsDTO } from './dto';
import { MakeComOAuthService } from './make-com-oauth.service';
export declare class MakeComController {
    private readonly makeComService;
    private readonly makeComOAuthService;
    constructor(makeComService: MakeComService, makeComOAuthService: MakeComOAuthService);
    /**
     * Retrieves the Make.com integration settings for the current tenant.
     *
     * @returns {Promise<IMakeComIntegrationSettings>} A promise that resolves with the tenant's Make.com integration settings.
     */
    getSettings(): Promise<IMakeComIntegrationSettings>;
    /**
     * Updates the Make.com integration settings for the current tenant.
     *
     * @param {UpdateMakeComSettingsDTO} input - The DTO containing the updated Make.com settings.
     * @returns {Promise<IMakeComIntegrationSettings>} A promise that resolves to the updated integration settings.
     */
    updateIntegrationSettings(settings: UpdateMakeComSettingsDTO): Promise<IMakeComIntegrationSettings>;
    /**
     * Initialize Make.com OAuth integration for the current tenant.
     * Client credentials are read from server-side environment variables
     * and are never exposed to tenants.
     */
    initializeIntegration(body: {
        organizationId?: string;
    }): Promise<{
        authorizationUrl: string;
        integrationId: string;
    }>;
    /**
     * Handle Token requests from Make.com custom apps.
     * This endpoint is called by your Make.com custom app during the OAuth flow.
     * It's configured in your custom app's "token" section.
     */
    tokenEndpoint(body: {
        grant_type: string;
        code: string;
        state: string;
        client_id: string;
        client_secret: string;
        redirect_uri: string;
    }): Promise<{
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
    }>;
}
