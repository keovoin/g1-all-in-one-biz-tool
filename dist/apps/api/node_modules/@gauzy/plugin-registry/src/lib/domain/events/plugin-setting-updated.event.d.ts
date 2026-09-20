import { IEvent } from '@nestjs/cqrs';
export declare class PluginSettingUpdatedEvent implements IEvent {
    readonly settingId: string;
    readonly pluginId: string;
    readonly key: string;
    readonly newValue: any;
    readonly previousValue: any;
    readonly tenantId: string;
    readonly organizationId?: string;
    readonly userId?: string;
    readonly timestamp: Date;
    constructor(settingId: string, pluginId: string, key: string, newValue: any, previousValue: any, tenantId: string, organizationId?: string, userId?: string, timestamp?: Date);
}
