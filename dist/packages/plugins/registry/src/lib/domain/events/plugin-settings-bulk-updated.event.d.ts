import { IEvent } from '@nestjs/cqrs';
export declare class PluginSettingsBulkUpdatedEvent implements IEvent {
    readonly pluginId: string;
    readonly changedSettings: Array<{
        key: string;
        newValue: any;
        oldValue: any;
    }>;
    readonly pluginTenantId?: string;
    readonly tenantId?: string;
    readonly organizationId?: string;
    readonly userId?: string;
    readonly timestamp: Date;
    constructor(pluginId: string, changedSettings: Array<{
        key: string;
        newValue: any;
        oldValue: any;
    }>, pluginTenantId?: string, tenantId?: string, organizationId?: string, userId?: string, timestamp?: Date);
}
