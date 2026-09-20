import { IEvent } from '@nestjs/cqrs';
import { IPluginBilling } from '../../shared/models/plugin-billing.model';
/**
 * Domain event for when a billing becomes overdue
 */
export declare class PluginBillingOverdueEvent implements IEvent {
    readonly billing: IPluginBilling;
    constructor(billing: IPluginBilling);
}
