import { IJobPreset } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class CreateJobPresetCommand implements ICommand {
    readonly input: IJobPreset;
    static readonly type = "[JobPreset] Create";
    constructor(input: IJobPreset);
}
