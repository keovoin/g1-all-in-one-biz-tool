import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { EverAsyncConnectorScope, EverAsyncIntegrationService } from './ever-async-integration.service';
type ConnectorRequest = Request & {
    everAsyncScope: EverAsyncConnectorScope;
};
export declare class EverAsyncConnectorGuard implements CanActivate {
    private readonly service;
    constructor(service: EverAsyncIntegrationService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
/** Public bypasses the user JWT guard only; the dedicated credential guard is mandatory. */
export declare class EverAsyncConnectorController {
    private readonly service;
    constructor(service: EverAsyncIntegrationService);
    status(request: ConnectorRequest): {
        integrationTenantId: string;
        tenantId: string;
        organizationId: string;
        isEnabled: boolean;
    };
    tasks(request: ConnectorRequest, chatUserId?: string, taskId?: string, channel?: string, workspace?: string): Promise<{
        items: {
            id: string | undefined;
            title: string;
            status: import("dist/packages/contracts/src").TaskStatusEnum | null;
            taskNumber: number | null;
            projectId: string | undefined;
        }[];
        total: number;
    }>;
}
export {};
