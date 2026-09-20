import { IEvent } from '@nestjs/cqrs';
export declare class PluginSettingCreatedEvent implements IEvent {
    readonly settingId: string;
    readonly pluginId: string;
    readonly key: string;
    readonly value: any;
    readonly tenantId: string;
    readonly organizationId?: string;
    readonly userId?: string;
    readonly timestamp: Date;
    constructor(settingId: string, pluginId: string, key: string, value: any, tenantId: string, organizationId?: string, userId?: string, timestamp?: Date);
}
