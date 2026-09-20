import { IEvent } from '@nestjs/cqrs';
import { IPluginBilling } from '../../shared/models/plugin-billing.model';
/**
 * Domain event for when a billing record is created
 */
export declare class PluginBillingCreatedEvent implements IEvent {
    readonly billing: IPluginBilling;
    constructor(billing: IPluginBilling);
}
