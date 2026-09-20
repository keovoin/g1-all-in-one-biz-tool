import { ID } from '@gauzy/contracts';
import { EverAsyncIntegrationService } from './ever-async-integration.service';
import { ConfigureEverAsyncIntegrationDto, UpdateEverAsyncSettingsDto, VerifyEverAsyncConnectionDto } from './dto';
export declare class EverAsyncController {
    private readonly service;
    constructor(service: EverAsyncIntegrationService);
    setupIntegration(dto: ConfigureEverAsyncIntegrationDto, organizationId?: ID): Promise<{
        apiKey: string;
        apiSecret: string;
        tenantId: string;
        organizationId: string;
        integrationTenantId: string | undefined;
    }>;
    getSettings(organizationId?: ID): Promise<{
        integrationTenantId: string;
        tenantId: string;
        organizationId: string;
        serverUrl: string;
        userMappings: {
            channel: string;
            workspace: string;
            chatUserId: string;
            employeeId: ID;
        }[];
        projectIds: string[];
        isEnabled: boolean;
        hasApiKey: boolean;
    }>;
    getOptions(organizationId?: ID): Promise<{
        employees: {
            id: string | undefined;
            name: string | undefined;
        }[];
        projects: {
            id: string | undefined;
            name: string;
        }[];
    }>;
    updateSettings(dto: UpdateEverAsyncSettingsDto, organizationId?: ID): Promise<{
        integrationTenantId: string;
        updated: boolean;
    }>;
    rotateCredentials(organizationId?: ID): Promise<{
        integrationTenantId: string;
        tenantId: string;
        organizationId: string;
        apiKey: string;
        apiSecret: string;
    }>;
    verifyConnection(dto: VerifyEverAsyncConnectionDto): Promise<{
        ok: boolean;
        serverUrl: string;
    }>;
    getStatus(organizationId?: ID): Promise<{
        isEnabled: boolean;
        integrationTenantId: string | null;
    }>;
    removeIntegration(integrationTenantId: ID, organizationId?: ID): Promise<{
        success: boolean;
    }>;
}
