import { ID } from '@gauzy/contracts';
import { PlaneIntegrationService } from './plane-integration.service';
import { ConfigurePlaneIntegrationDto } from './dto/configure-plane-integration.dto';
import { UpdatePlaneSettingsDto } from './dto/update-plane-settings.dto';
export declare class PlaneController {
    private readonly planeIntegrationService;
    constructor(planeIntegrationService: PlaneIntegrationService);
    /**
     * Configure Plane integration for the current tenant.
     * Auto-generates API key and secret.
     */
    setupIntegration(dto: ConfigurePlaneIntegrationDto, organizationId?: string): Promise<{
        integrationTenantId: ID;
        apiKey: string;
        apiSecret: string;
    }>;
    /**
     * Get current Plane integration settings for the tenant.
     * Does NOT return API key or secret.
     */
    getSettings(organizationId?: string): Promise<{
        integrationTenantId: ID;
        mode: "shared" | "custom";
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
}
