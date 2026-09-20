import { IZapierCreateZapInput, IZapierZap, IZapierZapTemplate } from '@gauzy/contracts';
import { ZapierService } from './zapier.service';
import { IZapierEndpoint, IZapierIntegrationSettings } from './zapier.types';
export declare class ZapierController {
    private readonly zapierService;
    private readonly logger;
    /**
     * Creates an instance of the ZapierController.
     * Initializes the controller with the required services for managing Zapier integrations.
     * Ensures that the necessary configuration values are properly set in the environment variables.
     * These are essential for enabling secure and functional Zapier integrations.
     */
    constructor(zapierService: ZapierService);
    /**
     * Initialize a new Zapier integration.
     * Stores client credentials and returns the authorization URL to redirect
     * the admin to Zapier's OAuth consent page.
     */
    initializeIntegration(body: {
        organizationId: string;
    }): Promise<{
        authorizationUrl: string;
        integrationId: string | undefined;
    }>;
    /**
     * Get available Zapier triggers.
     * This method retrieves the available triggers from Zapier based on the provided token.
     */
    getTriggers(token: string): Promise<IZapierEndpoint[]>;
    getActions(token: string): Promise<IZapierEndpoint[]>;
    /**
     * Get Zaps for the authenticated Zapier account.
     */
    getZaps(token: string): Promise<IZapierZap[]>;
    /**
     * Create a new Zap on the authenticated Zapier account.
     */
    createZap(token: string, body: IZapierCreateZapInput): Promise<IZapierZap>;
    /**
     * Get publicly available Zap templates from Zapier.
     * This Zapier endpoint does not require an OAuth access token — it only
     * needs the server-configured `client_id`, which is attached in the service.
     */
    getZapTemplates(limit?: string): Promise<IZapierZapTemplate[]>;
    /**
     * Helper method to validate Zapier token
     */
    private validateToken;
    /**
     * Helper method to handle Zapier endpoint errors
     */
    private handleZapierError;
    /**
     * Get Zapier access token for a given integration
     */
    getZapierToken(integrationId: string): Promise<import("@gauzy/contracts").IIntegrationSetting>;
    /**
     * Retrieves the Zapier integration settings for the current tenant.
     *
     * @returns {Promise<IZapierIntegrationSettings>} A promise that resolves with the tenant's Zapier integration settings.
     */
    getSettings(): Promise<IZapierIntegrationSettings>;
}
