import { ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { CustomTrackingBulkCreateCommand } from '../custom-tracking-bulk-create.command';
import { BulkProcessResult } from '../../dto';
/**
 * Handler for bulk creation of custom tracking data
 * Processes multiple tracking data entries sequentially to maintain data consistency
 */
export declare class CustomTrackingBulkCreateHandler implements ICommandHandler<CustomTrackingBulkCreateCommand> {
    private readonly commandBus;
    private readonly logger;
    constructor(commandBus: CommandBus);
    /**
     * Execute bulk creation of custom tracking data
     * @param command The bulk create command containing array of tracking data inputs
     * @returns Promise resolving to array of results for each processed entry
     */
    execute(command: CustomTrackingBulkCreateCommand): Promise<BulkProcessResult[]>;
}
