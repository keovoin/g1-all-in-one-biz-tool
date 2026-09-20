import { ConfigService } from '@gauzy/config';
import { IntegrationSettingService, IntegrationService, IntegrationTenantService } from '@gauzy/core';
import { IIntegrationTenant } from '@gauzy/contracts';
import { IMakeComIntegrationSettings } from './interfaces/make-com.model';
import { CommandBus } from '@nestjs/cqrs';
export declare class MakeComService {
    private readonly _commandBus;
    private readonly config;
    private readonly integrationSettingService;
    private readonly integrationTenantService;
    private readonly integrationService;
    private readonly logger;
    constructor(_commandBus: CommandBus, config: ConfigService, integrationSettingService: IntegrationSettingService, integrationTenantService: IntegrationTenantService, integrationService: IntegrationService);
    /**
     * Retrieves Make.com integration settings for the current tenant and organization.
     *
     * @param {string} [organizationId] - Optional organization ID to filter by organization level
     * @returns {Promise<IMakeComIntegrationSettings>} A promise that resolves to the Make.com integration settings.
     */
    getIntegrationSettings(organizationId?: string): Promise<IMakeComIntegrationSettings>;
    /**
     * Updates Make.com integration settings for the current tenant and organization.
     *
     * @param {Object} input - The settings to update.
     * @param {boolean} input.isEnabled - Whether the integration is enabled.
     * @param {string} input.webhookUrl - The webhook URL for Make.com.
     * @param {string} [organizationId] - Optional organization ID to filter by organization level
     * @returns {Promise<IMakeComIntegrationSettings>} A promise that resolves to the updated settings.
     */
    updateIntegrationSettings(input: {
        isEnabled?: boolean;
        webhookUrl?: string;
    }, organizationId?: string): Promise<IMakeComIntegrationSettings>;
    /**
     * Add Make.com integration settings for the current tenant and organization.
     * Client credentials (client_id, client_secret) are read from server-side
     * environment variables and are never exposed to tenants.
     *
     * @param {string} [organizationId] - Optional organization ID for organization-level integration
     * @returns The created integration tenant.
     */
    addIntegrationSettings(organizationId?: string): Promise<IIntegrationTenant>;
    /**
     * Retrieves the OAuth client ID for the Make.com integration from server-side config.
     *
     * @returns {Promise<string | null>} A promise that resolves to the OAuth client ID or null if not configured.
     */
    getOAuthClientId(): Promise<string | null>;
}
