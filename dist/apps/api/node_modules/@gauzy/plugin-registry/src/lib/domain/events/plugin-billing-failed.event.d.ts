import { IEvent } from '@nestjs/cqrs';
import { IPluginBilling } from '../../shared/models/plugin-billing.model';
/**
 * Domain event for when a billing payment fails
 */
export declare class PluginBillingFailedEvent implements IEvent {
    readonly billing: IPluginBilling;
    readonly reason: string;
    constructor(billing: IPluginBilling, reason: string);
}
