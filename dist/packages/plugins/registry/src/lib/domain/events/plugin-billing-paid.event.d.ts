import { IEvent } from '@nestjs/cqrs';
import { IPluginBilling } from '../../shared/models/plugin-billing.model';
/**
 * Domain event for when a billing payment is successful
 */
export declare class PluginBillingPaidEvent implements IEvent {
    readonly billing: IPluginBilling;
    readonly paymentReference?: string;
    constructor(billing: IPluginBilling, paymentReference?: string);
}
