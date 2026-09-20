import { ICommand } from '@nestjs/cqrs';
import { IPluginBillingCreateInput } from '../../../shared';
/**
 * Command for creating a new plugin billing record
 */
export declare class PluginBillingCreateCommand implements ICommand {
    readonly input: IPluginBillingCreateInput;
    static readonly type = "[PluginBilling] Create";
    constructor(input: IPluginBillingCreateInput);
}
