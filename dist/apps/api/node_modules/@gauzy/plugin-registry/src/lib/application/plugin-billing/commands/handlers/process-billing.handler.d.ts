import { ICommandHandler } from '@nestjs/cqrs';
import { PluginBillingService } from '../../../../domain';
import { ProcessBillingCommand } from '../process-billing.command';
export declare class ProcessBillingCommandHandler implements ICommandHandler<ProcessBillingCommand> {
    private readonly pluginBillingService;
    constructor(pluginBillingService: PluginBillingService);
    execute(command: ProcessBillingCommand): Promise<import("../../../../domain").PluginBilling | import("typeorm").UpdateResult>;
}
