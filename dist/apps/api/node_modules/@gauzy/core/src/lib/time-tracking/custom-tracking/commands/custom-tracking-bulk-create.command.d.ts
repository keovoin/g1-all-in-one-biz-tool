import { ICommand } from '@nestjs/cqrs';
import { IProcessTrackingDataInput } from '@gauzy/contracts';
/**
 * Command for bulk creation of custom tracking data
 */
export declare class CustomTrackingBulkCreateCommand implements ICommand {
    readonly input: IProcessTrackingDataInput[];
    static readonly type = "[Custom Tracking] Bulk Create";
    constructor(input: IProcessTrackingDataInput[]);
}
