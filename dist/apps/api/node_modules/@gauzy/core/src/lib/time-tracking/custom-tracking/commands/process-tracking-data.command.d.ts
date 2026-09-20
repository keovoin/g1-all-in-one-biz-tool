import { ICommand } from '@nestjs/cqrs';
import { IProcessTrackingDataInput } from '@gauzy/contracts';
export declare class ProcessTrackingDataCommand implements ICommand {
    readonly input: IProcessTrackingDataInput;
    static readonly type = "[Custom Tracking] Process Tracking Data";
    constructor(input: IProcessTrackingDataInput);
}
