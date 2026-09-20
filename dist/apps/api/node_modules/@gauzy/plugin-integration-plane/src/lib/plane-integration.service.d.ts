import { ID } from '@gauzy/contracts';
import { IntegrationService, IntegrationTenantService, TenantApiKeyService } from '@gauzy/core';
import { ConfigService } from '@gauzy/config';
import { ConfigurePlaneIntegrationDto } from './dto/configure-plane-integration.dto';
import { UpdatePlaneSettingsDto } from './dto/update-plane-settings.dto';
export declare class PlaneIntegrationService {
    private readonly integrationService;
    private readonly integrationTenantService;
    private readonly tenantApiKeyService;
    private readonly configService;
    private readonly logger;
    constructor(integrationService: IntegrationService, integrationTenantService: IntegrationTenantService, tenantApiKeyService: TenantApiKeyService, configService: ConfigService);
    /**
     * Configure Plane integration for the current tenant.
     * Finds or creates the base Integration record, auto-generates API credentials,
     * and stores all settings in the database.
     *
     * @param dto - The Plane UI URLs to configure
     * @param organizationId - Optional organization scope
     * @returns Integration tenant ID and the generated API credentials (plain text, shown once)
     */
    setupIntegration(dto: ConfigurePlaneIntegrationDto, organizationId?: string): Promise<{
        integrationTenantId: ID;
        apiKey: string;
        apiSecret: string;
    }>;
    /**
     * Retrieve the current Plane integration settings for the tenant.
     * API key and secret are NOT returned (security).
     */
    getSettings(_organizationId?: string): Promise<{
        integrationTenantId: ID;
        mode: 'shared' | 'custom';
        planeWebUrl: string;
        planeAdminUrl: string;
        planeSpaceUrl: string;
        isEnabled: boolean;
        hasApiKey: boolean;
    }>;
    /**
     * Update Plane UI URLs for the current tenant.
     */
    updateSettings(dto: UpdatePlaneSettingsDto, organizationId?: string): Promise<{
        integrationTenantId: ID;
        updated: boolean;
    }>;
    /**
     * Remove/archive Plane integration for the tenant.
     */
    removeIntegration(integrationTenantId: ID): Promise<{
        success: boolean;
    }>;
    /**
     * Regenerate API key and secret for the Plane integration.
     * The old credentials become invalid.
     *
     * Flow: create new key → persist reference → delete old key.
     * We use TenantApiKeyService.create() directly because generateApiKey()
     * enforces a tenant-wide one-key limit. Creating first ensures the
     * integration is never left keyless if any step fails.
     */
    regenerateApiKey(organizationId?: string): Promise<{
        apiKey: string;
        apiSecret: string;
    }>;
    /**
     * Check if Plane integration is enabled for the current tenant.
     */
    getStatus(): Promise<{
        isEnabled: boolean;
        integrationTenantId: ID | null;
    }>;
    /**
     * Resolve the full Plane proxy configuration for a given tenant.
     * Used by PlaneProxyService for per-request config resolution.
     */
    getConfigForTenant(tenantId: ID): Promise<{
        externalBaseApiUrl: string;
        apiKey: string;
        apiSecret: string;
        clientBaseUrl: string;
        clientAdminUrl: string;
        clientSpaceUrl: string;
    } | null>;
    /**
     * Find the Plane IntegrationTenant for the given tenant ID.
     */
    private findIntegrationTenant;
    /**
     * Find the Plane IntegrationTenant or throw a 404.
     */
    private findIntegrationTenantOrFail;
    /**
     * Find or create the base Integration record for Plane.
     */
    private findOrCreateBaseIntegration;
    /**
     * Build a key-value map from an array of IntegrationSettings.
     */
    private buildSettingsMap;
}
