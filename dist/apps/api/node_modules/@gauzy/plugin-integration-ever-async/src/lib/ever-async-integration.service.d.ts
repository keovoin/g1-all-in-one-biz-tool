import { OnApplicationBootstrap } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DataSource } from 'typeorm';
import { ID } from '@gauzy/contracts';
import { ConfigureEverAsyncIntegrationDto, UpdateEverAsyncSettingsDto } from './dto';
export interface EverAsyncConnectorScope {
    integrationTenantId: ID;
    tenantId: ID;
    organizationId: ID;
    projectIds: ID[];
    userMappings: {
        channel: string;
        workspace: string;
        chatUserId: string;
        employeeId: ID;
    }[];
}
/** Organization-scoped management and a separate, read-only connector boundary. */
export declare class EverAsyncIntegrationService implements OnApplicationBootstrap {
    private readonly dataSource;
    private readonly httpService;
    private readonly httpsAgent;
    private static readonly sqliteTransactions;
    constructor(dataSource: DataSource, httpService: HttpService);
    /** SQLite shares one connection; queue plugin transactions rather than nesting them. */
    private transaction;
    onApplicationBootstrap(): Promise<void>;
    /** Make the plugin discoverable on existing installations as well as fresh seeds. */
    private ensureCatalog;
    private scope;
    private find;
    private requireIntegration;
    private settings;
    private parseArray;
    private set;
    private credentials;
    private serverUrl;
    private validateSelection;
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
    private mutate;
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
    getStatus(organizationId?: ID): Promise<{
        isEnabled: boolean;
        integrationTenantId: string | null;
    }>;
    removeIntegration(integrationTenantId: ID, organizationId?: ID): Promise<{
        success: boolean;
    }>;
    verifyConnection(serverUrl: string): Promise<{
        ok: boolean;
        serverUrl: string;
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
    authenticateConnector(integrationTenantId: string, apiKey: string, apiSecret: string): Promise<EverAsyncConnectorScope>;
    getConnectorTasks(scope: EverAsyncConnectorScope, query: {
        channel?: string;
        workspace?: string;
        chatUserId?: string;
        taskId?: ID;
    }): Promise<{
        items: {
            id: string | undefined;
            title: string;
            status: import("@gauzy/contracts").TaskStatusEnum | null;
            taskNumber: number | null;
            projectId: string | undefined;
        }[];
        total: number;
    }>;
}
