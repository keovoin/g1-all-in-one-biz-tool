import { ICommand } from '@nestjs/cqrs';
import { BulkPluginPlanOperationDTO } from '../../../shared';
export declare class BulkPluginPlanOperationCommand implements ICommand {
    readonly operationDto: BulkPluginPlanOperationDTO;
    static readonly type = "[Plugin Subscription Plan] Bulk Operation";
    constructor(operationDto: BulkPluginPlanOperationDTO);
}
